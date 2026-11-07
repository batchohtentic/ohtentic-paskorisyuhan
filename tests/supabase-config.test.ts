import { test } from "node:test";
import assert from "node:assert/strict";
import { readSupabaseConfig, normalizeSupabaseUrl } from "../src/lib/supabase-config.ts";

const KEY = "sb_publishable_abc123";
const good = "https://abcdefghijklmnopqrst.supabase.co";

test("correct value passes through", () => {
  const c = readSupabaseConfig(good, KEY);
  assert.equal(c.ok, true); assert.equal(c.url, good); assert.equal(c.problem, null);
});

test("common paste mistakes are corrected", () => {
  for (const v of [` ${good} `, `"${good}"`, "abcdefghijklmnopqrst.supabase.co", `${good}/`, `${good}/rest/v1/`,
    "https://supabase.com/dashboard/project/abcdefghijklmnopqrst", "https://supabase.com/dashboard/project/abcdefghijklmnopqrst/settings/api"]) {
    assert.equal(normalizeSupabaseUrl(v).url, good, v);
  }
});

test("unusable values are reported, never thrown", () => {
  for (const [v, k] of [["not a url at all", KEY], [KEY, KEY], ["eyJhbGciOi.xxx", KEY], ["https://supabase.com", KEY], [good, "https://x.supabase.co"], [good, "sb_secret_zzz"], [good, ""]]) {
    const c = readSupabaseConfig(v, k);
    assert.equal(c.ok, false, `${v} / ${k}`); assert.ok(c.problem, `problem text for ${v} / ${k}`); assert.equal(c.url, "");
  }
});

test("nothing entered = unconfigured without a problem message", () => {
  const c = readSupabaseConfig(undefined, undefined);
  assert.equal(c.ok, false); assert.equal(c.problem, null);
});
