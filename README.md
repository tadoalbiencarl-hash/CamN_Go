# Cam & Go Rentals - Stage 1 (public prototype)
Static site: HTML5, CSS3, vanilla JS. No build step, no dependencies, no network calls. Bootstrap was intentionally not used.

## Run
Open `index.html` in a browser, or run `python3 -m http.server 8000` in this folder and visit http://localhost:8000.

## Structure
- `index.html, cameras.html, availability.html, application.html, policies.html`
- `css/styles.css` shared styles; `js/main.js` shared header/footer, camera data, calendar, form logic
- `assets/images/{logo,cameras,banners,icons}` your photos (see `assets/ASSETS.md`)

## Replace images
Drop files into `assets/images/...` using the exact names in `assets/ASSETS.md`.

## Functional vs demo-only
- Functional: navigation, mobile menu, price estimate (₱350/day for 1-3 days, ₱300/day for 4+; days = return minus pickup), calendar selection, form validation.
- Demo-only: availability (fake blocked days: 8th-10th and 20th-22nd monthly) and form submission (nothing sent; the ID file is never read or stored).
- Frontend validation is a convenience, not security. Real checks must happen server-side later.

## Still undecided (marked "Pending approval" on the policies page)
Extension fee, overdue fee, deposit, cancellation terms, pickup location/hours. Contact details and social links in the footer are placeholders.
