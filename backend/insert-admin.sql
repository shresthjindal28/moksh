-- Run this directly in your database (e.g. psql or any SQL client).
-- Admin: admin@moksh.com / Admin@1234

-- If the user already exists, update password; otherwise insert.
INSERT INTO "Admin" (id, email, password_hash, name, created_at, updated_at)
VALUES (
  'cl363c84f76836277914f554fb',
  'admin@moksh.com',
  '$2a$12$a0z7VE952yfauz5t25MDYOr2LqYpPo87fIFr8S138oAu4oZx7KGWK',
  'Admin',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  updated_at = NOW();
