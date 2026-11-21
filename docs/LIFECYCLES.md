# Lifecycles

Mirrored in code by `shared/internal/lifecycles.js` and verified by `tests/lifecycles.test.js`.
Status *names* are [PROVISIONAL]. The guard conditions marked [CONFIRMED] come from your stated rules.

## Application
`submitted -> under_review -> approved | rejected | needs_info`; `needs_info -> under_review | rejected`.
Approval requires an administrator to manually verify the ID. Submitting never approves or reserves anything.

## Reservation
`pending -> confirmed | cancelled`; `confirmed -> converted_to_rental | cancelled | no_show`.
Admin checks availability against units before confirming.

## Rental
```
(reservation confirmed)
   + payment confirmed by an admin  [CONFIRMED]
   + camera physically handed over   [CONFIRMED]
        -> active -> returned -> closed
                \-> disputed (from active or returned) -> closed
```
- `active` can only start when **both** conditions are true.
- `returned -> closed` requires: inspection complete **and** balance settled.
- `disputed -> closed` requires a noted resolution.
- **Overdue is not a stored status.** It is calculated: today (or the return date) is after the approved return deadline.

## Extension
Customer asks via admin -> admin checks availability -> approves 1-2 days [PROVISIONAL limit] -> new approved deadline.
It stays part of the original rental. More than 2 days: not approved automatically; admin reviews.

## Overdue [PROVISIONAL]
Starts after the approved return deadline. Each overdue day adds a charge. The admin is notified and the system keeps
tracking until the camera is returned and the balance is settled.

## Return
Admin records actual return date/time, condition, missing accessories, return photos ->
unit becomes `returned_inspection_pending` -> inspection completed -> unit becomes `available`,
`under_maintenance`, or `damaged`. **Never automatically Available.**

## Camera unit
```
available -> reserved -> rented -> returned_inspection_pending -> available
     |           \                         |-> under_maintenance -> available | damaged | retired
     |            \-> available (cancelled)\-> damaged -> under_maintenance | retired
     \-> under_maintenance | damaged | retired       retired = final
```
Guards: `reserved -> rented` needs payment + handover. `returned_inspection_pending -> available` needs inspection complete.

## Payment (cash)
Owed and received are separate numbers. Status shown to admins: `unpaid`, `partially_paid`, `paid`, `overpaid`.
A recorded payment is never edited or deleted; a mistake is corrected by a **voided** entry plus a new one.
No real payment processing is built.
