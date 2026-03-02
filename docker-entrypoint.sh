#!/bin/sh
set -e
# Run migrations and seed if DATABASE_URL is set (e.g. on Render)
if [ -n "$DATABASE_URL" ]; then
  npx prisma db push --accept-data-loss 2>/dev/null || true
  npx prisma db seed 2>/dev/null || true
fi
exec node server.js
