import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import * as settingsController from "../controllers/settings.controller";

const router = Router();

router.get("/public", settingsController.getPublicSettings);
router.get("/", requireAuth, settingsController.getSettings);
router.put("/", requireAuth, settingsController.updateSettingsValidation, settingsController.updateSettings);

export default router;
