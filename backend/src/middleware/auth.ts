import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { supabase, assertOk } from "../config/supabase";
import { unauthorized } from "../utils/errors";
import { rowToCamel } from "../lib/rowMap";

export interface AuthPayload {
  adminId: string;
}

export interface AuthenticatedRequest extends Request {
  admin?: { id: string; email: string; name: string };
}

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authReq = req as AuthenticatedRequest;
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    next(unauthorized("Missing or invalid authorization header"));
    return;
  }
  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    const result = await supabase.from("Admin").select("id, email, name").eq("id", decoded.adminId).limit(1).maybeSingle();
    const data = assertOk(result);
    if (!data) {
      next(unauthorized("Admin not found"));
      return;
    }
    const admin = rowToCamel<{ id: string; email: string; name: string }>(data as Record<string, unknown>);
    if (!admin) {
      next(unauthorized("Admin not found"));
      return;
    }
    authReq.admin = { id: admin.id, email: admin.email, name: admin.name };
    next();
  } catch {
    next(unauthorized("Invalid or expired token"));
  }
}
