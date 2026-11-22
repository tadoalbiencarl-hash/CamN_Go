# Database plan (design only; nothing is built)  [RECOMMENDED]

Target: Supabase's PostgreSQL in Stage 3. Entity and field names are provisional.

## Conventions
- **Money:** integer centavos (₱350.00 = 35000). Never floating-point.
- **Time:** store UTC timestamps; display in Asia/Manila. Rental *dates* are plain `date` values.
- **Never hard-delete** business records. Use status/`archived_at`; payments are voided, not deleted.
- Every table has `id`, `created_at`, `updated_at`. Changes by admins are written to `audit_log`.
- Personal data and ID files are the most sensitive part (see SECURITY.md).

## Entities
| Entity | Purpose | Key fields |
|---|---|---|
| admins | The two administrators (linked to the auth user) | auth_user_id, display_name, role |
| customers | A renter | full_name, phone, email, address, flagged, notes |
| applications | One rental application | customer_id, camera_model_id, pickup_date, return_date, id_type, status, reviewed_by, reviewed_at |
| id_documents | Reference to a private ID file (**never the file itself**) | application_id, storage_path, verified_by, verified_at, verification_notes |
| camera_models | A model sold to customers | name, description, short_rate, long_rate, long_from_days |
| camera_units | One physical camera | unit_code (CAM-001), camera_model_id, serial_number, status, condition_notes |
| reservations | Dates held for a unit | application_id, unit_id, start_date, end_date, status |
| rentals | A camera actually out | reservation_id, unit_id, handed_over_at, payment_confirmed_by, approved_return_date, actual_returned_at, status |
| extensions | Approved extra days (part of the rental) | rental_id, days, fee_centavos, approved_by |
| return_inspections | Condition check at return | rental_id, condition, missing_accessories, notes, completed_by, completed_at |
| return_photos | References to private photo files | inspection_id, storage_path |
| payments | Cash ledger entries (money **received**) | rental_id, kind (rental/extension/overdue/refund), amount_centavos, receipt_no, received_by, received_at, voided_at, void_reason |
| charges | Amounts **owed** (kept separate from payments) | rental_id, kind, amount_centavos, description |
| overdue_events | Overdue tracking and admin notifications | rental_id, deadline_date, days_overdue, notified_at, resolved_at |
| notifications | In-app admin alerts | admin_id, kind, rental_id, read_at |
| settings | Policy values (fees, limits) editable by admins | key, value, changed_by |
| audit_log | Who did what, when | admin_id, action, table, record_id, before, after, at |
| retention_flags | Records held back from cleanup | record_ref, reason, set_by |

## Relationships
```
customers 1-n applications 1-n id_documents
camera_models 1-n camera_units
applications 1-1 reservations n-1 camera_units
reservations 1-1 rentals 1-n extensions
rentals 1-n charges, 1-n payments, 1-n overdue_events, 1-1 return_inspections 1-n return_photos
admins 1-n audit_log
```

## Rules the database itself must enforce  (server is the final authority)
1. **No double booking:** two active reservations/rentals for the same unit may not have overlapping dates (a database exclusion constraint).
2. A unit can be rented only when payment is confirmed and handover recorded; a returned unit stays "inspection pending" until an inspection row is complete.
3. Status changes follow the allowed transitions in LIFECYCLES.md.
4. Payments cannot be edited or deleted; corrections are new, voided entries.
5. Row Level Security: customers/anonymous visitors cannot read any of these tables; only the two admins can.
6. `settings` holds fee values; the shared logic in this repo mirrors them in the prototype only.

## Archive and cleanup  [CONFIRMED rules, DECISION NEEDED periods]
A monthly job produces a *list* of archive candidates: rentals that are closed, fully settled, and not disputed. An admin
reviews the list. Pending, active, overdue, disputed, or unsettled records are never candidates.
