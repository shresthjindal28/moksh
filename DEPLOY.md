# Deploying Moksh

You have **three** parts:

| App        | Tech           | Where to deploy |
|-----------|----------------|------------------|
| **Backend** | Express + Supabase (Postgres) | **Render** |
| **Main site** | Next.js 16     | **Vercel**       |
| **Admin**    | Next.js 15     | **Vercel**       |

Deploy **backend first**, then point the frontends at its URL.

---

## 1. Backend + database (Render)

### Prerequisites

- A **Git** repo (GitHub, GitLab, or Bitbucket) with this project pushed.
- If you don’t have a repo yet:

  ```bash
  cd "/Users/shresthjindal/Desktop/untitled folder"
  git init
  git add .
  git commit -m "Initial commit"
  # Create a repo on GitHub/GitLab/Bitbucket, then:
  git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
  git push -u origin main
  ```

### Deploy

1. **Validate** (optional; needs [Render CLI](https://render.com/docs/cli)):

   ```bash
   render blueprints validate
   ```

2. **Commit and push** `render.yaml` if you haven’t already:

   ```bash
   git add render.yaml
   git commit -m "Add Render deployment"
   git push origin main
   ```

3. **Open the Blueprint** for this repo:

   **https://dashboard.render.com/blueprint/new?repo=https://github.com/shresthjindal28/moksh**

4. **Connect** your Git provider if asked and choose the repo.

5. **Set secret env vars** in the Render dashboard for `moksh-backend`:

   | Variable | Example | Required |
   |----------|---------|----------|
   | `SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` | Yes |
   | `SUPABASE_SERVICE_ROLE_KEY` | From Supabase Dashboard → Settings → API | Yes |
   | `JWT_SECRET` | Long random string (e.g. `openssl rand -base64 32`) | Yes |
   | `CORS_ORIGINS` | `https://your-main-site.vercel.app,https://your-admin.vercel.app` | Yes |
   | `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | No (optional) |
   | `CLOUDINARY_API_KEY` | Your Cloudinary key | No |
   | `CLOUDINARY_API_SECRET` | Your Cloudinary secret | No |

   The backend uses **Supabase** as the database (no Prisma). Your Postgres tables must already exist in Supabase (e.g. from an earlier Prisma migrate, or create them to match the schema).

6. **Apply** the Blueprint. Render will create the `moksh-backend` web service (no Render DB needed if you use Supabase).

7. **Note the API URL** (e.g. `https://moksh-backend.onrender.com`). Use it in the next steps.

---

## 2. Main site (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. **Add New Project** → import the same repo.
3. Set **Root Directory** to `main site`.
4. **Environment variable** (Production and Preview):

   - `NEXT_PUBLIC_API_URL` = your Render API URL (e.g. `https://moksh-backend.onrender.com`)

5. Deploy. After deploy, add this main site URL to the backend’s `CORS_ORIGINS` on Render (e.g. `https://your-project.vercel.app`).

---

## 3. Admin (Vercel)

1. **Add another project** in Vercel for the same repo (or a separate repo if admin lives elsewhere).
2. Set **Root Directory** to `admin`.
3. **Environment variable**:

   - `NEXT_PUBLIC_API_URL` = same Render API URL (e.g. `https://moksh-backend.onrender.com`)

4. Deploy. Add the admin URL to `CORS_ORIGINS` on Render as well.

---

## Quick checklist

- [ ] Repo created and code (including `render.yaml`) pushed.
- [ ] Render Blueprint applied; `JWT_SECRET` and `CORS_ORIGINS` set.
- [ ] Backend URL noted (e.g. `https://moksh-backend.onrender.com`).
- [ ] Main site on Vercel with `NEXT_PUBLIC_API_URL` = backend URL; root = `main site`.
- [ ] Admin on Vercel with `NEXT_PUBLIC_API_URL` = backend URL; root = `admin`.
- [ ] Both frontend URLs added to backend `CORS_ORIGINS` on Render.

---

## After first deploy

- **Seed admin user**: from the `backend` folder run  
  `SUPABASE_URL="https://YOUR_PROJECT.supabase.co" SUPABASE_SERVICE_ROLE_KEY="..." npm run seed`  
  (use your Supabase project URL and **service_role** key from Dashboard → Settings → API).
- **Seed the 3 default categories** (Kurti, Bedsheet, Jewellery):  
  `SUPABASE_URL="..." SUPABASE_SERVICE_ROLE_KEY="..." npm run seed:categories`  
  Safe to run multiple times.
- **Free tier**: Render free tier may spin down after inactivity; the first request can be slow until it wakes up.
