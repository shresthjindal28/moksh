import multer from "multer";
import { validateFile } from "../services/upload.service";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 10;

const memoryStorage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_SIZE, files: MAX_FILES },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}`));
    }
  },
}).array("files", MAX_FILES);

export function runUploadValidation(files: Express.Multer.File[]): void {
  for (const file of files) {
    validateFile(file);
  }
}
