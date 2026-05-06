import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import { apiResponse } from "../utils/response.js";

export async function createReview(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return apiResponse(res, 404, false, null, "Booking not found");
    if (String(booking.customer) !== String(req.user._id)) return apiResponse(res, 403, false, null, "Forbidden");
    if (booking.status !== "completed") return apiResponse(res, 400, false, null, "Review available after completion");

    const review = await Review.create({ booking: booking._id, customer: req.user._id, rating: req.body.rating, comment: req.body.comment });
    booking.review = review._id;
    await booking.save();
    return apiResponse(res, 201, true, review, "Review created");
  } catch (e) { next(e); }
}

export async function listReviews(_req, res, next) {
  try {
    const reviews = await Review.find().populate("customer", "firstName lastName").sort({ createdAt: -1 });
    return apiResponse(res, 200, true, reviews, "Reviews");
  } catch (e) { next(e); }
}
