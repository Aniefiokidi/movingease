# 12 — Booking Lifecycle

A booking moves through two parallel state machines: **status** and **paymentStatus**.

---

## Status State Machine

```
                     ┌─────────────────────┐
                     │        quote         │  ← Created by customer
                     └──────────┬──────────┘
                                │ Customer confirms (PATCH /:id/confirm)
                                ▼
                     ┌─────────────────────┐
                     │      confirmed       │  ← Awaiting admin + payment
                     └──────────┬──────────┘
                                │ Admin assigns movers (POST /:id/assign)
                                ▼
                     ┌─────────────────────┐
                     │       assigned       │  ← Movers are scheduled
                     └──────────┬──────────┘
                                │ Admin updates to in_progress
                                ▼
                     ┌─────────────────────┐
                     │     in_progress      │  ← Move is happening
                     └──────────┬──────────┘
                                │ Admin marks completed
                                ▼
                     ┌─────────────────────┐
                     │      completed       │  ← Customer can leave review
                     └─────────────────────┘

    ← At any point, customer (or admin) can cancel →
                     ┌─────────────────────┐
                     │      cancelled       │
                     └─────────────────────┘
```

**Who can change status:**
- `quote → confirmed`: Customer (`PATCH /bookings/:id/confirm`)
- `confirmed → cancelled`: Customer (`PATCH /bookings/:id/cancel`)
- `confirmed → assigned`: Admin (assign movers)
- `assigned → in_progress → completed`: Admin (`PATCH /admin/bookings/:id`)
- Any → `cancelled`: Admin (`PATCH /admin/bookings/:id`)

---

## Payment Status State Machine

```
  awaiting_transfer
        │
        │ Customer submits receipt (POST /transfers)
        ▼
  receipt_submitted  ────────────────────────────────┐
        │                                            │
        │ Admin approves                  Admin rejects
        ▼                                            ▼
    verified                                      rejected
                                                     │
                                                     │ Customer resubmits
                                                     │ (PATCH /transfers/:id/resubmit)
                                                     ▼
                                             receipt_submitted  (loop)

  (Admin can also set: refunded)
```

**Who can change paymentStatus:**
- `awaiting_transfer → receipt_submitted`: System (on transfer submit)
- `receipt_submitted → verified`: Admin (approve transfer)
- `receipt_submitted → rejected`: Admin (reject transfer)
- `rejected → receipt_submitted`: System (on transfer resubmit)
- Any → `refunded`: Admin (manual update via PATCH /admin/bookings/:id)

---

## Status History (Audit Trail)

Every status change is appended to `booking.statusHistory`:

```json
[
  {
    "status": "quote",
    "timestamp": "2026-05-02T08:00:00Z",
    "note": "Quote created",
    "updatedBy": "system"
  },
  {
    "status": "confirmed",
    "timestamp": "2026-05-02T08:30:00Z",
    "note": "Customer confirmed",
    "updatedBy": "customerId"
  },
  {
    "status": "assigned",
    "timestamp": "2026-05-02T09:00:00Z",
    "note": "Movers assigned",
    "updatedBy": "adminId"
  }
]
```

This provides a complete, immutable audit trail of who did what and when.

---

## Quote Expiry

When a booking is created, `quoteExpiresAt` is set to **48 hours from creation**.

```js
quoteExpiresAt = dayjs().add(48, "hour").toDate()
```

The system does not automatically cancel expired quotes — this is a display/reminder mechanism. Admins can clean up expired quotes manually or via a future cron job.

---

## Cancellation Policy

Applied when customer cancels via `PATCH /bookings/:id/cancel`:

| Hours Until Move | Policy | Charge |
|-----------------|--------|--------|
| > 48 hours | Free cancellation | 0% |
| ≤ 48 hours | Short-notice cancellation | 25% of total |

The charge percentage is returned in the API response. The system does not automatically process the charge — it is a policy notification. Admin handles any actual charge collection.

---

## Review Eligibility

A customer can only leave a review when:
1. The booking `status === "completed"`
2. They are the booking owner
3. The booking does not already have a review

After review: `booking.review` is set to the Review document ID.

---

## Mover Assignment Conflict Check

When admin assigns movers (`POST /admin/bookings/:id/assign`), the server checks each proposed mover for conflicts:

```js
// A conflict exists if the mover is already assigned to a booking on the same
// date + preferredTime with an active status
Booking.findOne({
  assignedMovers: moverId,
  moveDate: booking.moveDate,
  preferredTime: booking.preferredTime,
  status: { $in: ["confirmed", "assigned", "in_progress"] }
})
```

Conflicting mover IDs are returned in the response, but the assignment still proceeds. The admin can then decide whether to proceed or choose different movers.

---

## Full Lifecycle Example

1. Customer registers and logs in
2. Customer fills out quote form → `POST /bookings` → `status: quote, paymentStatus: awaiting_transfer`
3. Quote shows estimated price (valid 48 hours)
4. Customer confirms → `PATCH /bookings/:id/confirm` → `status: confirmed`
5. Customer goes to Payment Instructions page — sees bank details
6. Customer sends Interac e-Transfer to the company
7. Customer uploads receipt → `POST /transfers` → `paymentStatus: receipt_submitted`
8. Admin reviews receipt in Transfers page
9. Admin approves → `paymentStatus: verified`
10. Admin assigns movers → `status: assigned`
11. Move day: Admin updates → `status: in_progress`
12. Move complete: Admin updates → `status: completed`
13. Customer can now leave a review → `POST /reviews/:bookingId`
