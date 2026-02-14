-- Run this in Supabase Dashboard → SQL Editor (once)
-- Creates all tables needed by the Moksh backend

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Admin
CREATE TABLE IF NOT EXISTS "Admin" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "email" TEXT NOT NULL,
  "password_hash" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Admin_email_key" ON "Admin"("email");

-- Category
CREATE TABLE IF NOT EXISTS "Category" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug");

-- Product
CREATE TABLE IF NOT EXISTS "Product" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "price" DOUBLE PRECISION,
  "category_id" TEXT NOT NULL,
  "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "whatsapp_number" TEXT,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "Product_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Media
CREATE TABLE IF NOT EXISTS "Media" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "url" TEXT NOT NULL,
  "public_id" TEXT,
  "filename" TEXT NOT NULL,
  "mime_type" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "uploaded_by_id" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "Media_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Media_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Settings
CREATE TABLE IF NOT EXISTS "Settings" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "default_whatsapp_number" TEXT NOT NULL DEFAULT '',
  "whatsapp_message_template" TEXT NOT NULL DEFAULT 'Hi, I''m interested in {productName}',
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- Lead
CREATE TABLE IF NOT EXISTS "Lead" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "product_id" TEXT,
  "clicked_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "metadata" JSONB,
  CONSTRAINT "Lead_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Lead_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tell PostgREST to reload its schema cache so the tables are visible via API
NOTIFY pgrst, 'reload schema';
