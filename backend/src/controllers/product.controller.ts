import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import { supabase, assertOk } from "../config/supabase";
import { successRes, errorRes } from "../utils/response";
import { notFound } from "../utils/errors";
import { rowToCamel, rowsToCamel } from "../lib/rowMap";

export const createProductValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("description").optional().trim(),
  body("price").optional().isFloat({ min: 0 }).withMessage("Price must be non-negative"),
  body("categoryId").notEmpty().withMessage("Category is required"),
  body("images").optional().isArray().withMessage("Images must be array"),
  body("images.*").optional().isString(),
  body("whatsappNumber").optional().trim(),
  body("isActive").optional().isBoolean(),
];

export const updateProductValidation = [
  param("id").notEmpty().withMessage("Product ID required"),
  body("name").optional().trim().notEmpty(),
  body("description").optional().trim(),
  body("price").optional().isFloat({ min: 0 }),
  body("categoryId").optional().notEmpty(),
  body("images").optional().isArray(),
  body("images.*").optional().isString(),
  body("whatsappNumber").optional().trim(),
  body("isActive").optional().isBoolean(),
];

export async function listProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = String(req.query.search || "").trim();
    const category = req.query.category as string | undefined;
    const isActive = req.query.isActive as string | undefined;
    const minPrice = req.query.minPrice != null ? parseFloat(String(req.query.minPrice)) : undefined;
    const maxPrice = req.query.maxPrice != null ? parseFloat(String(req.query.maxPrice)) : undefined;
    const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit), 10) || 20));
    const from = (page - 1) * limit;

    let q = supabase
      .from("Product")
      .select("*, category:Category(id, name, slug)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, from + limit - 1);

    if (category) {
      // Support both UUID (category_id) and slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(category);
      if (isUUID) {
        q = q.eq("category_id", category);
      } else {
        // Look up category by slug first
        const { data: cat } = await supabase.from("Category").select("id").eq("slug", category).maybeSingle();
        if (cat) {
          q = q.eq("category_id", cat.id);
        } else {
          // No matching category → return empty
          successRes(res, { items: [], total: 0, page, limit });
          return;
        }
      }
    }
    if (isActive !== undefined) q = q.eq("is_active", isActive === "true");
    if (minPrice != null && !Number.isNaN(minPrice)) q = q.gte("price", minPrice);
    if (maxPrice != null && !Number.isNaN(maxPrice)) q = q.lte("price", maxPrice);
    if (search) q = q.or(`name.ilike.%${search}%,description.ilike.%${search}%`);

    const result = await q;
    const rows = assertOk(result);
    const count = result.count ?? 0;
    const items = rowsToCamel(Array.isArray(rows) ? rows : []);
    successRes(res, { items, total: count, page, limit });
  } catch (err) {
    next(err);
  }
}

export async function getLatestProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await supabase
      .from("Product")
      .select("*, category:Category(id, name, slug)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const row = assertOk(result);
    successRes(res, row ? rowToCamel(row as Record<string, unknown>) : null);
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await supabase.from("Product").select("*, category:Category(id, name, slug)").eq("id", req.params.id).maybeSingle();
    const row = assertOk(result);
    if (!row) {
      next(notFound("Product not found"));
      return;
    }
    successRes(res, rowToCamel(row as Record<string, unknown>));
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errorRes(res, errors.array()[0].msg, 400);
      return;
    }
    const { name, description, price, categoryId, images, whatsappNumber, isActive } = req.body;
    const now = new Date().toISOString();
    const result = await supabase
      .from("Product")
      .insert({
        name,
        description: description || null,
        price: price != null ? Number(price) : null,
        category_id: categoryId,
        images: Array.isArray(images) ? images : [],
        whatsapp_number: whatsappNumber || null,
        is_active: isActive !== false,
        created_at: now,
        updated_at: now,
      })
      .select("*, category:Category(id, name, slug)")
      .single();
    const row = assertOk(result);
    successRes(res, rowToCamel(row as Record<string, unknown>), 201);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errorRes(res, errors.array()[0].msg, 400);
      return;
    }
    const { name, description, price, categoryId, images, whatsappNumber, isActive } = req.body;
    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = Number(price);
    if (categoryId !== undefined) data.category_id = categoryId;
    if (images !== undefined) data.images = Array.isArray(images) ? images : [];
    if (whatsappNumber !== undefined) data.whatsapp_number = whatsappNumber;
    if (isActive !== undefined) data.is_active = isActive;
    data.updated_at = new Date().toISOString();

    const result = await supabase.from("Product").update(data).eq("id", req.params.id).select("*, category:Category(id, name, slug)").single();
    const row = assertOk(result);
    if (!row) {
      next(notFound("Product not found"));
      return;
    }
    successRes(res, rowToCamel(row as Record<string, unknown>));
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await supabase.from("Product").delete().eq("id", req.params.id).select("id").single();
    if (result.error && result.error.code !== "PGRST116") {
      throw result.error;
    }
    if (!result.data) {
      next(notFound("Product not found"));
      return;
    }
    successRes(res, { deleted: true });
  } catch (err) {
    next(err);
  }
}

export async function toggleVisibility(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const r = await supabase.from("Product").select("id, is_active").eq("id", req.params.id).maybeSingle();
    const row = assertOk(r);
    if (!row) {
      next(notFound("Product not found"));
      return;
    }
    const current = (row as { is_active: boolean }).is_active;
    const result = await supabase
      .from("Product")
      .update({ is_active: !current })
      .eq("id", req.params.id)
      .select("*, category:Category(id, name, slug)")
      .single();
    const updated = assertOk(result);
    successRes(res, updated ? rowToCamel(updated as Record<string, unknown>) : null);
  } catch (err) {
    next(err);
  }
}
