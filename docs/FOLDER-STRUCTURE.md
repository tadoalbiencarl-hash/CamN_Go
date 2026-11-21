# Folder structure

```
CamN_Go/
  index.html, cameras.html, availability.html,
  application.html, policies.html     Customer website pages (unchanged paths)
  css/styles.css                      Customer-site components
  js/main.js                          Customer-site interface code
  assets/                             Owner's photos/logo (+ ASSETS.md guide)
  shared/
    css/tokens.css                    Design tokens (beige/brown palette). Used by site AND admin.
    js/dates.js, pricing.js           PUBLIC-SAFE logic
    internal/rules.js, fees.js,       INTERNAL logic. Never loaded by the customer site.
             lifecycles.js
  admin/                              Future private dashboard (placeholder README only)
  tests/                              node --test (no installs)
  docs/                               This documentation
  package.json, .gitignore, README.md
```

## Rules between folders
1. Customer pages may load `shared/css/tokens.css` and `shared/js/dates.js` / `pricing.js` only.
2. Customer pages must never load `shared/internal/`, `admin/`, or `docs/` (enforced by a test).
3. `admin/` may use everything in `shared/`.
4. Nothing in this repo may contain real customer data, ID images, passwords, or keys (`.gitignore` blocks common names).
5. `shared/` has no knowledge of any database. Supabase code will live in the admin's `dataService` layer, not in `shared/`.

## Deployment note  [RECOMMENDED, for Stage 3]
Because the website sits at the repo root, publishing the *whole* repo to a public host would also publish `admin/`,
`docs/` and `tests/`. Stage 3 must publish only the customer files (a deploy folder or build step), and the admin must be
a separate deployment behind real authentication. Keep the repo private regardless.
