# 04 — Auth and Security

---

## Authentication Flow

### Registration
1. Client POSTs to `/api/auth/register` with full user details
2. Server checks for duplicate email
3. Password is hashed with **bcrypt** (cost factor 12)
4. Government ID number is **AES-256-CBC encrypted** before storage
5. A random 20-byte hex **email verification token** is generated and saved
6. A welcome email with the verification link is sent
7. A **JWT** is signed and set as an `httpOnly` cookie — user is immediately logged in
8. Response returns user object (no password or hash)

### Login
1. Client POSTs `{ email, password }`
2. User is looked up; if not found → 401 (same message as wrong password, prevents enumeration)
3. bcrypt.compare() validates password
4. `lastLogin` timestamp updated
5. New JWT signed and set as `httpOnly` cookie
6. Response returns user object

### Logout
- Server calls `res.clearCookie("token")`
- JWT is stateless — no server-side session to destroy

### Email Verification
- Token is a `crypto.randomBytes(20).toString("hex")`
- Visit `/verify/:token` → GET `/api/auth/verify-email/:token`
- Token cleared from DB, `isVerified` set to `true`

### Password Reset
1. POST `/auth/forgot-password` with email
2. Always returns 200 (no user enumeration)
3. If email exists: random token saved, expires in **30 minutes**
4. Reset link sent by email: `CLIENT_URL/reset/:token`
5. POST `/auth/reset-password/:token` with new password
6. Token expiry checked; password re-hashed

---

## JWT Details

**Library:** `jsonwebtoken`  
**Payload:** `{ id: userId }`  
**Secret:** `process.env.JWT_SECRET`  
**Expiry:** `process.env.JWT_EXPIRES_IN` (default `"7d"`)

**Cookie settings:**
```js
{
  httpOnly: true,       // JavaScript cannot read it (XSS protection)
  sameSite: "lax",      // CSRF protection
  secure: true,         // HTTPS only in production (false in dev)
  maxAge: 7 days        // Browser lifetime
}
```

**Auth middleware (`protect`):**
1. Reads `req.cookies.token`
2. If missing → 401
3. `jwt.verify()` decodes payload
4. `User.findById(payload.id)` — ensures user still exists
5. Sets `req.user` for downstream handlers

**Admin middleware (`adminOnly`):**
- Checks `req.user.role === "admin"` — 403 otherwise
- Always applied after `protect`

---

## Rate Limiting

**Library:** `express-rate-limit`  
**Applied to:** `/auth/register`, `/auth/login`, `/auth/forgot-password`, `/auth/reset-password/:token`

```
Window: 15 minutes
Max requests: 5
Response on exceed: 429 with JSON error
```

---

## Government ID Encryption

**Algorithm:** AES-256-CBC  
**Key derivation:** `SHA-256(process.env.GOV_ID_ENCRYPTION_KEY || process.env.JWT_SECRET)`  
**IV:** 16 random bytes per encryption (stored with the ciphertext)  
**Storage format:** `"<iv_hex>:<ciphertext_hex>"`

```js
// Encrypt
encryptText("DL-123456")
// → "a3b4...c5d6:f7e8...9a0b"

// Decrypt
decryptText("a3b4...c5d6:f7e8...9a0b")
// → "DL-123456"

// Mask (for display)
maskId("DL-123456")
// → "****3456"
```

When an admin "reveals" a customer's government ID:
1. It is decrypted
2. An **AuditLog** entry is written with the admin's ID, customer's ID, and action `"REVEAL_GOV_ID"`
3. The full plain value is returned (admin is responsible for secure handling)

The **customerSnapshot** embedded in bookings and transfers stores the encrypted ID — it is not decrypted automatically when querying bookings.

---

## CORS

Server is configured to accept requests only from `process.env.CLIENT_URL` with `credentials: true`.  
This means cookies are sent cross-origin but only to the whitelisted frontend URL.

---

## Helmet

`helmet()` middleware sets security HTTP headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security` (in prod)
- `Content-Security-Policy` (default Helmet config)
- And others

---

## File Upload Security

**Library:** Multer with `memoryStorage`  
- Only `image/*` MIME types accepted (fileFilter)
- Max file size: **5 MB**
- Max files: **10** (for booking photos) / **1** (for receipt)
- Files validated on MIME type before upload

---

## Input Validation

- Backend uses Zod (installed, available for further use)
- Email uniqueness enforced by MongoDB unique index
- Enum fields validated by Mongoose schema
- Phone format validated on client side with regex: `/^\+1\s?\d{3}-\d{3}-\d{4}$/`
- Password reset token expiry checked server-side before accepting new password
