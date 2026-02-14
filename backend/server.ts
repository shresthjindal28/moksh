import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { env } from "./src/config/env";
import { connectDb } from "./src/config/db";
import routes from "./src/routes";
import { errorHandler } from "./src/middleware/errorHandler";

async function main() {
  // Validate env (throws if required vars missing)
  void env.SUPABASE_URL;
  void env.SUPABASE_SERVICE_ROLE_KEY;
  void env.JWT_SECRET;

  await connectDb();
  console.log("Supabase connected");

  const app = express();
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGINS,
      credentials: true,
    })
  );
  app.use(express.json());

  // Serve local uploads in dev (when not using Cloudinary)
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // API docs at /docs (OpenAPI 3 + Swagger UI)
  const specPath = path.join(process.cwd(), "openapi.json");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const spec = require(specPath);
  app.get("/api-docs.json", (_req, res) => res.json(spec));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec, { customSiteTitle: "Moksh API" }));

  app.use("/api", routes);

  app.use(errorHandler);

  app.listen(env.PORT, () => {
    console.log(`Server listening on port ${env.PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
