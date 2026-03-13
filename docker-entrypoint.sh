#!/bin/sh
set -e
# Run migrations and seed if DATABASE_URL is set (e.g. on Render)
if [ -n "$DATABASE_URL" ]; then
  echo "==> Running prisma db push..."
  node node_modules/prisma/build/index.js db push --accept-data-loss --skip-generate
  echo "==> Running prisma db seed..."
  node node_modules/prisma/build/index.js db seed || echo "Seed warning (may already exist)"
fi
exec node server.js
