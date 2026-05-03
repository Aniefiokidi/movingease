# 09 — Services and Integrations

---

## Email — Nodemailer (`services/notification.service.js`)

### Setup
Uses **SMTP** (any provider: Gmail, SendGrid, Mailgun, etc.)  
Transporter is created lazily (on first send).

**Required env vars:**
- `SMTP_HOST` — e.g. `smtp.gmail.com`
- `SMTP_PORT` — e.g. `587`
- `SMTP_USER` — sender email
- `SMTP_PASS` — SMTP password or app password
- `COMPANY_NAME` — shown as sender name

**If SMTP credentials are not set, emails are silently skipped** (no crash).

### Emails Sent

| Event | To | Subject |
|-------|----|---------|
| Registration | New user | "Welcome to Edge Moving Solution Ltd." |
| Email verification | New user | "Welcome to Edge Moving Solution Ltd." (contains verify link) |
| Password reset | User | "Reset Password" |
| 24-hour move reminder | Booked customer | "Move Reminder - 24 Hours" |

### Email Template
All emails share the same HTML template:
- Dark navy `#1B2A4A` heading
- White card on light grey background
- DM Sans font
- Responsive max-width 600px

```js
emailTemplate("Welcome", `Please verify your email: <link>`)
```

---

## Google Maps (`services/maps.service.js`)

**Required env var:** `GOOGLE_MAPS_API_KEY`

The server acts as a **proxy** — the API key never reaches the browser.

### Distance Matrix
- **API:** Google Maps Distance Matrix
- **Endpoint:** POST `/api/maps/distance`
- **Input:** `{ origin: "Moncton, NB", destination: "Fredericton, NB" }`
- **Returns:** Raw Google Distance Matrix response
- **Units:** metric (km)
- **Used for:** Computing `distanceKm` on the quote form

### Places Autocomplete
- **API:** Google Places Autocomplete
- **Endpoint:** POST `/api/maps/autocomplete`
- **Input:** `{ input: "123 Main" }`
- **Returns:** Raw Google Places autocomplete response
- **Restricted to:** Canada (`components: country:ca`)
- **Used for:** Address input suggestions

---

## Cloudinary (`config/cloudinary.js`)

**Required env vars:**
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Cloudinary is configured in `config/cloudinary.js` and available for import. The upload middleware currently stores files in **memory** (via Multer `memoryStorage`) and saves a placeholder URL like `uploaded://receipt.jpg` instead of actually uploading to Cloudinary.

> **Note:** The Cloudinary upload integration is stubbed. To activate it, the upload controller needs to call `cloudinary.uploader.upload_stream()` with the buffer from `req.file.buffer`.

---

## Socket.IO (`sockets/bookingSocket.js`)

**Real-time booking status updates pushed to customers.**

### Setup
Socket.IO server is created alongside the Express HTTP server:
```js
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL, credentials: true }
});
```

### Room Strategy
Each user gets their own room: `"user:<userId>"`.  
When a booking status changes, the server emits to that room.

### Event Emitted: `booking:status`
```js
io.to(`user:${booking.customer}`).emit("booking:status", {
  bookingId: booking._id,
  status: booking.status,
  paymentStatus: booking.paymentStatus
});
```

### Client-Side Usage
The frontend does not yet have a Socket.IO client connected. To add it:
```js
import { io } from "socket.io-client";
const socket = io("http://localhost:5000", { withCredentials: true });
socket.on("booking:status", (data) => {
  // update booking in UI
});
```

---

## Cron Job — Reminder Service (`services/reminder.service.js`)

**Library:** `node-cron`  
**Schedule:** Every day at **9:00 AM** server time

### What It Does
1. Finds all bookings with `moveDate` between 24h and 25h from now
2. For each booking: fetches the customer's email
3. Sends an email reminder: "Your move EDGE-XXXXXX-XXXX is scheduled within 24 hours"

### Activation
Called once at server startup:
```js
startReminderCron(); // in server.js
```

---

## Pricing Service (`services/pricing.service.js`)

Server-side authoritative pricing. Called during booking creation.

1. Fetches latest `PricingConfig` from DB (creates default if none exists)
2. Applies the formula (see `05-pricing-engine.md`)
3. Returns the full pricing breakdown object stored in the booking

---

## File Upload — Multer (`middleware/upload.middleware.js`)

**Library:** Multer  
**Storage:** Memory (buffer; not disk)

**Limits:**
- Max file size: 5 MB
- Max files: 10 (booking photos) / 1 (receipt)
- Allowed types: `image/*` only

Used on:
- `POST /bookings/:id/photos` — `imageUpload.array("images", 10)`
- `POST /transfers` — `imageUpload.single("receiptImage")`
- `PATCH /transfers/:id/resubmit` — `imageUpload.single("receiptImage")`
