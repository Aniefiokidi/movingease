import { Router } from "express";
import { forgotPassword, login, logout, me, register, resetPassword, verifyEmail } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authRateLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();
router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.post("/logout", logout);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", authRateLimiter, forgotPassword);
router.post("/reset-password/:token", authRateLimiter, resetPassword);
router.get("/me", protect, me);

export default router;
