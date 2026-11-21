# Security requirements

The prototype handles **no real customer data** and has **no login**. Treat every item below as a requirement for Stage 3.

## Principles
1. **Frontend code is never security.** Anyone can read or change JavaScript in their browser. Only server-side checks count. [CONFIRMED]
2. **No fake security.** No pretend login, no hidden admin URLs, no passwords or keys in files. [CONFIRMED]
3. **The prototype admin must not be hosted publicly with real data.** Show it to the owner locally or privately.

## Repository
- Keep the repository **private** (it was public when Stage 2A began; making it private is the first protection).
- Never commit: real customer data, ID photos, `.env` files, API keys, database dumps. `.gitignore` covers common names but is not a guarantee. Review every commit.
- Docs list provisional internal fees; a public repo would reveal them.
- Hosting the repo root publicly would also publish `admin/`, `docs/` and `tests/`; deploy only customer files (see FOLDER-STRUCTURE.md).

## Admin access (Stage 3)
- Exactly two administrator accounts, each with its own login. [CONFIRMED plan]
- Two-factor authentication on both. Public sign-up disabled. [CONFIRMED plan]
- Authorization enforced by the database (Row Level Security), not by hiding screens.
- Session timeout, login rate limiting, and a way to revoke a lost device or account.

## Customer IDs and personal data
- ID images go only to **private** storage; never a public folder or this repo. Admins open them through short-lived, access-controlled links. [CONFIRMED]
- Accept only expected file types and sizes; verify on the server, not just in the browser.
- Collect only what is needed; define a retention period (DECISION NEEDED); get advice on RA 10173 (Philippine Data Privacy Act).
- OCR, if used, only suggests values. A human verifies authenticity. [CONFIRMED]
- Do not put personal data in URLs, logs, browser storage, or error messages.

## Payments
- Cash only, recorded by an admin. No card data is ever handled. Entries are voided, never deleted.

## Audit log
Record who did what and when for: logins, application decisions, ID verification and access, reservation/rental changes,
payment entries and voids, extensions, setting changes, exports. The log must be append-only for admins.

## Application intake (customer -> system)
The public form will submit to a server endpoint that validates every field, limits file type and size, rate-limits
requests, and stores data where the public cannot read it. Anonymous visitors can *create* an application but never read one.

## Before any real customer uses the system
- [ ] Repo private; no secrets in history
- [ ] Server-side auth + 2FA working for both admins
- [ ] Row Level Security tested with a non-admin account
- [ ] Private ID storage tested (direct URL does not work)
- [ ] Backups and a restore test
- [ ] Privacy notice and retention period agreed
- [ ] Audit log verified
