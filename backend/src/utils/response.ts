import { Response } from "express";

export function successRes<T>(res: Response, data: T, status = 200): Response {
  return res.status(status).json({ success: true, data });
}

export function errorRes(res: Response, message: string, status = 400, code?: string): Response {
  return res.status(status).json({ success: false, error: { message, code } });
}
