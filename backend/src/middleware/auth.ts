import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../config/db";
import { unauthorized } from "../utils/errors";

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
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId },
      select: { id: true, email: true, name: true },
    });
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
