import { Router } from "express";
import * as leadController from "../controllers/lead.controller";

const router = Router();

router.post("/", leadController.createLeadValidation, leadController.createLead);

export default router;
