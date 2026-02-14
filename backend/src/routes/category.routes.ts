import { Router } from "express";
import { param } from "express-validator";
import { requireAuth } from "../middleware/auth";
import * as categoryController from "../controllers/category.controller";

const router = Router();

router.get("/", categoryController.listCategories);
router.get("/:id", categoryController.getCategory);
router.post("/", requireAuth, categoryController.createCategoryValidation, categoryController.createCategory);
router.put(
  "/:id",
  requireAuth,
  categoryController.updateCategoryValidation,
  categoryController.updateCategory
);
router.delete("/:id", requireAuth, param("id").notEmpty(), categoryController.deleteCategory);

export default router;
