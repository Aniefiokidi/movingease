# 06 — Payment Flow

Edge Moving does **not** process payments online. Instead, customers send money via Interac e-Transfer or bank transfer, then upload a photo of their receipt. Admins manually verify the receipt.

---

## Step-by-Step Flow

```
1. Customer creates a booking → status: "quote", paymentStatus: "awaiting_transfer"
2. Customer confirms booking   → status: "confirmed"
3. Customer visits Payment Instructions page
   → sees bank name, account name, Interac e-Transfer email, amount to send
4. Customer sends money through their bank
5. Customer visits Upload Receipt page
   → fills in: amount, reference number, sender name, date, method
   → uploads a photo of receipt
6. Transfer record created → paymentStatus: "receipt_submitted"
7. Admin reviews the transfer
   → If APPROVED: paymentStatus → "verified"
   → If REJECTED: paymentStatus → "rejected"
8. If rejected, customer can RESUBMIT with corrected info/new receipt
```

---

## Payment Status Values

| Status | Meaning | Who Sets It |
|--------|---------|-------------|
| `awaiting_transfer` | Quote created; customer hasn't paid yet | System (on booking create) |
| `receipt_submitted` | Customer uploaded receipt; awaiting admin review | System (on transfer submit / resubmit) |
| `verified` | Admin confirmed payment received | Admin (approve transfer) |
| `rejected` | Admin rejected the receipt (wrong amount, unclear photo, etc.) | Admin (reject transfer) |
| `refunded` | Payment was refunded | Admin (manual update) |

---

## Transfer Record Fields

When a customer submits a receipt, a `Transfer` document is created with:

| Field | Entered By | Example |
|-------|-----------|---------|
| bookingId | System | Links to the booking |
| amount | Customer | `35500` (in cents = $355.00) |
| transferReference | Customer | "EMT-2026-AB123" (reference from bank) |
| transferDate | Customer | "2026-05-01" |
| transferMethod | Customer | `interac_etransfer` |
| senderName | Customer | "Jane Doe" |
| receiptImage | Customer | Uploaded image file |

---

## Mismatch Alert

When admin lists transfers (`GET /admin/transfers`), the server adds a `mismatchAlert: true` flag if:

```
|transfer.amount - booking.pricing.finalPrice| > 500 cents ($5.00)
```

This alerts admins to possible wrong amounts or fraud.

---

## Resubmission

If admin rejects a transfer:
- Customer sees `paymentStatus: "rejected"` on their dashboard
- Customer navigates to Upload Receipt page for that booking
- PATCH `/transfers/:id/resubmit` resets transfer to `"pending"` and booking to `"receipt_submitted"`
- Customer can update reference, name, date, method, and/or upload a new image

---

## Bank Details (Admin Configurable)

Stored in `BankSettings` collection. Admin sets via `/admin/pricing` page or PATCH `/admin/bank-details`:
- Account Name
- Bank Name  
- Interac e-Transfer Email
- Account Number (optional)

Customers see this on the **Payment Instructions** page. If not yet set by admin, placeholders show "To be updated by admin".

---

## No Stripe / No Online Processing

The system intentionally avoids payment gateways. All payments are:
- Interac e-Transfer (most common in Canada)
- Bank transfer
- Cash deposit

This keeps transaction fees at zero and suits the small-business context in New Brunswick.

---

## Cancellation Policy

When a customer cancels (`PATCH /bookings/:id/cancel`):

- If move date is **more than 48 hours away**: free cancellation
- If move date is **within 48 hours**: 25% cancellation charge

The response includes `policyChargePercent: 0 | 25`. The charge is a policy notification only — the system does not automatically process a refund. Admin handles refund manually.
