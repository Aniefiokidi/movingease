import { Router } from "express";
import { submitRequest } from "../controllers/request.controller.js";

const router = Router();
router.post("/", submitRequest);

export default router;
