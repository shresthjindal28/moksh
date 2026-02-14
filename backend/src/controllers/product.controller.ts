import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import { prisma } from "../config/db";
import { successRes, errorRes } from "../utils/response";
import { notFound } from "../utils/errors";

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

const categorySelect = { id: true, name: true, slug: true };

export async function listProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = String(req.query.search || "").trim();
    const category = req.query.category as string | undefined;
    const isActive = req.query.isActive as string | undefined;
    const minPrice = req.query.minPrice != null ? parseFloat(String(req.query.minPrice)) : undefined;
    const maxPrice = req.query.maxPrice != null ? parseFloat(String(req.query.maxPrice)) : undefined;
    const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit), 10) || 20));
    const skip = (page - 1) * limit;

    type Where = {
      categoryId?: string;
      isActive?: boolean;
      price?: { gte?: number; lte?: number };
      OR?: Array<{ name?: { contains: string; mode: "insensitive" }; description?: { contains: string; mode: "insensitive" } }>;
    };
    const where: Where = {};
    if (category) where.categoryId = category;
    if (isActive !== undefined) where.isActive = isActive === "true";
    if (minPrice != null && !Number.isNaN(minPrice)) {
      where.price = { ...where.price, gte: minPrice };
    }
    if (maxPrice != null && !Number.isNaN(maxPrice)) {
      where.price = { ...where.price, lte: maxPrice };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: { select: categorySelect } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);
    successRes(res, { items, total, page, limit });
  } catch (err) {
    next(err);
  }
}

/** Single query, O(1) — returns most recently created active product for hero/featured use. */
export async function getLatestProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await prisma.product.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 1,
      include: { category: { select: categorySelect } },
    });
    successRes(res, product ?? null);
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: { select: categorySelect } },
    });
    if (!product) {
      next(notFound("Product not found"));
      return;
    }
    successRes(res, product);
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
    const product = await prisma.product.create({
      data: {
        name,
        description: description || undefined,
        price: price != null ? Number(price) : undefined,
        categoryId,
        images: Array.isArray(images) ? images : [],
        whatsappNumber: whatsappNumber || undefined,
        isActive: isActive !== false,
      },
      include: { category: { select: categorySelect } },
    });
    successRes(res, product, 201);
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
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(categoryId !== undefined && { categoryId }),
        ...(images !== undefined && { images: Array.isArray(images) ? images : [] }),
        ...(whatsappNumber !== undefined && { whatsappNumber: whatsappNumber || undefined }),
        ...(isActive !== undefined && { isActive }),
      },
      include: { category: { select: categorySelect } },
    });
    successRes(res, product);
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      next(notFound("Product not found"));
      return;
    }
    next(err);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    successRes(res, { deleted: true });
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2025") {
      next(notFound("Product not found"));
      return;
    }
    next(err);
  }
}

export async function toggleVisibility(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) {
      next(notFound("Product not found"));
      return;
    }
    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data: { isActive: !product.isActive },
      include: { category: { select: categorySelect } },
    });
    successRes(res, updated);
  } catch (err) {
    next(err);
  }
}
