# 03 — API Reference

Base URL: `http://localhost:5000/api`  
All responses follow `{ success, data, message }`.  
Auth is via **httpOnly cookie** named `token` (set automatically on login/register).

Legend:  
🔓 Public  🔐 Authenticated (any role)  👑 Admin only

---

## Authentication — `/api/auth`

### POST `/auth/register` 🔓
Rate limited: 5 requests per 15 minutes.

**Request body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "+1 506-555-1234",
  "password": "Secret123!",
  "dateOfBirth": "1990-05-15",
  "governmentIdType": "drivers_license",
  "governmentIdNumber": "DL-123456",
  "address": {
    "street": "123 Main St",
    "city": "Moncton",
    "province": "NB",
    "postalCode": "E1A 1A1",
    "country": "Canada"
  },
  "emergencyContact": {
    "name": "John Doe",
    "phone": "+1 506-555-9999",
    "relationship": "Spouse"
  }
}
```
**Response 201:** User object (no passwordHash). Sets `token` cookie.  
**Side effect:** Sends welcome/verification email.

---

### POST `/auth/login` 🔓
Rate limited.

**Request body:**
```json
{ "email": "jane@example.com", "password": "Secret123!" }
```
**Response 200:** User object. Sets `token` cookie.

---

### POST `/auth/logout` 🔓
Clears the `token` cookie.  
**Response 200.**

---

### GET `/auth/verify-email/:token` 🔓
Verifies the user's email address using the token from the welcome email.  
**Response 200** on success, **400** if token invalid.

---

### POST `/auth/forgot-password` 🔓
Rate limited.

**Request body:** `{ "email": "jane@example.com" }`  
Always returns 200 (prevents user enumeration).  
Sends reset link valid for **30 minutes**.

---

### POST `/auth/reset-password/:token` 🔓
Rate limited.

**Request body:** `{ "password": "NewPass456!" }`  
**Response 200** on success, **400** if token expired/invalid.

---

### GET `/auth/me` 🔐
Returns the currently authenticated user.  
**Response 200:** User object (no passwordHash).

---

## Bookings — `/api/bookings`

### POST `/bookings` 🔐
Creates a new booking (initially status `"quote"`).

**Request body** (key fields):
```json
{
  "serviceType": "residential",
  "pickup": { "address": "123 Main St, Moncton", "floor": 2, "hasElevator": false },
  "dropoff": { "address": "456 Oak Ave, Fredericton", "floor": 1, "hasElevator": true },
  "distanceKm": 180,
  "truckType": "van",
  "workersCount": 2,
  "urgency": "standard",
  "moveDate": "2026-06-01",
  "preferredTime": "Morning",
  "hasFragileItems": false,
  "customerSnapshot": {
    "firstName": "Jane",
    "lastName": "Doe",
    "phone": "+1 506-555-1234",
    "governmentIdType": "drivers_license",
    "governmentIdNumber": "DL-123456",
    "address": { "street": "...", "city": "...", "province": "NB", "postalCode": "E1A 1A1" },
    "emergencyContact": { "name": "...", "phone": "...", "relationship": "..." }
  }
}
```
**Response 201:** Full booking document. Quote valid for 48 hours.

---

### GET `/bookings` 🔐
Returns all bookings for the authenticated customer, sorted newest first.

---

### GET `/bookings/:id` 🔐
Returns a single booking (customer must own it, or be admin).  
Populates: `transfer`, `review`, `assignedMovers`.

---

### PATCH `/bookings/:id/confirm` 🔐
Customer confirms their quote, moving it to `status: "confirmed"`.

---

### PATCH `/bookings/:id/cancel` 🔐
Customer cancels booking. If move date is within 48 hours, a 25% cancellation charge applies.

**Request body:** `{ "reason": "Plans changed" }`  
**Response:** `{ booking, policyChargePercent: 0 | 25 }`

---

### POST `/bookings/:id/photos` 🔐
Upload up to 10 item photos for the booking. `multipart/form-data` with field `images`.

---

## Transfers — `/api/transfers`

### POST `/transfers` 🔐
Submit a payment receipt. `multipart/form-data`.

**Form fields:**
| Field | Type | Notes |
|-------|------|-------|
| bookingId | String | ID of the booking being paid |
| amount | Number | In cents |
| transferReference | String | Customer's bank reference code |
| transferDate | Date | ISO date |
| transferMethod | String | `interac_etransfer` \| `bank_transfer` \| `cash_deposit` |
| senderName | String | Name on the bank account |
| receiptImage | File | Image file, max 5MB |

Sets booking `paymentStatus` to `"receipt_submitted"`.

---

### GET `/transfers/my` 🔐
Lists all transfers for the authenticated user.  
Populates booking ref, pricing, paymentStatus.

---

### GET `/transfers/:id` 🔐
Single transfer. Customer can only see their own; admins see all.

---

### PATCH `/transfers/:id/resubmit` 🔐
Resubmit a rejected transfer. Only works if `status === "rejected"`.  
Accepts same fields as POST + optional new receipt image.  
Resets transfer to `"pending"`, booking to `"receipt_submitted"`.

---

## Admin — `/api/admin` 👑

All admin routes require: authenticated + `role === "admin"`.

### Bookings
| Method | Path | Action |
|--------|------|--------|
| GET | `/admin/bookings` | List all bookings. Query: `?status=`, `?serviceType=`, `?q=` (search ref/name) |
| PATCH | `/admin/bookings/:id` | Update `status`, `adminNotes`, `pricing`. Body can include `note` for status history and `overrideReason` for price changes |
| POST | `/admin/bookings/:id/assign` | Assign movers. Body: `{ "moverIds": ["id1","id2"] }`. Checks for schedule conflicts. Sets status to `"assigned"` |

### Transfers
| Method | Path | Action |
|--------|------|--------|
| GET | `/admin/transfers` | List all transfers. Query `?status=pending\|approved\|rejected`. Adds `mismatchAlert: true` if transfer amount differs from booking total by >$5 |
| GET | `/admin/transfers/:id` | Single transfer detail |
| PATCH | `/admin/transfers/:id/approve` | Approve receipt. Body: `{ "note": "..." }`. Sets booking paymentStatus to `"verified"` |
| PATCH | `/admin/transfers/:id/reject` | Reject receipt. Body: `{ "reason": "..." }`. Sets booking paymentStatus to `"rejected"` |

### Customers
| Method | Path | Action |
|--------|------|--------|
| GET | `/admin/customers` | List all customers |
| GET | `/admin/customers/:id` | Customer profile + all their bookings + all their transfers |
| GET | `/admin/customers/:id/reveal-id` | Decrypt and return government ID. Logs to AuditLog |

### Movers
| Method | Path | Action |
|--------|------|--------|
| GET | `/admin/movers` | List all movers (populated with user + assignedBookings) |
| POST | `/admin/movers` | Create mover record |
| PATCH | `/admin/movers/:id` | Update mover (availability, skills, vehicleType, etc.) |

### Pricing
| Method | Path | Action |
|--------|------|--------|
| GET | `/admin/pricing` | Get current pricing config (creates default if none) |
| PATCH | `/admin/pricing` | Update any pricing field |

### Bank Details
| Method | Path | Action |
|--------|------|--------|
| GET | `/admin/bank-details` | Get payment info shown to customers |
| PATCH | `/admin/bank-details` | Update bank/e-Transfer details |

### Stats
| Method | Path | Action |
|--------|------|--------|
| GET | `/admin/stats` | Returns: `todayBookings`, `pendingReceipts`, `verifiedPayments`, `activeMoves` |

---

## Users — `/api/users`

### GET `/users/profile` 🔐
Full user object (no passwordHash).

### PATCH `/users/profile` 🔐
Update any profile field. governmentIdNumber is re-encrypted automatically.

### PATCH `/users/change-password` 🔐
Body: `{ "currentPassword": "...", "newPassword": "..." }`  
Verifies current password before updating.

### POST `/users/saved-addresses` 🔐
Body: `{ "label": "Home", "address": "123 Main St", "coordinates": { "lat": 46.09, "lng": -64.77 } }`

### DELETE `/users/saved-addresses/:id` 🔐
Removes a saved address by its sub-document ID.

---

## Reviews — `/api/reviews`

### POST `/reviews/:bookingId` 🔐
Create a review for a completed booking.  
Body: `{ "rating": 5, "comment": "Excellent service!" }`  
Returns 400 if booking is not completed. Returns 403 if not the booking owner.

### GET `/reviews` 🔓
Public list of all reviews. Populates customer first/last name.

---

## Maps — `/api/maps`

### POST `/maps/distance` 🔓
Proxies Google Maps Distance Matrix API.  
Body: `{ "origin": "Moncton, NB", "destination": "Fredericton, NB" }`  
Returns raw Distance Matrix response.

### POST `/maps/autocomplete` 🔓
Proxies Google Places Autocomplete API.  
Body: `{ "input": "123 Main" }`  
Restricted to Canada (`components: country:ca`).

---

## Health Check

### GET `/api/health` 🔓
Returns `{ success: true, message: "OK", data: null }`.  
Use to verify server is running.
