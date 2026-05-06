import { Router } from "express";
import { cancelBooking, confirmBooking, createBooking, getBookingById, getMyBookings, uploadBookingPhotos } from "../controllers/booking.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { imageUpload } from "../middleware/upload.middleware.js";

const router = Router();
router.post("/", createBooking);
router.get("/:id", getBookingById);
router.get("/", protect, getMyBookings);
router.patch("/:id/confirm", protect, confirmBooking);
router.patch("/:id/cancel", protect, cancelBooking);
router.post("/:id/photos", protect, imageUpload.array("images", 10), uploadBookingPhotos);

export default router;
