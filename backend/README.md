# Moksh API (Backend)

Express + TypeScript + PostgreSQL (Prisma) backend for the Moksh catalogue and admin panel.

## Setup

1. Copy `.env.example` to `.env` and set:
   - `DATABASE_URL` – PostgreSQL connection string (e.g. `postgresql://postgres:YOUR_PASSWORD@localhost:5432/moksh`). If using Docker Postgres, use your container’s user and password.
   - `JWT_SECRET` – Secret for admin JWT tokens
   - Optionally `CLOUDINARY_URL` (or individual Cloudinary env vars) for image uploads. If unset, images are stored locally under `uploads/`.

2. Create the database (if not already created):
   ```bash
   docker exec -it lv-postgres psql -U postgres -c "CREATE DATABASE moksh;"
   ```
   Then run migrations:
   ```bash
   npx prisma migrate deploy
   ```

3. Install and run:
   ```bash
   npm install
   npm run dev
   ```

4. Seed the first admin (once):
   ```bash
   SEED_ADMIN_EMAIL=admin@moksh.com SEED_ADMIN_PASSWORD=admin123 npm run seed
   ```
   Or set `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_ADMIN_NAME` in `.env`.

## API base

- Base URL: `http://localhost:4000` (or your `PORT`)
- All API routes are under `/api`: `/api/auth`, `/api/products`, `/api/categories`, `/api/media`, `/api/settings`, `/api/dashboard`, `/api/leads`.

## Image uploads

- **With Cloudinary**: Set `CLOUDINARY_URL` or the three env vars. Uploads go to Cloudinary; URLs are returned.
- **Without Cloudinary**: Files are saved to `backend/uploads/<yyyy-mm>/`. Served at `/uploads/...` by the same server.
