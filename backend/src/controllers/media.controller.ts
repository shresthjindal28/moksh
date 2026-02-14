import { Request, Response, NextFunction } from "express";
import { supabase, assertOk } from "../config/supabase";
import { uploadFromBuffer } from "../services/upload.service";
import { runUploadValidation } from "../middleware/upload";
import { successRes, errorRes } from "../utils/response";
import { notFound } from "../utils/errors";
import { rowsToCamel } from "../lib/rowMap";

export async function uploadMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      errorRes(res, "No files uploaded", 400);
      return;
    }
    runUploadValidation(files);
    const folder = (req.body?.folder as string) || "moksh";
    const adminId = (req as Request & { admin?: { id: string } }).admin?.id;
    if (!adminId) {
      errorRes(res, "Unauthorized", 401);
      return;
    }
    const results = [];
    for (const file of files) {
      const result = await uploadFromBuffer(file.buffer, file.originalname, file.mimetype, folder);
      const now = new Date().toISOString();
      const insertResult = await supabase
        .from("Media")
        .insert({
          url: result.url,
          public_id: result.publicId ?? null,
          filename: result.filename,
          mime_type: result.mimeType,
          size: result.size,
          uploaded_by_id: adminId,
          created_at: now,
        })
        .select("id")
        .single();
      const row = assertOk(insertResult);
      const id = row && typeof row === "object" && "id" in row ? (row as { id: string }).id : null;
      results.push({ id, url: result.url, publicId: result.publicId });
    }
    successRes(res, results, 201);
  } catch (err) {
    next(err);
  }
}

export async function listMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit), 10) || 20));
    const from = (page - 1) * limit;

    const result = await supabase
      .from("Media")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, from + limit - 1);
    const rows = assertOk(result);
    const total = result.count ?? 0;
    const items = rowsToCamel(Array.isArray(rows) ? rows : []);
    successRes(res, { items, total, page, limit });
  } catch (err) {
    next(err);
  }
}

export async function deleteMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const r = await supabase.from("Media").select("id").eq("id", req.params.id).maybeSingle();
    const row = assertOk(r);
    if (!row) {
      next(notFound("Media not found"));
      return;
    }
    await supabase.from("Media").delete().eq("id", req.params.id);
    successRes(res, { deleted: true });
  } catch (err) {
    next(err);
  }
}
