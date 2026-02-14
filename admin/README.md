# Moksh Admin (app.moksh.com)

Next.js 15 admin panel for the Moksh catalogue. Deep maroon/red theme, sidebar layout.

## Setup

1. Create `.env.local` with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```
   (Use your API URL in production.)

2. Install and run:
   ```bash
   npm install
   npm run dev
   ```

3. Open http://localhost:3001 (or 3000). Log in with the admin account you created via the backend seed.

## Features

- **Dashboard** – Total products, categories, leads, recent activity
- **Products** – List, add, edit, delete, toggle visibility; search and filter
- **Categories** – Add, edit, delete
- **Media** – Upload images; copy URL to use in products
- **Settings** – Default WhatsApp number and message template (`{productName}`)
