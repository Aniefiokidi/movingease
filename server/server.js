import dotenv from "dotenv";
import express from "express";
import http from "http";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import testimonialRoutes from "./routes/testimonial.routes.js";
import mapsRoutes from "./routes/maps.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import { startReminderCron } from "./services/reminder.service.js";

dotenv.config();

const app = express();

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((o) => o.trim())
  : ["http://localhost:3000"];

app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Lazily connect to MongoDB — cached across serverless invocations
let dbConnected = false;
app.use(async (_req, _res, next) => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
  next();
});

app.get("/api/health", (_req, res) => res.json({ success: true, message: "OK", data: null }));
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/maps", mapsRoutes);

app.use(notFound);
app.use(errorHandler);

// Local dev only — Vercel uses the exported app directly
if (process.env.NODE_ENV !== "production") {
  const server = http.createServer(app);
  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    console.log(`Server running on ${port}`);
    startReminderCron();
  });
}

export default app;
