# 01 — System Overview

## What This System Is

**Edge Moving Solution Ltd.** is a full-stack moving company web application based in Moncton, New Brunswick, Canada. It allows customers to:
- Get instant price quotes for moving jobs
- Book and confirm moves
- Pay via Interac e-Transfer / bank transfer and upload a receipt
- Track their booking status in real time

Admins can:
- Manage all bookings, customers, movers, pricing, and payment receipts
- Approve or reject payment receipts
- Assign movers to confirmed bookings
- View financial reports and stats

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router v6, Tailwind CSS v3, Vite 5 |
| Backend | Node.js (ESM), Express 4 |
| Database | MongoDB via Mongoose 8 |
| Auth | JWT (httpOnly cookie), bcryptjs |
| File Upload | Multer (memory storage) + Cloudinary |
| Email | Nodemailer (SMTP) |
| Maps | Google Maps API (Distance Matrix + Places Autocomplete) |
| Real-time | Socket.IO v4 |
| Scheduling | node-cron (daily 9 AM reminder) |
| Encryption | AES-256-CBC (government IDs) |
| Rate Limiting | express-rate-limit (auth routes: 5 req / 15 min) |

---

## Repository Structure

```
edge-moving/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── App.jsx         # Root router
│       ├── main.jsx        # React entry point
│       ├── index.css       # Tailwind + CSS variables
│       ├── components/
│       │   └── layout/     # Navbar, Footer
│       ├── context/        # AuthContext, BookingContext
│       ├── hooks/          # useAuth, useBooking, usePrice
│       ├── pages/          # All route pages
│       │   └── Admin/      # Admin-only pages
│       ├── services/       # Axios API calls
│       └── utils/          # pricingEngine, validators
└── server/                 # Express backend
    ├── server.js           # Entry point, middleware, routes
    ├── seed.js             # DB seeder (dev only)
    ├── config/             # DB + Cloudinary setup
    ├── controllers/        # Route handlers
    ├── middleware/         # Auth, error, rate limit, upload
    ├── models/             # Mongoose schemas
    ├── routes/             # Express routers
    ├── services/           # Maps, email, pricing, reminders
    ├── sockets/            # Socket.IO emitters
    └── utils/              # JWT, encryption, helpers, response
```

---

## High-Level Data Flow

```
Browser
  │
  ├─ React App (localhost:3000)
  │     ├─ Axios → API calls to backend
  │     └─ Socket.IO → real-time booking updates
  │
  └─ Express Server (localhost:5000)
        ├─ /api/auth       → register, login, logout, verify, reset
        ├─ /api/bookings   → create, list, detail, confirm, cancel
        ├─ /api/transfers  → submit receipt, list, resubmit
        ├─ /api/admin      → full admin CRUD (protected)
        ├─ /api/users      → profile, password, saved addresses
        ├─ /api/reviews    → create + list reviews
        └─ /api/maps       → Google Maps proxy
              │
              ├─ MongoDB (bookings, users, movers, transfers, etc.)
              ├─ Cloudinary (receipt + photo storage)
              ├─ Google Maps API (distance + autocomplete)
              └─ SMTP (email notifications)
```

---

## Request / Response Convention

All API responses follow this exact shape:

```json
{
  "success": true | false,
  "data": <payload or null>,
  "message": "Human-readable string",
  "error": "<stack trace — only on 500>"
}
```

---

## Running the Project

### Server
```bash
cd server
cp .env.example .env   # fill in all variables (see 10-environment-variables.md)
npm install
npm run dev            # nodemon on port 5000
npm run seed           # seed demo data (wipes DB first)
```

### Client
```bash
cd client
npm install
npm run dev            # Vite on port 3000
```

---

## Demo Seed Accounts (after npm run seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | edgemovingsolutions@gmail.com | Admin123! |
| Mover 1 | mover1@edge.local | Mover123! |
| Mover 2 | mover2@edge.local | Mover123! |
| Mover 3 | mover3@edge.local | Mover123! |
| Customer 1–5 | customer1@edge.local … customer5@edge.local | Customer123! |
