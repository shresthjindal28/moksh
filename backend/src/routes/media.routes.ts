import { Router } from "express";
import { uploadMiddleware } from "../middleware/upload";
import * as mediaController from "../controllers/media.controller";

const router = Router();

router.get("/", mediaController.listMedia);
router.post("/", uploadMiddleware, mediaController.uploadMedia);
router.delete("/:id", mediaController.deleteMedia);

export default router;
