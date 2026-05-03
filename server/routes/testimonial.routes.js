import { Router } from "express";
import Testimonial from "../models/Testimonial.js";
import { apiResponse } from "../utils/response.js";

const router = Router();

// Public — list all testimonials newest first
router.get("/", async (_req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean();
    return apiResponse(res, 200, true, testimonials, "Testimonials");
  } catch (err) {
    next(err);
  }
});

// Public — submit a testimonial
router.post("/", async (req, res, next) => {
  try {
    const { name, location, quote } = req.body;
    if (!name || !location || !quote) {
      return apiResponse(res, 400, false, null, "name, location and quote are required");
    }
    const testimonial = await Testimonial.create({ name, location, quote });
    return apiResponse(res, 201, true, testimonial, "Testimonial added");
  } catch (err) {
    next(err);
  }
});

export default router;
