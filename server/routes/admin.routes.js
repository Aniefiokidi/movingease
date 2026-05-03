import { Router } from "express";
import {
  assignMovers, createMover, getAllBookings, getCustomerById, getCustomers,
  getMovers, getPricing, getStats, revealCustomerId,
  updateBookingAdmin, updateMover, updatePricing
} from "../controllers/admin.controller.js";
import { adminOnly, protect } from "../middleware/auth.middleware.js";

const router = Router();
router.use(protect, adminOnly);

router.get("/bookings", getAllBookings);
router.patch("/bookings/:id", updateBookingAdmin);
router.post("/bookings/:id/assign", assignMovers);

router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomerById);
router.get("/customers/:id/reveal-id", revealCustomerId);

router.get("/movers", getMovers);
router.post("/movers", createMover);
router.patch("/movers/:id", updateMover);

router.get("/pricing", getPricing);
router.patch("/pricing", updatePricing);

router.get("/stats", getStats);

export default router;
