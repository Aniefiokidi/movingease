# 02 — Database Models

All models live in `server/models/`. MongoDB is accessed via Mongoose 8.

---

## User

**File:** `models/User.js`  
**Collection:** `users`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| firstName | String | ✅ | Trimmed |
| lastName | String | ✅ | Trimmed |
| email | String | ✅ | Unique, lowercase |
| phone | String | ✅ | Canadian format e.g. +1 506-471-9393 |
| passwordHash | String | ✅ | bcrypt, cost 12 |
| role | String | ✅ | `"customer"` \| `"admin"` \| `"mover"` (default: customer) |
| dateOfBirth | Date | ✅ | |
| governmentIdType | String | ✅ | `"drivers_license"` \| `"passport"` \| `"provincial_id"` \| `"health_card"` |
| governmentIdNumber | String | ✅ | AES-256-CBC encrypted at rest |
| governmentIdPhoto | String | ❌ | URL to uploaded photo |
| address.street | String | ✅ | |
| address.city | String | ✅ | |
| address.province | String | ✅ | |
| address.postalCode | String | ✅ | |
| address.country | String | ❌ | Default "Canada" |
| emergencyContact.name | String | ✅ | |
| emergencyContact.phone | String | ✅ | |
| emergencyContact.relationship | String | ✅ | |
| savedAddresses | Array | ❌ | Sub-docs: `{label, address, coordinates{lat,lng}}` |
| isVerified | Boolean | ❌ | Default false; set true on email verify |
| verificationToken | String | ❌ | Random 20-byte hex, cleared after use |
| resetPasswordToken | String | ❌ | Random 20-byte hex |
| resetPasswordExpires | Date | ❌ | 30 minutes from issue |
| lastLogin | Date | ❌ | Set on each login |
| createdAt / updatedAt | Date | — | Auto timestamps |

---

## Booking

**File:** `models/Booking.js`  
**Collection:** `bookings`

| Field | Type | Notes |
|-------|------|-------|
| bookingRef | String | Unique. Format: `EDGE-YYYYMMDD-NNNN` |
| customer | ObjectId → User | Required |
| assignedMovers | [ObjectId → Mover] | Set by admin |
| customerSnapshot | Object | Frozen copy of customer data at booking time (firstName, lastName, email, phone, dateOfBirth, governmentIdType, governmentIdNumber, address, emergencyContact) |
| serviceType | String | `residential` \| `office` \| `furniture` \| `packing` \| `loading` \| `junk_removal` |
| pickup.address | String | Text address |
| pickup.coordinates | {lat, lng} | Optional GPS |
| pickup.floor | Number | For surcharge calc |
| pickup.hasElevator | Boolean | Affects surcharge |
| pickup.parkingDistance | String | `close` \| `moderate` \| `far` |
| pickup.hasNarrowStairs | Boolean | Affects surcharge |
| dropoff.* | — | Same structure as pickup |
| distanceKm | Number | Calculated via Google Maps |
| moveSize | String | `small` \| `medium` \| `large` \| `custom` |
| items | Object | beds, sofas, tables, chairs, boxes, tvs, fridges, washingMachines, pianos, safes, others |
| hasFragileItems | Boolean | Adds $75 surcharge |
| estimatedWeightKg | Number | |
| itemPhotos | [String] | Max 10 URLs |
| truckType | String | `van` \| `medium` \| `large` |
| workersCount | Number | 2 minimum typical |
| urgency | String | `standard` \| `same_day` \| `express` |
| moveDate | Date | Scheduled move date |
| preferredTime | String | e.g. "Morning", "Afternoon" |
| pricing | Object | See Pricing section below |
| paymentStatus | String | `awaiting_transfer` → `receipt_submitted` → `verified` \| `rejected` \| `refunded` |
| transfer | ObjectId → Transfer | Linked when receipt submitted |
| status | String | `quote` → `confirmed` → `assigned` → `in_progress` → `completed` \| `cancelled` |
| statusHistory | Array | `{status, timestamp, note, updatedBy}` — full audit trail |
| adminNotes | String | Internal notes by admin |
| cancellationReason | String | Set on cancel |
| review | ObjectId → Review | Set after customer reviews |
| quoteExpiresAt | Date | 48 hours from creation |

