-- Add categories: kurti, bedsheet, jewellery
-- "order" is quoted because it's a reserved word in PostgreSQL
INSERT INTO "Category" (id, name, slug, description, "order", created_at, updated_at)
VALUES
  ('cl19dcbfb61dcec4979da03122', 'Kurti', 'kurti', NULL, 0, NOW(), NOW()),
  ('cl9c3dec775bb138eaeaaaf9cb', 'Bedsheet', 'bedsheet', NULL, 1, NOW(), NOW()),
  ('cl83e5e8aaade049c8c35c8dcf', 'Jewellery', 'jewellery', NULL, 2, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;
