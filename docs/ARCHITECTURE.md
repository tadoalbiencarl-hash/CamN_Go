# Architecture

## Two separate interfaces
| | Customer website | Admin dashboard |
|---|---|---|
| Where | Repo root (`index.html` ...) | `admin/` (Stage 2B onward) |
| Who | Anyone | Exactly two administrators |
| Status | Stage 1 prototype, working | Not built yet |
| Data | Sample camera + fake availability | Clearly fake sample data in the prototype |
| Security | Public by design. Holds no secrets. | **Must** use server-side login (Stage 3) |

They share *only* the `shared/` folder. Nothing in the customer site may load admin code or internal rules.

## Layers (each only talks to the one below)
```
Pages (HTML)  ->  Interface code (js/main.js, admin/...)  ->  dataService  ->  data source
                                    |                                          (sample data now,
                                    +--> shared logic (dates, pricing, rules)    Supabase in Stage 3)
```

## Shared logic: two kinds  [RECOMMENDED]
- **Public-safe** (`shared/js/`): date helpers and the *advertised* rental rates. Loaded by the customer site.
- **Internal** (`shared/internal/`): extension and overdue fees, rule values, lifecycle transitions. Used by the admin and tests only.
  `tests/site-integrity.test.js` fails if the customer site ever references it or publishes an internal fee.

Why the split: anything a browser loads can be read by any visitor ("View source"). Unapproved fees must not be in files the public site loads.

## Plain scripts, not ES modules  [RECOMMENDED]
Browsers refuse ES-module imports when you double-click an HTML file (`file://`). The shared files are ordinary
`<script>` files that attach to one object (`window.CamNGo`) and also work as Node modules for testing. This keeps the
"open `index.html` and it works" workflow.

## The dataService idea (Stage 2B+)  [RECOMMENDED]
Admin screens will never read sample data directly. They call a small interface such as
`dataService.listApplications()`. In the prototype it returns fake data; in Stage 3 only that one layer is replaced with
Supabase calls. Screens and shared logic stay the same.

## Business logic lives in one place
Prices, day counting, fee math, and allowed status changes are in `shared/`. The interface asks; it does not decide.
When the owner changes a rule, you edit one file and re-run the tests.

## Server is the final authority (Stage 3)  [CONFIRMED]
Frontend checks are for convenience only. The database and server must re-check every rule (availability conflicts,
status changes, payments) and enforce who may do what. Hiding admin pages with JavaScript is not security.

## Local development
Open `index.html`, or run `python3 -m http.server 8000`. Run tests with `node --test` (Node 20+, no installs).
