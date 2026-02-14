import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { supabase, assertOk } from "../config/supabase";
import { env } from "../config/env";
import { successRes, errorRes } from "../utils/response";
import { unauthorized } from "../utils/errors";
import { AuthPayload } from "../middleware/auth";
import { rowToCamel } from "../lib/rowMap";

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
    const { data: rows } = await supabase.from("Admin").select("id, email, password_hash, name").eq("email", email).limit(1);
    const row = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    if (!row) {
      next(unauthorized("Invalid email or password"));
      return;
    }
    const admin = rowToCamel<{ id: string; email: string; passwordHash: string; name: string }>(row as Record<string, unknown>);
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
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: 60 * 60 * 24 * 7 });
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
