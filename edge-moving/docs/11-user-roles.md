# 11 — User Roles

The system has three roles stored in `User.role`:

---

## customer (default)

### Who They Are
Regular customers booking moving services.

### How They're Created
- Self-register at `/register`
- Or seeded via `npm run seed` (customer1–5@edge.local)

### What They Can Do

| Action | Endpoint |
|--------|----------|
| Register / Login / Logout | `/auth/*` |
| View their own profile | `GET /users/profile` |
| Update profile | `PATCH /users/profile` |
| Change password | `PATCH /users/change-password` |
| Save/delete addresses | `POST|DELETE /users/saved-addresses` |
| Create a booking (quote) | `POST /bookings` |
| List their bookings | `GET /bookings` |
| View one booking | `GET /bookings/:id` |
| Confirm a booking | `PATCH /bookings/:id/confirm` |
| Cancel a booking | `PATCH /bookings/:id/cancel` |
| Upload item photos | `POST /bookings/:id/photos` |
| Submit payment receipt | `POST /transfers` |
| View their transfers | `GET /transfers/my` |
| Resubmit rejected transfer | `PATCH /transfers/:id/resubmit` |
| Leave a review (after completion) | `POST /reviews/:bookingId` |

### What They Cannot Do
- Access any `/api/admin/*` endpoint (403)
- View other customers' bookings or transfers (403)
- Reveal encrypted government IDs

---

## admin

### Who They Are
Staff at Edge Moving Solution Ltd. who manage the business.

### How They're Created
- Manually (must set `role: "admin"` in DB or seed)
- Seed creates: `edgemovingsolutions@gmail.com` / `Admin123!`

### What They Can Do

Everything customers can do, plus:

| Action | Endpoint |
|--------|----------|
| List all bookings (with filters) | `GET /admin/bookings` |
| Update any booking status / notes / price | `PATCH /admin/bookings/:id` |
| Assign movers to a booking | `POST /admin/bookings/:id/assign` |
| List all transfers | `GET /admin/transfers` |
| Approve a transfer | `PATCH /admin/transfers/:id/approve` |
| Reject a transfer | `PATCH /admin/transfers/:id/reject` |
| List all customers | `GET /admin/customers` |
| View any customer's full profile + history | `GET /admin/customers/:id` |
| Reveal encrypted government ID | `GET /admin/customers/:id/reveal-id` |
| List all movers | `GET /admin/movers` |
| Create a mover | `POST /admin/movers` |
| Update a mover | `PATCH /admin/movers/:id` |
| View / update pricing config | `GET|PATCH /admin/pricing` |
| View / update bank details | `GET|PATCH /admin/bank-details` |
| View system stats | `GET /admin/stats` |

---

## mover

### Who They Are
Moving crew members employed by Edge Moving.

### How They're Created
- Admin creates a `User` with `role: "mover"` + a linked `Mover` document
- Or seeded: mover1–3@edge.local / `Mover123!`

### Current Permissions
Movers use the same auth system as customers. They currently have no special mover-only API routes or UI pages.

**What they can access:**
- Standard auth endpoints
- Their own user profile

**What they can't do:**
- Access admin endpoints
- See other customers' data

### Mover Profile (`Mover` collection)
Each mover has a separate `Mover` document linked to their `User`:
- `vehicleType`: van | medium | large
- `isAvailable`: toggled by admin
- `skills`: array of skill strings
- `assignedBookings`: array of booking IDs
- `rating`: average rating
- `completedJobs`: counter

Movers are assigned to bookings by admins via the assign endpoint.

---

## Role Enforcement

**Server-side (enforced on every request):**
- `protect` middleware — verifies JWT, loads user from DB
- `adminOnly` middleware — checks `role === "admin"`, applied to all `/api/admin/*` routes

**Client-side (UI only, not security):**
- Navbar shows "Admin" link only if `user.role === "admin"`
- No frontend redirect guards on admin pages (relies on server-side 403s)
