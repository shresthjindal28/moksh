import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import * as dashboardController from "../controllers/dashboard.controller";

const router = Router();

router.get("/stats", requireAuth, dashboardController.getStats);

export default router;
