import { Router } from "express";
import { createReview, listReviews } from "../controllers/review.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();
router.post("/:bookingId", protect, createReview);
router.get("/", listReviews);

export default router;
