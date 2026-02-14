import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { AppError } from "../utils/errors";
import { env } from "../config/env";

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File too large. Max 10MB per file."
        : err.code === "LIMIT_FILE_COUNT"
          ? "Too many files. Max 10 per request."
          : err.message;
    res.status(400).json({ success: false, error: { message, code: "UPLOAD_ERROR" } });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: { message: err.message, code: err.code },
    });
    return;
  }

  if (err.name === "ValidationError") {
    res.status(400).json({
      success: false,
      error: { message: err.message, code: "VALIDATION_ERROR" },
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    success: false,
    error: {
      message: env.NODE_ENV === "production" ? "Internal server error" : err.message,
      code: "INTERNAL_ERROR",
    },
  });
}
