import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { prisma } from "../config/db";
import { env } from "../config/env";
import { successRes, errorRes } from "../utils/response";
import { unauthorized } from "../utils/errors";
import { AuthPayload } from "../middleware/auth";

export const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password required"),
];

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errorRes(res, errors.array()[0].msg, 400);
      return;
    }
    const { email, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      next(unauthorized("Invalid email or password"));
      return;
    }
    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) {
      next(unauthorized("Invalid email or password"));
      return;
    }
    const payload: AuthPayload = { adminId: admin.id };
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: 60 * 60 * 24 * 7 }); // 7 days
    successRes(res, {
      token,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authReq = req as import("../middleware/auth").AuthenticatedRequest;
    if (!authReq.admin) {
      next(unauthorized("Not authenticated"));
      return;
    }
    successRes(res, authReq.admin);
  } catch (err) {
    next(err);
  }
}
