import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { isCloudinaryConfigured, cloudinary } from "../config/cloudinary";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export interface UploadResult {
  url: string;
  publicId?: string;
  filename: string;
  mimeType: string;
  size: number;
}

export function validateFile(file: Express.Multer.File): void {
  if (!ALLOWED_MIME.includes(file.mimetype)) {
    throw new Error(`Invalid file type: ${file.mimetype}. Allowed: ${ALLOWED_MIME.join(", ")}`);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }
}

export async function uploadFromBuffer(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  folder = "moksh"
): Promise<UploadResult> {
  const size = buffer.length;
  const ext = path.extname(originalName) || ".jpg";
  const baseName = path.basename(originalName, ext) || "image";

  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadOptions: { folder: string; resource_type: "image" } = {
        folder,
        resource_type: "image",
      };
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          if (!result || !result.secure_url) {
            reject(new Error("Cloudinary upload failed"));
            return;
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            filename: originalName,
            mimeType,
            size,
          });
        }
      );
      uploadStream.end(buffer);
    });
  }

  // Local fallback
  const uploadsDir = path.join(process.cwd(), "uploads");
  const now = new Date();
  const monthDir = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const dirPath = path.join(uploadsDir, monthDir);
  await fs.mkdir(dirPath, { recursive: true });
  const filename = `${uuidv4()}-${baseName}${ext}`.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = path.join(dirPath, filename);
  await fs.writeFile(filePath, buffer);
  const url = `/uploads/${monthDir}/${filename}`;
  return {
    url,
    filename: originalName,
    mimeType,
    size,
  };
}
