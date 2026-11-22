# Business rules

Nothing here is permanent. [PROVISIONAL] items are working assumptions for the owner's review.
"Public?" says whether the customer website shows it.

## Pricing and rental days
| Rule | Value | Status | Public? |
|---|---|---|---|
| Canon SX740, 1-3 days | ₱350 per day | [CONFIRMED] working rate (advertised in Stage 1) | Yes |
| Canon SX740, 4+ days | ₱300 per day (applies to all days) | [CONFIRMED] working rate | Yes |
| Day counting | Inclusive by calendar date; pickup day = Day 1; Mon-Wed = 3 | [PROVISIONAL] | Yes, marked "Pending approval" |
| Same-day pickup and return | Counts as 1 day | [PROVISIONAL] | Yes (same note) |
| Security deposit | None | [PROVISIONAL] | **No** |

Examples: 3 days = ₱1,050. 4 days = ₱1,200 (4 x ₱300). 5 days = ₱1,500.

## Extensions  (all [PROVISIONAL], **not published**)
- Fee: ₱500 per extra day. Maximum 2 extension days in the normal process.
- The customer requests the extension through the admin; the admin checks availability before approving.
- An approved extension stays part of the original rental transaction.
- Beyond 2 days the system does not approve automatically; the admin reviews the situation.

## Overdue  (all [PROVISIONAL], **not published**)
- Fee: ₱1,000 per overdue day.
- Tracking starts after the *approved return deadline* (original return date + approved extension days).
- If the maximum extension is reached, the admin reviews. The system keeps tracking and notifying the admin.
- Working definition in code: overdue days = calendar days after the deadline day. Returning on the deadline day = 0.
- [DECISION NEEDED] time-of-day deadlines, partial days, grace period.

## Payments  (structural rules [CONFIRMED])
- Cash only. An administrator manually confirms payment.
- A rental becomes **active only after** payment is confirmed **and** the camera is physically handed over.
- Money **owed** is tracked separately from money **received**.
- No real payment processing is built.

## Inventory and returns  [CONFIRMED] (status *names* are [PROVISIONAL])
- Each physical camera is tracked separately with a unit ID (e.g. CAM-001).
- Unit statuses: Available, Reserved, Rented, Returned - Inspection Pending, Under Maintenance, Damaged, Retired.
- On return the admin records actual return date/time, condition, missing accessories, and return photos.
- A returned camera never becomes Available automatically; inspection must be completed first.

## Applications and ID  [CONFIRMED]
- Customers submit an application and government ID. An administrator manually reviews and verifies it.
- OCR (if ever used) only assists; it is never proof of authenticity.
- Real ID files will live only in private storage, never in a public folder or this repository.

## Administration  [CONFIRMED plan]
- Exactly two administrator accounts, each separate. Two-factor authentication planned for both.
- Important admin actions are recorded in an audit log.

## Records and retention
- [CONFIRMED] Never auto-delete unfinished, pending, active, overdue, disputed, or unsettled records.
- [CONFIRMED] Completed transactions may be archived. Monthly cleanup only *lists* eligible records for an admin; it never deletes indiscriminately.
- [DECISION NEEDED] How long records and ID images are kept. Seek professional advice on the Philippine Data Privacy Act (RA 10173).

## Where each rule lives in code
Public rates and day counting: `shared/js/`. Extension/overdue/deposit values: `shared/internal/rules.js` (one place to edit).
