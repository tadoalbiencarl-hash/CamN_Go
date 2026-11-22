# Admin dashboard (placeholder, Stage 2B onward)

Nothing is built here yet. Stage 2A only prepared the foundations.

When built, this folder will hold the **private** dashboard (Overview, Applications, Customers, Inventory, Reservations,
Rentals, Extensions & overdue, Payments, Reports, Settings, Audit log), using:
- `shared/css/tokens.css` for the same beige/brown look,
- `shared/js/` and `shared/internal/` for rules and calculations,
- a `dataService` layer returning **clearly fake sample data** in the prototype.

Until real server-side login exists (Stage 3) this folder must **never** be hosted publicly or given real customer data.
