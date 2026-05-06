# 08 — Admin Panel

## Access

- URL: `/admin`
- Requirement: `role === "admin"` on the JWT user record
- Server enforces this via `protect` + `adminOnly` middleware on all `/api/admin/*` routes
- No frontend route guard (pages load but API calls will 403 for non-admins)

---

## Admin Dashboard (`/admin`)

Landing page with links to all admin sections. Shows no data itself.

---

## Bookings (`/admin/bookings`)

### Data Fetched
`GET /admin/bookings` — full list with optional query params:
- `?status=confirmed` — filter by booking status
- `?serviceType=residential` — filter by service type
- `?q=EDGE-2026` — search by booking ref or customer name

### What Admin Can Do (via API)

**Update booking status:**
```json
PATCH /admin/bookings/:id
{
  "status": "in_progress",
  "note": "Movers dispatched"
}
```
Valid statuses: `quote → confirmed → assigned → in_progress → completed | cancelled`

**Override price:**
```json
PATCH /admin/bookings/:id
{
  "pricing": { "finalPrice": 80000 },
  "overrideReason": "Military discount"
}
```

**Add admin notes:**
```json
PATCH /admin/bookings/:id
{
  "adminNotes": "Customer has large piano. Send experienced team."
}
```

**Assign movers:**
```json
POST /admin/bookings/:id/assign
{
  "moverIds": ["moverObjectId1", "moverObjectId2"]
}
```
- Checks for scheduling conflicts (same moveDate + preferredTime + overlapping status)
- Reports conflicting mover IDs in response but still saves the assignment
- Sets booking status to `"assigned"`
- Updates each Mover's `assignedBookings` array

---

## Transfers (`/admin/transfers`)

**Most interactive admin page.**

### What's Shown Per Transfer
- Booking reference
- Customer full name
- Amount claimed vs booking total
- `mismatchAlert: true` badge if difference > $5.00
- Sender name and transfer reference
- Transfer status

### Actions

**Approve:**
- PATCH `/admin/transfers/:id/approve` with optional `note`
- Sets transfer `status → "approved"`
- Sets booking `paymentStatus → "verified"`

**Reject:**
- PATCH `/admin/transfers/:id/reject` with `reason`
- Sets transfer `status → "rejected"`
- Sets booking `paymentStatus → "rejected"`
- Customer is then able to resubmit

### Filtering
`GET /admin/transfers?status=pending` to see only pending receipts.

---

## Customers (`/admin/customers`)

### List All Customers
`GET /admin/customers` — all users with `role === "customer"`, sorted newest first.

### Customer Profile
`GET /admin/customers/:id` — returns:
- Full user object
- All bookings for that customer
- All transfers for that customer

### Reveal Government ID
`GET /admin/customers/:id/reveal-id` — decrypts the AES-256 encrypted ID.
- Returns: `{ type: "drivers_license", masked: "****3456", value: "DL-123456" }`
- Writes an `AuditLog` entry with `action: "REVEAL_GOV_ID"`
- Intended for identity verification disputes or fraud investigation

---

## Movers (`/admin/movers`)

### View All Movers
`GET /admin/movers` — populated with user account details and assigned booking IDs.

### Create Mover
`POST /admin/movers`
```json
{
  "user": "userId",
  "phone": "+1 506-000-0001",
  "vehicleType": "van",
  "skills": ["heavy_lifting"]
}
```

### Update Mover
`PATCH /admin/movers/:id`
```json
{
  "isAvailable": false,
  "vehicleType": "large"
}
```

---

## Pricing (`/admin/pricing`)

### View Config
`GET /admin/pricing` — returns current `PricingConfig` document.

### Update Any Rate
`PATCH /admin/pricing`
```json
{
  "basePrice": 20000,
  "distanceRatePerKm": 300,
  "truckRates": { "van": 8000, "medium": 14000, "large": 22000 },
  "urgencyRates": { "same_day": 15000, "express": 25000 },
  "fragileSurcharge": 10000
}
```
Only send fields you want to update. Others are unchanged.

---

## Bank Details (`/admin/bank-details`)

### View
`GET /admin/bank-details` — returns the `BankSettings` document.

### Update
`PATCH /admin/bank-details`
```json
{
  "accountName": "Edge Moving Solution Ltd.",
  "bankName": "TD Bank",
  "etransferEmail": "edgemovingsolutions@gmail.com",
  "accountNumber": "1234567890"
}
```
These are shown to customers on the Payment Instructions page.

---

## Reports (`/admin/stats`)

`GET /admin/stats` returns:

| Stat | Description |
|------|-------------|
| `todayBookings` | Bookings created since midnight today |
| `pendingReceipts` | Transfers with `status === "pending"` |
| `verifiedPayments` | Bookings with `paymentStatus === "verified"` |
| `activeMoves` | Bookings with status in `["confirmed", "assigned", "in_progress"]` |

---

## Audit Trail

Every admin action that reveals sensitive data is logged:

| Action | Trigger |
|--------|---------|
| `REVEAL_GOV_ID` | Admin calls GET `/admin/customers/:id/reveal-id` |

**AuditLog fields:** admin ID, customer ID, action, timestamp.

Booking status changes are tracked in the booking's own `statusHistory` array (not AuditLog):
```json
{
  "status": "in_progress",
  "timestamp": "2026-05-02T10:00:00Z",
  "note": "Movers dispatched",
  "updatedBy": "adminUserId"
}
```
