# Deploy to Render with Blueprint

This repo includes a **Render Blueprint** so you can deploy the app and database in one go.

## What gets created

- **PostgreSQL database** (`nelson-db`) — free tier
- **Web service** (`nelson`) — runs the Next.js app from the Dockerfile, free tier

The app runs **Prisma `db push`** and **seed** on every container start, so the DB schema and admin user are created/updated automatically.

## Steps

1. **Push the repo** to GitHub or GitLab (must contain `render.yaml`, `Dockerfile`, and the app code).

2. **In Render:** [Dashboard](https://dashboard.render.com) → **New** → **Blueprint**.

3. **Connect** the repository; Render will detect `render.yaml` and show the database + web service.

4. **Apply** the Blueprint. Render will:
   - Create the Postgres database
   - Build the Docker image (from `Dockerfile`)
   - Deploy the web service with `DATABASE_URL` / `DIRECT_URL` set from the database

5. **After the first deploy:**  
   In the **web service** → **Environment**, set:
   - **NEXTAUTH_URL** = your live URL, e.g. `https://nelson-xxxx.onrender.com`  
   (Render will prompt for this if you left it as `sync: false`.)

6. **Admin login:**  
   Go to `https://your-app.onrender.com/admin`  
   Default: **admin@example.com** / **changeme**.  
   To change, add env vars **ADMIN_EMAIL** and **ADMIN_PASSWORD** and redeploy (seed will update the user).

## Optional: file uploads (R2 / S3)

If you use the admin to upload artwork, set your **Cloudflare R2** (or S3) env vars in the web service:

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_PUBLIC_URL`

Without these, the app still runs; uploads in admin will fail until storage is configured.
