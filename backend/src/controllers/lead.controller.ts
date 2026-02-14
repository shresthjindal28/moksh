import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { supabase, assertOk } from "../config/supabase";
import { successRes, errorRes } from "../utils/response";

export const createLeadValidation = [
  body("productId").optional().isString(),
  body("metadata").optional().isObject(),
];

export async function createLead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errorRes(res, errors.array()[0].msg, 400);
      return;
    }
    const { productId, metadata } = req.body;
    const result = await supabase
      .from("Lead")
      .insert({ product_id: productId || null, metadata: metadata ?? null })
      .select("id")
      .single();
    const row = assertOk(result);
    const id = row && typeof row === "object" && "id" in row ? (row as { id: string }).id : null;
    successRes(res, { id: id ?? "" }, 201);
  } catch (err) {
    next(err);
  }
}
