import { Router } from "express";
import { getTransfer, myTransfers, resubmitTransfer, submitTransfer } from "../controllers/transfer.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { imageUpload } from "../middleware/upload.middleware.js";

const router = Router();
router.post("/", imageUpload.single("receiptImage"), submitTransfer);
router.get("/my", protect, myTransfers);
router.get("/:id", protect, getTransfer);
router.patch("/:id/resubmit", protect, imageUpload.single("receiptImage"), resubmitTransfer);

export default router;
