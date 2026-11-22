# Supabase plan (design only; **nothing is created or integrated in Stage 2A**)

Everything here is [RECOMMENDED] for Stage 3. Check Supabase's current documentation at that time; features and names change.

## Why Supabase
One managed service gives a PostgreSQL database, login (with two-factor), file storage with private buckets, scheduled jobs,
and server functions, which suits a two-admin business without running our own server.

## Planned use
| Need | Supabase feature |
|---|---|
| Two admin logins + 2FA | Auth (email/password + TOTP); self-sign-up turned **off**; two accounts created manually |
| Data | Postgres tables from DATABASE-PLAN.md, created through versioned migration files kept in a future `supabase/` folder |
| Who may read/write | Row Level Security: only the two admin users; anonymous users get no read access |
| ID and return photos | Storage with **private** buckets; opened via short-lived signed links |
| Public application form | A server function validates input, limits file size/type, rate-limits, then writes with elevated rights *on the server only* |
| Overdue tracking, monthly cleanup *list* | Scheduled database job creating `overdue_events` / archive-candidate lists (no deletion) |
| Audit log | Database triggers writing to `audit_log` |
| No double booking | Database exclusion constraint on unit + date range |

## What changes in our code
- Add a Supabase version of `dataService` in the admin. Screens, `shared/` logic and tests stay as they are.
- The customer site's availability and form call the server function instead of sample data.
- `shared/internal/rules.js` values move into the `settings` table (admins edit them; server reads them).

## Hard rules
1. The "anon/public" key may appear in frontend code. The **service-role key must never** appear in any frontend file or in this repo.
2. No keys in Git. Use the host's secret settings.
3. Do not rely on the frontend to enforce anything the database must enforce.
4. Test Row Level Security with a non-admin account before storing anything real.

## Stage 3 outline (for later approval)
1. Create the project (private repo first). 2. Migrations for tables + RLS. 3. Two admin accounts with 2FA.
4. Private storage + signed links. 5. Application intake function. 6. Swap `dataService`. 7. Audit triggers, jobs, backups.
8. Security checklist in SECURITY.md.
