# 07 — Frontend Pages & UI

## Tech Stack
- **React 18** with hooks
- **React Router v6** (BrowserRouter, Routes, Route, Link, useNavigate, useParams)
- **Tailwind CSS v3** for all styling
- **Axios** for all API calls (via `src/services/api.js`)
- **Vite 5** as the build tool and dev server

## Color Palette (CSS variables in `index.css`)
| Variable | Hex | Usage |
|----------|-----|-------|
| `--navy` | `#1B2A4A` | Primary brand color, navbar, headings |
| `--royal` | `#2E5BA8` | Secondary blue (available for links/accents) |
| `--red` | `#C0272D` | CTA buttons, warnings |
| `--light` | `#F4F6F9` | Page background |

Font: **DM Sans** (via CSS font-family)

---

## App Shell (`App.jsx`)

Every page is wrapped in:
- **Navbar** (top)
- **Page content** (flex-grows to fill height)
- **Footer** (bottom)

---

## Navbar (`components/layout/Navbar.jsx`)

Dark navy bar across the top of every page.

**Links shown:**
| Link | Always | Logged In | Admin |
|------|--------|-----------|-------|
| Edge Moving (home) | ✅ | ✅ | ✅ |
| Quote | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ✅ |
| Admin | ❌ | Only if role=admin | ✅ |
| Login | Only if not logged in | ❌ | ❌ |
| Register | Only if not logged in | ❌ | ❌ |
| Logout (button) | ❌ | ✅ | ✅ |

Logout calls `auth.logout()` from `AuthContext`, which POSTs to `/auth/logout` and clears the user state.

---

## Footer (`components/layout/Footer.jsx`)

Dark navy bar at the bottom of every page.

**Content:**
- Company name: "Edge Moving Solution Ltd."
- Phone: 506-471-9393
- Email: edgemovingsolutions@gmail.com

---

## Public Pages

### Home (`/`)

**File:** `pages/Home.jsx`

The landing page for new visitors.

**UI Elements:**
- White card with a large heading: "Your Trusted Moving Partner in New Brunswick"
- Tagline: "Fill Form → Get Estimate → Transfer Payment → We Move You"
- Red CTA button: **Get Instant Quote** → navigates to `/quote`

**No auth required.** Anyone can see this page.

---

### Login (`/login`)

**File:** `pages/Login.jsx`

Simple login form.

**UI Elements:**
- Heading: "Login"
- Email input
- Password input (type=password)
- Red "Login" submit button

**Behaviour:**
1. Calls `useAuth().login({ email, password })`
2. AuthContext POSTs to `/auth/login`
3. On success: navigates to `/dashboard`

---

### Register (`/register`)

**File:** `pages/Register.jsx`

Full registration form in a 2-column grid on medium+ screens.

**UI Elements (all required):**
- First name, Last name
- Email, Phone
- Password
- Date of birth (date picker)
- Government ID Number (text), Government ID Type (dropdown):
  - Driver's License
  - Passport
  - Provincial ID
  - Health Card
- Street, City, Province, Postal Code
- Emergency contact name, phone, relationship
- Red "Create Account" submit button

**Behaviour:**
1. Calls `useAuth().register({...})` with full payload
2. AuthContext POSTs to `/auth/register`
3. On success: navigates to `/dashboard`

---

### Quote (`/quote`)

**File:** `pages/Quote.jsx`

6-step quote form (described as such; currently rendered as a single-page form with a live price sidebar).

**Layout:** 2/3 form + 1/3 live price sidebar on medium+ screens.

**Form fields:**
- First Name, Last Name, Phone
- Pickup Address, Dropoff Address
- (Draft also supports: serviceType, truckType, workersCount, urgency, moveDate, preferredTime)
- Confirm Booking button (red)

**Live Estimate Sidebar:**
- Shows `usePrice(draft).display` — recalculates on every keystroke
- Format: "CAD $XXX.XX"

**Behaviour:**
1. On "Confirm Booking": assembles full payload including customerSnapshot
2. POSTs to `/bookings`
3. Shows success message with booking reference: `Booking created: EDGE-20260501-1234`

**Notes:** The draft state is shared via `BookingContext` so it persists across re-renders. Currently the form does not include all pricing inputs (e.g., floor, elevator) — those are separate fields that can be added.

---

## Customer Authenticated Pages

### Dashboard (`/dashboard`)

**File:** `pages/Dashboard.jsx`

Lists all of the logged-in customer's bookings.

**UI Elements:**
- Heading: "Dashboard"
- One card per booking:
  - Booking reference (bold)
  - Payment status (human-readable text):
    | Status | Displayed As |
    |--------|-------------|
    | `awaiting_transfer` | "Awaiting Transfer" |
    | `receipt_submitted` | "Receipt Submitted - Under Review" |
    | `verified` | "Payment Verified" |
    | `rejected` | "Receipt Rejected - Action Required" |
  - **Details** link → `/dashboard/bookings/:id`
  - **Upload Receipt** link → `/bookings/:id/upload-receipt`

Fetches bookings from `GET /bookings` on mount.

---

### Booking Detail (`/dashboard/bookings/:id`)

**File:** `pages/BookingDetail.jsx`

Shows full details for one booking.

**UI Elements:**
- Booking reference (heading)
- Status
- Payment status
- Service type
- Total price: `CAD $XXX.XX`
- **Payment Instructions** link → `/bookings/:id/pay`

