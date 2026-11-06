# Setup Guide — Phase 1

This guide takes you from zero to a working website with a secure admin login.
No programming experience is needed: you will mostly copy and paste.

**Time needed:** about 30–45 minutes.

---

## What you need (all free)

| Account | Why | Sign up |
|---|---|---|
| **GitHub** | Stores the website's code | https://github.com |
| **Supabase** | The database, staff logins, live updates and photo storage | https://supabase.com |
| **Vercel** | Puts the website on the internet | https://vercel.com (sign in with GitHub) |

You will **not** need Google or Facebook credentials until Phases 2 and 6.

---

## Step 1 — Create the Supabase project

1. Go to https://supabase.com/dashboard and click **New project**.
2. Name: `ohtentic-paskorisyuhan`. Choose a strong database password and **save it somewhere safe**.
3. Region: **Southeast Asia (Singapore)**. This is the closest region to Eastern Samar, so the site loads fastest there.
4. Wait about 2 minutes for the project to finish setting up.

## Step 2 — Create the database tables

1. In Supabase, open **SQL Editor** (left menu) and click **New query**.
2. Open each file below from the `supabase/migrations` folder **in this order**. Paste its contents into the editor and click **Run**:
   1. `20261106000001_foundation.sql`
   2. `20261106000002_race_core.sql`
   3. `20261106000003_content.sql`
   4. `20261106000004_storage.sql`
3. Finally, paste and run `supabase/seed.sql`. It adds the 5KM / 8KM / 12KM categories and the basic event information.

Each file should say **"Success. No rows returned."** If one shows an error, stop there and send me the message.

> Developers can instead run `supabase link` and then `supabase db push` using the Supabase CLI.

## Step 3 — Create your Super Administrator account

1. In Supabase, go to **Authentication → Users → Add user → Create new user**.
2. Enter your email and a strong password, and tick **Auto Confirm User**.
3. Go back to **SQL Editor** and run the following. Replace the email and name with yours:

```sql
insert into public.staff_profiles (user_id, display_name)
select id, 'Your Name' from auth.users where email = 'you@example.com';

insert into public.staff_roles (user_id, role)
select id, 'super_admin' from auth.users where email = 'you@example.com';
```

This is the **only** time you'll need SQL for accounts. From Phase 2 onward, the Super Administrator adds staff from **Admin → User Management**.

**Recommended:** go to **Authentication → Sign In / Providers** and turn **off** "Allow new users to sign up". Only staff you create can then log in.

## Step 4 — Copy your Supabase keys

In Supabase, open **Project Settings → API** (or **API Keys**) and copy these three values:

| Supabase shows | Paste into variable |
|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` / publishable key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` / secret key | `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **keep secret** |

The `service_role` key can bypass all security rules. Never post it in chat or on Facebook, and never put it in a file that gets uploaded to GitHub.

## Step 5 — Put the code on GitHub

Create a new **private** repository on GitHub, then upload this project folder to it. I can do this step for you once you tell me the repository name.

## Step 6 — Deploy on Vercel

1. Go to https://vercel.com/new and **import** the GitHub repository.
2. Before clicking Deploy, open **Environment Variables** and add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` = your Vercel address, for example `https://ohtentic.vercel.app`
3. Click **Deploy**. After about 2 minutes, you'll get a live link.
4. Optional: add your own domain under **Project → Settings → Domains**.

## Step 7 — Fill in the event information

1. Open `https://<your-site>/admin/login` and sign in.
2. Go to **Website Settings** and fill in what has been finalized:
   - **Google Form registration link.** Every "Register Now" button opens it.
   - Fees, gun times and routes for each category.
   - Starting point, destination, assembly time.
   - Registration and payment instructions, inclusions, guidelines, reminders.
   - Facebook Page link.
3. Click **Save**. The public website updates within about one minute.

Leave a field empty and the public site shows **"To be announced"**. Nothing is ever made up.

---

## Running on your own computer (optional, for developers)

```bash
npm install
```

```bash
cp .env.example .env.local
```

Fill in `.env.local`, then:

```bash
npm run dev
```

Open http://localhost:3000.

Quality checks:

```bash
npm run typecheck && npm test && npm run db:check && npm run build
```
