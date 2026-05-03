# 10 — Environment Variables

Create a `.env` file inside the `server/` directory.

---

## Required Variables

### Database
| Variable | Example | Notes |
|----------|---------|-------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/edge-moving` | Server will exit if missing |

### JWT / Auth
| Variable | Example | Notes |
|----------|---------|-------|
| `JWT_SECRET` | `super-secret-key-change-in-production` | Must be long and random |
| `JWT_EXPIRES_IN` | `7d` | Optional. Default: `"7d"` |

### Encryption
| Variable | Example | Notes |
|----------|---------|-------|
| `GOV_ID_ENCRYPTION_KEY` | `another-secret-key-for-aes` | Falls back to JWT_SECRET if missing. Used for AES-256-CBC government ID encryption |

### Application
| Variable | Example | Notes |
|----------|---------|-------|
| `PORT` | `5000` | Optional. Default: `5000` |
| `NODE_ENV` | `development` | `production` enables secure cookies |
| `CLIENT_URL` | `http://localhost:3000` | CORS origin + links in emails |
| `COMPANY_NAME` | `Edge Moving Solution Ltd.` | Shown in email sender field |

### Email (SMTP)
| Variable | Example | Notes |
|----------|---------|-------|
| `SMTP_HOST` | `smtp.gmail.com` | |
| `SMTP_PORT` | `587` | |
| `SMTP_USER` | `edgemovingsolutions@gmail.com` | Sender email address |
| `SMTP_PASS` | `app-password-here` | Gmail: use App Password, not account password |

If `SMTP_USER` or `SMTP_PASS` is missing, emails are silently skipped.

### Google Maps
| Variable | Example | Notes |
|----------|---------|-------|
| `GOOGLE_MAPS_API_KEY` | `AIzaSy...` | Required for distance + autocomplete. Restrict to Distance Matrix + Places APIs |

### Cloudinary (for file storage)
| Variable | Example | Notes |
|----------|---------|-------|
| `CLOUDINARY_CLOUD_NAME` | `my-cloud` | |
| `CLOUDINARY_API_KEY` | `123456789` | |
| `CLOUDINARY_API_SECRET` | `secret` | |

### Bank Details (optional defaults)
These are used to pre-populate `BankSettings` if no DB record exists yet.

| Variable | Example | Notes |
|----------|---------|-------|
| `BANK_ACCOUNT_NAME` | `Edge Moving Solution Ltd.` | |
| `BANK_ACCOUNT_NUMBER` | `1234567890` | |
| `BANK_NAME` | `TD Bank` | |
| `BANK_ETRANSFER_EMAIL` | `edgemovingsolutions@gmail.com` | |

Server warns on startup if bank details are missing.

---

## Sample `.env` File

```env
# Database
MONGODB_URI=mongodb+srv://youruser:yourpass@cluster.mongodb.net/edge-moving

# Auth
JWT_SECRET=replace-with-long-random-secret
JWT_EXPIRES_IN=7d
GOV_ID_ENCRYPTION_KEY=replace-with-another-secret

# App
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
COMPANY_NAME=Edge Moving Solution Ltd.

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=edgemovingsolutions@gmail.com
SMTP_PASS=your-gmail-app-password

# Google Maps
GOOGLE_MAPS_API_KEY=AIzaSy...

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Bank Details (initial defaults)
BANK_ACCOUNT_NAME=Edge Moving Solution Ltd.
BANK_ACCOUNT_NUMBER=1234567890
BANK_NAME=TD Bank
BANK_ETRANSFER_EMAIL=edgemovingsolutions@gmail.com
```

---

## Client Environment Variables

The Vite client reads variables prefixed with `VITE_`.  
Create `client/.env` if needed:

```env
VITE_API_URL=http://localhost:5000/api
```

Default (if not set): `http://localhost:5000/api` (hardcoded in `services/api.js`).
