// Validates every SQL migration + seed in an in-memory Postgres (PGlite)
// and exercises the Row Level Security rules as different kinds of users.
// Run: npm run db:check
import { PGlite } from "@electric-sql/pglite";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const db = new PGlite();
let failures = 0;
const ok = (msg) => console.log("  ✓", msg);
const fail = (msg) => { failures++; console.log("  ✗", msg); };

// ── Minimal stand-ins for what Supabase provides ──
await db.exec(`
  create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
  create schema auth;
  create table auth.users (id uuid primary key, email text);
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create schema storage;
  create table storage.buckets (id text primary key, name text, public bool, file_size_limit bigint, allowed_mime_types text[]);
  create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
  alter table storage.objects enable row level security;
  grant usage on schema public, auth to anon, authenticated;
  alter default privileges in schema public grant all on tables to anon, authenticated;
  alter default privileges in schema public grant all on sequences to anon, authenticated;
`);

console.log("Applying migrations");
const dir = join(root, "supabase/migrations");
for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
  try { await db.exec(readFileSync(join(dir, f), "utf8")); ok(f); }
  catch (e) { fail(`${f}: ${e.message}`); }
}
try { await db.exec(readFileSync(join(root, "supabase/seed.sql"), "utf8")); await db.exec(readFileSync(join(root, "supabase/seed.sql"), "utf8")); ok("seed.sql (applied twice — idempotent)"); }
catch (e) { fail(`seed.sql: ${e.message}`); }
if (failures) process.exit(1);

// ── Fixtures ──
const ADMIN = "00000000-0000-0000-0000-00000000000a";
const CHECKPOINT = "00000000-0000-0000-0000-00000000000c";
const INACTIVE = "00000000-0000-0000-0000-00000000000d";
await db.exec(`
  insert into auth.users values ('${ADMIN}','admin@x'),('${CHECKPOINT}','cp@x'),('${INACTIVE}','gone@x');
  insert into public.staff_profiles (user_id, display_name, is_active) values
    ('${ADMIN}','Admin',true),('${CHECKPOINT}','CP One',true),('${INACTIVE}','Former',false);
  insert into public.staff_roles values
    ('${ADMIN}','super_admin',null,now()),('${CHECKPOINT}','checkpoint_personnel',null,now()),('${INACTIVE}','super_admin',null,now());
  insert into public.participants (bib, full_name, public_name, category_id, status)
    select '0001','Test Runner','T. Runner', id, 'confirmed' from public.race_categories where code='5K';
  insert into public.participant_private (participant_id, contact_number, payment_status)
    select id,'09170000000','verified' from public.participants;
  insert into public.announcements (title, state, published_at) values ('Draft', 'draft', null), ('Live', 'published', now());
  insert into public.upcoming_activities (title, status) values ('Secret', 'reserved'), ('Teaser', 'coming_soon');
`);

async function as(role, uid, sql) {
  await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${uid ?? ""}', false); set role ${role};`);
  try { return { rows: (await db.query(sql)).rows }; }
  catch (e) { return { error: e.message }; }
  finally { await db.exec("reset role;"); }
}
async function expectRows(label, role, uid, sql, n) {
  const r = await as(role, uid, sql);
  if (r.error) fail(`${label} — error: ${r.error}`);
  else if (r.rows.length === n) ok(label);
  else fail(`${label} — expected ${n} rows, got ${r.rows.length}`);
}
async function expectDenied(label, role, uid, sql) {
  const r = await as(role, uid, sql);
  if (r.error || (r.rows && r.rows.length === 0)) ok(label);
  else fail(`${label} — was allowed`);
}

console.log("\nPublic visitor (anon)");
await expectRows("sees the 3 race categories", "anon", null, "select * from race_categories", 3);
await expectRows("cannot read participant names directly", "anon", null, "select * from participants", 0);
await expectRows("cannot read private participant data", "anon", null, "select * from participant_private", 0);
await expectRows("sees only PUBLISHED announcements", "anon", null, "select * from announcements", 1);
await expectRows("does not see DRAFT/RESERVED upcoming slots", "anon", null, "select * from upcoming_activities", 1);
await expectDenied("cannot insert announcements", "anon", null, "insert into announcements (title) values ('hack') returning id");
await expectDenied("cannot change settings", "anon", null, "update site_settings set value='{}' returning key");
await expectDenied("cannot write audit log", "anon", null, "select log_audit('x','y',null,'{}')");
{
  const r = await as("anon", null, "select public_registration_stats() as s");
  const s = r.rows?.[0]?.s;
  if (s && s.total_registered === 1 && s.total_confirmed === 1 && s.per_category.length === 3 && !JSON.stringify(s).includes("Runner"))
    ok("aggregate stats work and contain no names");
  else fail("aggregate stats: " + JSON.stringify(r));
}

console.log("\nCheckpoint personnel");
await expectRows("can look up runners (bib + name)", "authenticated", CHECKPOINT, "select bib, public_name from participants", 1);
await expectRows("CANNOT read contact/payment records", "authenticated", CHECKPOINT, "select * from participant_private", 0);
await expectDenied("cannot edit participants / bibs", "authenticated", CHECKPOINT, "update participants set bib='9999' returning id");
await expectDenied("cannot change site settings", "authenticated", CHECKPOINT, "update site_settings set value='{}' returning key");
await expectRows("cannot read audit logs", "authenticated", CHECKPOINT, "select * from audit_logs", 0);
await expectDenied("cannot grant itself a role", "authenticated", CHECKPOINT, `insert into staff_roles (user_id, role) values ('${CHECKPOINT}','super_admin') returning role`);

console.log("\nDeactivated account");
await expectRows("loses all admin access even with super_admin role", "authenticated", INACTIVE, "select * from participant_private", 0);

console.log("\nSuper administrator");
await expectRows("reads private participant data", "authenticated", ADMIN, "select * from participant_private", 1);
await expectRows("updates settings", "authenticated", ADMIN, "update site_settings set value = value where key='fun_run' returning key", 1);
await expectRows("writes audit entry via log_audit()", "authenticated", ADMIN, "select log_audit('settings.update','site_settings','fun_run','{}')", 1);
await expectRows("audit entry carries server-side actor", "authenticated", ADMIN, `select * from audit_logs where actor_id='${ADMIN}' and actor_name='Admin'`, 1);
await expectDenied("cannot delete audit entries", "authenticated", ADMIN, "delete from audit_logs returning id");
await expectDenied("cannot edit audit entries", "authenticated", ADMIN, "update audit_logs set action='x' returning id");

console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll database checks passed.");
process.exit(failures ? 1 : 0);
