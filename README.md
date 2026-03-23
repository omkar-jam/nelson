# Artist Portfolio (Next.js + Render)

Artist portfolio website with admin, built for deployment on Render with Neon Postgres and optional Cloudflare R2 storage.

## Stack

- **Next.js 14** (App Router)
- **Neon** (Postgres)
- **Prisma** (ORM)
- **NextAuth.js** (credentials, admin only)
- **Tailwind CSS**
- **Cloudflare R2** (optional, for image uploads)

## Setup

1. **Clone and install**

   ```bash
   npm install
   ```

2. **Database (Neon)**

   - Create a project at [neon.tech](https://neon.tech).
   - Copy the connection string. For serverless (e.g. Render), use the pooled connection string and set both:
     - `DATABASE_URL` — pooled (e.g. with `?pgbouncer=true` if your Neon pooler uses it).
     - `DIRECT_URL` — direct connection (for migrations).

3. **Environment**

   Copy `.env.example` to `.env` and set:

   - `DATABASE_URL` — Neon Postgres connection string (pooled).
   - `DIRECT_URL` — Neon direct connection string (for Prisma migrate).
   - `NEXTAUTH_SECRET` — e.g. `openssl rand -base64 32`.
   - `NEXTAUTH_URL` — `http://localhost:3000` (dev) or your production URL (e.g. Render).
   - Optional (for uploads): R2 vars as in `.env.example`.

4. **Migrations and seed**

   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

   Default admin user: `admin@example.com` / `changeme`. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` when running seed to override.

   **Blog posts** are loaded from `prisma/data/imported-posts.json` (43 posts from [nelson-ferreira.com](https://www.nelson-ferreira.com/essays-on-art), including embedded images via Wix CDN and YouTube iframes). To refresh that file from the live site (needs network):

   ```bash
   npm run import:blog
   npx prisma db seed
   ```

   Post-import display fixes (videos, Pro Gallery → image grid, Borobudur press-line layout, etc.) are applied at render time in `lib/blog-html.ts` and `lib/blog-patches.ts` — no re-import needed after pulling updates.

   If the database has **duplicate posts** with the same title (e.g. an empty row and a full import), run a dry run then apply:

   ```bash
   node scripts/dedupe-blog-posts-by-title.mjs
   node scripts/dedupe-blog-posts-by-title.mjs --apply
   ```

5. **Run**

   ```bash
   npm run dev
   ```

   - Site: [http://localhost:3000](http://localhost:3000)  
   - Admin: [http://localhost:3000/admin](http://localhost:3000/admin) (sign in with seeded user).

## Deploy on Render

1. New **Web Service**; connect your repo.
2. **Build command:** `npm ci && npx prisma generate && npx prisma migrate deploy && npm run build`
3. **Start command:** `npm start`
4. Set **Environment Variables** in the dashboard (or use `render.yaml`):
   - `DATABASE_URL`, `DIRECT_URL` (Neon)
   - `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (e.g. `https://your-service.onrender.com`)
   - R2 variables if using uploads

After first deploy, run the seed (e.g. locally with `DATABASE_URL` pointing at production, or via a one-off job) to create the admin user if needed.

## R2 (optional)

To enable image uploads from the admin:

1. Create an R2 bucket in Cloudflare and enable public access (or custom domain).
2. Create API tokens with R2 read/write.
3. Set in `.env` / Render:
   - `R2_ACCOUNT_ID`
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - `R2_BUCKET_NAME`
   - `R2_PUBLIC_URL` — base public URL of the bucket (e.g. `https://pub-xxx.r2.dev`).

If R2 is not set, admins can still add artworks by pasting an **Image URL** (e.g. from any host).