**Pricing sub-document:**
| Field | Type | Notes |
|-------|------|-------|
| basePrice | Number | In cents (CAD). e.g. 15000 = $150.00 |
| distanceCost | Number | distanceKm × rate |
| laborCost | Number | workers × rate |
| truckCost | Number | Based on truck type |
| urgencyCost | Number | 0 / 10000 / 20000 |
| accessibilitySurcharge | Number | Floor + elevator + stairs + parking |
| fragileSurcharge | Number | 7500 if hasFragileItems |
| discountAmount | Number | Applied discount |
| totalEstimate | Number | Rounded to nearest $5 |
| finalPrice | Number | Same as totalEstimate initially; admin can override |
| currency | String | Default "CAD" |

---

## Mover

**File:** `models/Mover.js`  
**Collection:** `movers`

| Field | Type | Notes |
|-------|------|-------|
| user | ObjectId → User | Linked user account |
| isAvailable | Boolean | Default true |
| skills | [String] | e.g. ["heavy_lifting", "packing"] |
| assignedBookings | [ObjectId → Booking] | Current/past assignments |
| rating | Number | Default 0 |
| completedJobs | Number | Default 0 |
| phone | String | Contact number |
| vehicleType | String | `van` \| `medium` \| `large` |

---

## PricingConfig

**File:** `models/PricingConfig.js`  
**Collection:** `pricingconfigs`

All monetary values are in **cents (CAD)**.

| Field | Default | Meaning |
|-------|---------|---------|
| basePrice | 15000 | $150.00 flat fee for every move |
| distanceRatePerKm | 250 | $2.50 per km |
| laborRatePerWorker | 5000 | $50.00 per worker |
| truckRates.van | 7500 | $75.00 for van |
| truckRates.medium | 12500 | $125.00 for medium truck |
| truckRates.large | 20000 | $200.00 for large truck |
| urgencyRates.standard | 0 | No surcharge |
| urgencyRates.same_day | 10000 | +$100.00 |
| urgencyRates.express | 20000 | +$200.00 |
| floorSurchargePerFloor | 2500 | $25.00 per floor above ground |
| noElevatorSurcharge | 5000 | $50.00 if no elevator |
| narrowStairsSurcharge | 4000 | $40.00 if narrow stairs |
| farParkingSurcharge | 3000 | $30.00 if parking is far |
| fragileSurcharge | 7500 | $75.00 if fragile items |
| currency | "CAD" | |
| updatedBy | ObjectId → User | Admin who last saved |

---

## BankSettings

**File:** `models/BankSettings.js`  
**Collection:** `banksettings`

| Field | Type | Notes |
|-------|------|-------|
| accountName | String | "Edge Moving Solution Ltd." |
| accountNumber | String | Bank account number |
| bankName | String | e.g. "TD Bank" |
| etransferEmail | String | Interac e-Transfer destination |
| updatedBy | ObjectId → User | Admin who last saved |

Shown to customers on the Payment Instructions page so they know where to send money.

---

## Transfer

**File:** `models/Transfer.js`  
**Collection:** `transfers`

| Field | Type | Notes |
|-------|------|-------|
| booking | ObjectId → Booking | Required |
| customer | ObjectId → User | Required |
| customerSnapshot | Object | Frozen customer data at submission time |
| amount | Number | In cents |
| currency | String | Default "CAD" |
| transferReference | String | Customer-entered reference from their bank (Required) |
| transferDate | Date | When customer says they sent it (Required) |
| transferMethod | String | `interac_etransfer` \| `bank_transfer` \| `cash_deposit` |
| senderName | String | Name on the bank transfer (Required) |
| receiptImageUrl | String | URL of the uploaded receipt image (Required) |
| status | String | `pending` → `approved` \| `rejected` |
| adminNote | String | Admin's note on approve/reject |
| reviewedBy | ObjectId → User | Admin who reviewed |
| reviewedAt | Date | When reviewed |

---

## Review

**File:** `models/Review.js`  
**Collection:** `reviews`

| Field | Type | Notes |
|-------|------|-------|
| booking | ObjectId → Booking | Required |
| customer | ObjectId → User | Required |
| rating | Number | 1–5 (Required) |
| comment | String | Optional text |

Reviews can only be left after booking `status === "completed"`. One review per booking.

---

## AuditLog

**File:** `models/AuditLog.js`  
**Collection:** `auditlogs`

| Field | Type | Notes |
|-------|------|-------|
| admin | ObjectId → User | Who performed the action |
| customer | ObjectId → User | Who it was done to |
| action | String | e.g. `"REVEAL_GOV_ID"` |
| createdAt | Date | Auto timestamp |

Currently tracks: **government ID reveals** by admins.
