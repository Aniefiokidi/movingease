import { Router } from "express";
import { addSavedAddress, changePassword, deleteSavedAddress, getProfile, updateProfile } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();
router.get("/profile", protect, getProfile);
router.patch("/profile", protect, updateProfile);
router.patch("/change-password", protect, changePassword);
router.post("/saved-addresses", protect, addSavedAddress);
router.delete("/saved-addresses/:id", protect, deleteSavedAddress);

export default router;
