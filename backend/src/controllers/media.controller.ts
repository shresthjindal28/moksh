import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";
import { uploadFromBuffer } from "../services/upload.service";
import { runUploadValidation } from "../middleware/upload";
import { successRes, errorRes } from "../utils/response";
import { notFound } from "../utils/errors";

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
      const result = await uploadFromBuffer(
        file.buffer,
        file.originalname,
        file.mimetype,
        folder
      );
      const media = await prisma.media.create({
        data: {
          url: result.url,
          publicId: result.publicId,
          filename: result.filename,
          mimeType: result.mimeType,
          size: result.size,
          uploadedById: adminId,
        },
      });
      results.push({ id: media.id, url: result.url, publicId: result.publicId });
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
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.media.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.media.count(),
    ]);
    successRes(res, { items, total, page, limit });
  } catch (err) {
    next(err);
  }
}

export async function deleteMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const media = await prisma.media.findUnique({ where: { id: req.params.id } });
    if (!media) {
      next(notFound("Media not found"));
      return;
    }
    await prisma.media.delete({ where: { id: req.params.id } });
    successRes(res, { deleted: true });
  } catch (err) {
    next(err);
  }
}
