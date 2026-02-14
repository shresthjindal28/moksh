# Deploying Moksh

You have **three** parts:

| App         | Tech                         | Where to deploy |
|------------|------------------------------|-----------------|
| **Backend** | Express + Supabase (Postgres) | **Render**      |
| **Main site** | Next.js 16                 | **Vercel**      |
| **Admin**   | Next.js 15                   | **Vercel**      |

Deploy **backend first**, then point the frontends at its URL.

---

## 0. Create the database tables (Supabase – one time)

1. Open your **Supabase Dashboard** → your project → **SQL Editor**.
2. Paste the contents of `backend/scripts/create-tables.sql` and click **Run**.
3. This creates: `Admin`, `Category`, `Product`, `Media`, `Settings`, `Lead`.
4. Go to **Project Settings → API** and copy:
   - **Project URL** (e.g. `https://xxxx.supabase.co`) → this is `SUPABASE_URL`
   - **service_role** key (under "Project API keys") → this is `SUPABASE_SERVICE_ROLE_KEY`

---

## 1. Backend (Render)

### Build command

Set this in the Render dashboard → your service → **Settings** → **Build & Deploy** → **Build Command**:

```
npm install && npm run build
```

(Do **not** include `npx prisma generate`; the project no longer uses Prisma.)

### Environment variables (Render)

| Variable | Example | Required |
|----------|---------|----------|
| `SUPABASE_URL` | `https://xxxx.supabase.co` | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase Dashboard → Settings → API | Yes |
| `JWT_SECRET` | Long random string (e.g. `openssl rand -base64 32`) | Yes |
| `CORS_ORIGINS` | `https://your-main-site.vercel.app,https://your-admin.vercel.app` | Yes |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | No |
| `CLOUDINARY_API_KEY` | Your Cloudinary key | No |
| `CLOUDINARY_API_SECRET` | Your Cloudinary secret | No |

### Deploy

1. Push your code to GitHub.
2. In Render, create a **Web Service** from the repo (or use the existing one).
3. Set **Root Directory** to `backend`.
4. Set the **Build Command** and **Environment Variables** above.
5. Deploy. Your API URL is e.g. `https://moksh-backend.onrender.com`.

---

## 2. Main site (Vercel)

1. Go to **https://vercel.com**, sign in, **Add New Project**, import your repo.
2. Set **Root Directory** to `main-site`.
3. **Environment variable**: `NEXT_PUBLIC_API_URL` = `https://moksh-backend.onrender.com`
4. Deploy. Copy the URL (e.g. `https://your-main-site.vercel.app`).

---

## 3. Admin (Vercel)

1. **Add New Project** in Vercel, import same repo.
2. Set **Root Directory** to `admin`.
3. **Environment variable**: `NEXT_PUBLIC_API_URL` = `https://moksh-backend.onrender.com`
4. Deploy. Copy the URL (e.g. `https://your-admin.vercel.app`).

---

## 4. Update CORS on Render

After both Vercel deploys, go back to **Render** → your backend → **Environment**:

Set `CORS_ORIGINS` = `https://your-main-site.vercel.app,https://your-admin.vercel.app`

Save. Render will redeploy automatically.

---

## 5. Seed data (one time, from your laptop)

From the `backend` folder:

```bash
# Seed admin user
SUPABASE_URL="https://xxxx.supabase.co" SUPABASE_SERVICE_ROLE_KEY="..." npm run seed

# Seed 3 categories (Kurti, Bedsheet, Jewellery)
SUPABASE_URL="https://xxxx.supabase.co" SUPABASE_SERVICE_ROLE_KEY="..." npm run seed:categories
```

(Or set these in your local `.env` and just run `npm run seed` / `npm run seed:categories`.)

---

## Quick checklist

- [ ] Tables created in Supabase (ran `create-tables.sql`).
- [ ] Render: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `CORS_ORIGINS` set.
- [ ] Render: Build command is `npm install && npm run build` (no Prisma).
- [ ] Backend URL noted (e.g. `https://moksh-backend.onrender.com`).
- [ ] Main site on Vercel: root = `main-site`, `NEXT_PUBLIC_API_URL` = backend URL.
- [ ] Admin on Vercel: root = `admin`, `NEXT_PUBLIC_API_URL` = backend URL.
- [ ] `CORS_ORIGINS` on Render includes both Vercel URLs.
- [ ] Seeded admin user and categories.
