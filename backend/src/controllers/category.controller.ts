import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import { prisma } from "../config/db";
import { successRes, errorRes } from "../utils/response";
import { notFound } from "../utils/errors";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const createCategoryValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("description").optional().trim(),
  body("order").optional().isInt({ min: 0 }),
];

export const updateCategoryValidation = [
  param("id").notEmpty().withMessage("Category ID required"),
  body("name").optional().trim().notEmpty(),
  body("description").optional().trim(),
  body("order").optional().isInt({ min: 0 }),
];

export async function listCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });
    successRes(res, categories);
  } catch (err) {
    next(err);
  }
}

export async function getCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!category) {
      next(notFound("Category not found"));
      return;
    }
    successRes(res, category);
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errorRes(res, errors.array()[0].msg, 400);
      return;
    }
    const { name, description, order } = req.body;
    const slug = slugify(name);
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || undefined,
        order: order != null ? Number(order) : 0,
      },
    });
    successRes(res, category, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errorRes(res, errors.array()[0].msg, 400);
      return;
    }
    const { name, description, order } = req.body;
    const data: { name?: string; slug?: string; description?: string; order?: number } = {};
    if (name !== undefined) {
      data.name = name;
      data.slug = slugify(name);
    }
    if (description !== undefined) data.description = description;
    if (order !== undefined) data.order = Number(order);

    const category = await prisma.category.update({
      where: { id: req.params.id },
      data,
    });
    successRes(res, category);
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      next(notFound("Category not found"));
      return;
    }
    next(err);
  }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const count = await prisma.product.count({ where: { categoryId: req.params.id } });
    if (count > 0) {
      errorRes(res, `Cannot delete category: ${count} product(s) are using it`, 400, "CATEGORY_IN_USE");
      return;
    }
    await prisma.category.delete({ where: { id: req.params.id } });
    successRes(res, { deleted: true });
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      next(notFound("Category not found"));
      return;
    }
    next(err);
  }
}
