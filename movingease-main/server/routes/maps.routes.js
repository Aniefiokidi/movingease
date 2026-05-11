import { Router } from "express";
import { autocompleteProxy, distanceProxy } from "../controllers/maps.controller.js";

const router = Router();
router.post("/distance", distanceProxy);
router.post("/autocomplete", autocompleteProxy);

export default router;
