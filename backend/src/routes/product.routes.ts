import { Router } from "express";
import { param } from "express-validator";
import { requireAuth } from "../middleware/auth";
import * as productController from "../controllers/product.controller";

const router = Router();

router.get("/", productController.listProducts);
router.get("/:id", productController.getProduct);
router.post("/", requireAuth, productController.createProductValidation, productController.createProduct);
router.put(
  "/:id",
  requireAuth,
  param("id").notEmpty(),
  productController.updateProductValidation,
  productController.updateProduct
);
router.delete("/:id", requireAuth, productController.deleteProduct);
router.patch(
  "/:id/visibility",
  requireAuth,
  param("id").notEmpty(),
  productController.toggleVisibility
);

export default router;
