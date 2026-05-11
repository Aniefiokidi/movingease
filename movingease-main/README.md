# Edge Moving

Full-stack scaffold for Edge Moving Solution Ltd. using React + Express + MongoDB.

## Run

1. `cd server && npm install && npm run dev`
2. `cd client && npm install && npm run dev`

## Implemented Foundations

- JWT auth with httpOnly cookie
- Identity-heavy user model with encrypted government ID
- Booking creation with identity snapshot + server-side price calculation
- Transfer receipt submission flow
- Admin approve/reject transfer endpoints
- Audit logging endpoint for government ID reveal

## Notes

- Cloudinary/Nodemailer/Google Maps integrations are scaffolded and ready for wiring with real keys.
- Monetary values are stored as cents in pricing service.
