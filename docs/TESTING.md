# Testing Checklist

## Automated (run before every deployment)

- [x] `npm run typecheck`: no type errors
- [x] `npm test`: 14 unit tests (countdown phases incl. Manila timezone, permission matrix, settings validation)
- [x] `npm run db:check`: all migrations + seed apply (seed is idempotent); 19 Row Level Security checks:
  - Public visitors: cannot read participants or private data, cannot write anything, see only published content, never see DRAFT/RESERVED slots
  - Checkpoint personnel: can look up bib + name, cannot see contact/payment data, cannot edit bibs or settings, cannot grant themselves roles
  - Deactivated accounts: lose all access
  - Audit log: cannot be edited or deleted, even by the Super Administrator
- [x] `npm run build`: production build succeeds

## Phase 1 manual checks

- [x] All public pages return 200; unknown pages return a branded 404
- [x] `/admin` and `/admin/settings` redirect signed-out visitors to `/admin/login`
- [x] `/register` redirects to the Google Form when configured, else to `/fun-run#register`
- [x] Desktop (1440px), tablet (1100px) and iPhone 13 layouts: no horizontal scrolling, no console errors
- [x] Countdown verified against server clock in Asia/Manila
- [ ] After Supabase is connected: sign in as Super Admin, edit settings, confirm the public site updates within 60s and an audit entry is written
- [ ] After Supabase is connected: sign in with a checkpoint-only account, confirm Website Settings is not accessible
