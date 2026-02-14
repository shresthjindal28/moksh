# What to do now – step by step

Your backend is live at **https://moksh-backend.onrender.com**. Follow these steps in order.

---

## How to see / use the database (Render)

- **In the dashboard:** Go to **https://dashboard.render.com** → **Databases** → click your Postgres (e.g. **moksh-db**). You’ll see connection info, metrics, and a **Shell** tab to run SQL.
- **Connection string:** On that database page, use **Internal Database URL** (for other Render services) or **External Database URL** (for your laptop). Use this as `DATABASE_URL` when running seed scripts locally.
- **GUI client (optional):** Use [TablePlus](https://tableplus.com), [pgAdmin](https://www.pgadmin.org), or [DBeaver](https://dbeaver.io). Create a new Postgres connection and paste the **External** URL (with username/password from the URL). You can then browse tables (e.g. `Category`, `Product`, `Admin`).

---

## 1. Set backend environment variables (Render)

1. Go to **https://dashboard.render.com** and open your **moksh-backend** (or moksh-db) service.
2. Open **Environment** (or **Environment Variables**).
3. Add or confirm:
   - **JWT_SECRET** – a long random string (e.g. run `openssl rand -base64 32` in terminal and paste).
   - **CORS_ORIGINS** – leave empty for now; you’ll set it in step 4 after you have the Vercel URLs.

---

## 2. Deploy the main site on Vercel

1. Go to **https://vercel.com** and sign in (e.g. with GitHub).
2. Click **Add New** → **Project** and import your repo (e.g. `shresthjindal28/moksh`).
3. Set **Root Directory** to **`main site`** (click Edit, then choose the `main site` folder).
4. In **Environment Variables** add:
   - Name: `NEXT_PUBLIC_API_URL`  
   - Value: `https://moksh-backend.onrender.com`  
   (for both Production and Preview if asked.)
5. Click **Deploy**.
6. When it’s done, copy your main site URL (e.g. `https://your-main-site.vercel.app`). You’ll need it in step 4.

---

## 3. Deploy the admin on Vercel

1. In Vercel, click **Add New** → **Project** again and import the **same** repo.
2. Set **Root Directory** to **`admin`**.
3. In **Environment Variables** add:
   - Name: `NEXT_PUBLIC_API_URL`  
   - Value: `https://moksh-backend.onrender.com`
4. Click **Deploy**.
5. Copy your admin URL (e.g. `https://your-admin.vercel.app`). You’ll need it in step 4.

---

## 4. Add frontend URLs to backend CORS (Render)

1. Go back to **Render** → your **moksh-backend** service → **Environment**.
2. Set **CORS_ORIGINS** to your two Vercel URLs, comma-separated, no spaces:
   - Example: `https://your-main-site.vercel.app,https://your-admin.vercel.app`
3. Save. Render will redeploy the backend with the new env.

---

## 5. Seed the admin user (one time)

1. In **Render** → open your **Postgres** database (e.g. moksh-db) and copy the **Internal Database URL** (Connection string).
2. On your computer, open Terminal and go to the backend folder:
   ```bash
   cd "/Users/shresthjindal/Desktop/untitled folder/backend"
   ```
3. Run (replace `postgres://...` with the URL you copied):
   ```bash
   DATABASE_URL="postgres://user:password@host/dbname?sslmode=require" npm run seed
   ```
4. You should see something like: `Admin created: admin@moksh.com` (or the email you use). Use that email and the password you set (or default `admin123`) to log in to the admin site.

---

## 6. Seed the 3 categories (one time)

1. Using the **same** Render Postgres connection string as in step 5.
2. In the same `backend` folder, run:
   ```bash
   DATABASE_URL="postgres://user:password@host/dbname?sslmode=require" npm run seed:categories
   ```
3. You should see: `Category OK: kurti`, `Category OK: bedsheet`, `Category OK: jewellery`.

---

## 7. Test everything

1. Open your **main site** URL – products and categories should load from the backend.
2. Open your **admin** URL – log in with the seeded admin email/password.
3. In admin, add a product, assign a category, and check it appears on the main site.

---

## Quick checklist

- [ ] Render: `JWT_SECRET` and `CORS_ORIGINS` set (CORS after you have Vercel URLs).
- [ ] Vercel: Main site deployed, root = `main site`, `NEXT_PUBLIC_API_URL` = `https://moksh-backend.onrender.com`.
- [ ] Vercel: Admin deployed, root = `admin`, `NEXT_PUBLIC_API_URL` = `https://moksh-backend.onrender.com`.
- [ ] Render: `CORS_ORIGINS` = main site URL + admin URL (comma-separated).
- [ ] Seeded admin user with `npm run seed` and Render DB URL.
- [ ] Seeded categories with `npm run seed:categories` and Render DB URL.
- [ ] Logged in to admin and checked main site.

Done.