Fetches from `GET /bookings/:id` on mount. Shows "Loading booking..." while fetching.

---

### Payment Instructions (`/bookings/:id/pay`)

**File:** `pages/PaymentInstructions.jsx`

Tells the customer exactly how to send money.

**UI Elements:**
- Heading: "Payment Instructions"
- Amount: pulled from booking `pricing.finalPrice`
- Account Name: from `BankSettings` (or "To be updated by admin")
- Bank Name: from `BankSettings` (or "To be updated by admin")
- Interac Email: from `BankSettings` (or "To be updated by admin")
- Instruction: "Include booking reference in transfer note"
- Red CTA button: **I've Made the Transfer - Upload Receipt** → `/bookings/:id/upload-receipt`

Fetches booking AND bank details in parallel on mount.

---

### Payment Upload (`/bookings/:id/upload-receipt`)

**File:** `pages/PaymentUpload.jsx`

Form for customer to submit their receipt after sending money.

**UI Elements:**
- Heading: "Upload Receipt"
- Amount in cents input (e.g., `35500`)
- Transfer reference input (the reference from their bank)
- Sender name input
- Transfer date (date picker)
- Transfer method dropdown:
  - Interac e-Transfer
  - Bank Transfer
  - Cash Deposit
- File input (image only)
- Red **Submit for Verification** button

**Behaviour:**
1. Builds `FormData` with all fields + `bookingId` + file
2. POSTs to `/transfers` as `multipart/form-data`
3. On success: navigates to `/dashboard`

---

## Admin Pages

All admin pages are at `/admin/*`. No redirect guard is implemented in the current codebase — the Navbar shows the Admin link only if `user.role === "admin"`, but the pages themselves don't force-redirect non-admins. The API endpoints are server-side protected.

### Admin Dashboard (`/admin`)

**File:** `pages/Admin/AdminDashboard.jsx`

Simple navigation hub.

**UI Elements:**
- Heading: "Admin Dashboard"
- Links to all admin sections:
  - Bookings → `/admin/bookings`
  - Transfers → `/admin/transfers`
  - Customers → `/admin/customers`
  - Movers → `/admin/movers`
  - Pricing → `/admin/pricing`
  - Reports → `/admin/reports`

---

### Admin Bookings (`/admin/bookings`)

**File:** `pages/Admin/Bookings.jsx`

Fetches all bookings and displays them as raw JSON in a `<pre>` block.

**Current state:** Data-display only. No editing UI yet — editing is done via API.

---

### Admin Transfers (`/admin/transfers`)

**File:** `pages/Admin/Transfers.jsx`

Most functional admin page. Lists all payment receipts with approve/reject actions.

**UI — Per Transfer Card:**
- Booking reference (bold)
- Customer name (from customerSnapshot)
- Amount in CAD, Status, Mismatch alert if amounts differ by >$5
- Sender name, Transfer reference
- **Approve** (green button): calls PATCH `/admin/transfers/:id/approve`
- **Reject** (red button): prompts for rejection reason, calls PATCH `/admin/transfers/:id/reject`

List refreshes automatically after each action.

---

### Admin Customers (`/admin/customers`)

**File:** `pages/Admin/Customers.jsx`

Fetches all customers and displays as raw JSON in a `<pre>` block.

---

### Admin Movers (`/admin/movers`)

**File:** `pages/Admin/Movers.jsx`

Fetches all movers and displays as raw JSON in a `<pre>` block.

---

### Admin Pricing (`/admin/pricing`)

**File:** `pages/Admin/Pricing.jsx`

Fetches current pricing config and displays as raw JSON in a `<pre>` block.

---

### Admin Reports (`/admin/reports`)

**File:** `pages/Admin/Reports.jsx`

Fetches stats and displays as raw JSON in a `<pre>` block.

**Stats shown:**
- `todayBookings` — bookings created today
- `pendingReceipts` — transfers awaiting review
- `verifiedPayments` — bookings with verified payment
- `activeMoves` — bookings in confirmed/assigned/in_progress

---

## Not Found (`/*`)

**File:** `pages/NotFound.jsx`

Simple text: "Page not found."

---

## State Management

### AuthContext (`context/AuthContext.jsx`)

Global auth state. Available via `useAuth()` hook.

**Exposes:**
| Property | Type | Description |
|----------|------|-------------|
| `user` | Object \| null | Current user (null if not logged in) |
| `loading` | Boolean | True during initial auth check |
| `login(payload)` | Function | POSTs to /auth/login, sets user |
| `register(payload)` | Function | POSTs to /auth/register, sets user |
| `logout()` | Function | POSTs to /auth/logout, clears user |

On app load, calls `GET /auth/me` to restore session from cookie.

### BookingContext (`context/BookingContext.jsx`)

Holds the quote form draft across component re-renders.

**Exposes:**
| Property | Type | Description |
|----------|------|-------------|
| `draft` | Object | Current form values (default: residential, 2 workers, van, standard) |
| `setDraft` | Function | Update any draft field |

---

## Component Directories (Currently Empty)

These folders exist for future components and are not yet populated:
- `components/admin/` — Admin-specific reusable components
- `components/booking/` — Booking form steps, cards
- `components/common/` — Shared UI (Button, Input, Modal, etc.)
- `components/dashboard/` — Dashboard widgets
- `components/identity/` — ID verification UI
- `components/payment/` — Payment forms, status displays
