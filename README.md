# Cam & Go Rentals (prototype)

Camera rental management prototype. **Stage 1:** public customer website. **Stage 2A:** project foundations
(shared logic, tests, documentation). The private admin dashboard comes next (Stage 2B). No backend or real data yet.

> Keep this repository **private**. See `docs/SECURITY.md`.

## Run the customer website
Open `index.html` in a browser, or run `python3 -m http.server 8000` here and visit http://localhost:8000.

## Run the tests (Node 20+, nothing to install)
```
node --test
```

## Where things are
- Customer site: `index.html`, `cameras.html`, `availability.html`, `application.html`, `policies.html`, `css/`, `js/`, `assets/`
- `shared/` design tokens and logic (`shared/js` is public-safe; `shared/internal` is never loaded by the site)
- `admin/` future dashboard (placeholder) · `tests/` · `docs/` (start at `docs/README.md`)

## Replace images
Put your files in `assets/images/...` using the names in `assets/ASSETS.md`. Missing images show labeled placeholders.

## Functional vs demo-only
- Functional: navigation, mobile menu, price estimate, calendar selection, form validation.
- Demo-only: availability (fake blocked days: 8th-10th and 20th-22nd monthly) and form submission (nothing is sent or stored; the ID file is never read).
- Rates: ₱350/day for 1-3 days, ₱300/day for 4+ days. Days are counted inclusively (Mon-Wed = 3; same day = 1). Working assumptions pending owner review.
- Frontend validation is a convenience, not security.
