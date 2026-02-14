import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import { supabase, assertOk } from "../config/supabase";
import { successRes, errorRes } from "../utils/response";
import { notFound } from "../utils/errors";
import { rowToCamel, rowsToCamel } from "../lib/rowMap";

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
    const result = await supabase.from("Category").select("*").order("order", { ascending: true }).order("name", { ascending: true });
    const rows = assertOk(result);
    const categories = rowsToCamel(Array.isArray(rows) ? rows : []);
    successRes(res, categories);
  } catch (err) {
    next(err);
  }
}

export async function getCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await supabase.from("Category").select("*").eq("id", req.params.id).maybeSingle();
    const row = assertOk(result);
    if (!row) {
      next(notFound("Category not found"));
      return;
    }
    successRes(res, rowToCamel(row as Record<string, unknown>));
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
    const now = new Date().toISOString();
    const result = await supabase
      .from("Category")
      .insert({ name, slug, description: description || null, order: order != null ? Number(order) : 0, created_at: now, updated_at: now })
      .select("*")
      .single();
    const row = assertOk(result);
    successRes(res, rowToCamel(row as Record<string, unknown>), 201);
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
    const data: Record<string, unknown> = {};
    if (name !== undefined) {
      data.name = name;
      data.slug = slugify(name);
    }
    if (description !== undefined) data.description = description;
    if (order !== undefined) data.order = Number(order);

    (data as Record<string, unknown>).updated_at = new Date().toISOString();
    const result = await supabase.from("Category").update(data).eq("id", req.params.id).select("*").single();
    const row = assertOk(result);
    if (!row) {
      next(notFound("Category not found"));
      return;
    }
    successRes(res, rowToCamel(row as Record<string, unknown>));
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { count } = await supabase.from("Product").select("*", { count: "exact", head: true }).eq("category_id", req.params.id);
    if (typeof count === "number" && count > 0) {
      errorRes(res, `Cannot delete category: ${count} product(s) are using it`, 400, "CATEGORY_IN_USE");
      return;
    }
    await supabase.from("Category").delete().eq("id", req.params.id);
    successRes(res, { deleted: true });
  } catch (err) {
    next(err);
  }
}
