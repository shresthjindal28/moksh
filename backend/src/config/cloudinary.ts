import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

const hasCloudinaryUrl = Boolean(env.CLOUDINARY_URL);
const hasExplicitConfig =
  env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = hasCloudinaryUrl || hasExplicitConfig;

if (hasCloudinaryUrl) {
  cloudinary.config({
    secure: true,
  });
} else if (hasExplicitConfig) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export { cloudinary };
