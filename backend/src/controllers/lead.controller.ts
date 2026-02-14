import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { prisma } from "../config/db";
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
    const lead = await prisma.lead.create({
      data: {
        productId: productId || undefined,
        metadata: metadata ?? undefined,
      },
    });
    successRes(res, { id: lead.id }, 201);
  } catch (err) {
    next(err);
  }
}
