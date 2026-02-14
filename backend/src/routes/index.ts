import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import authRoutes from "./auth.routes";
import mediaRoutes from "./media.routes";
import productRoutes from "./product.routes";
import categoryRoutes from "./category.routes";
import settingsRoutes from "./settings.routes";
import dashboardRoutes from "./dashboard.routes";
import leadRoutes from "./lead.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "moksh-api" });
});

router.use("/auth", authRoutes);
router.use("/media", requireAuth, mediaRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/settings", requireAuth, settingsRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/leads", leadRoutes);

export default router;
