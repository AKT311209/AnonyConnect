#!/bin/sh
# Copy default config if config.json does not exist in storage
if [ ! -f /app/storage/config.json ]; then
  cp /app/config.default.json /app/storage/config.json
fi

# If .next does not exist, run next build with current env vars
if [ ! -d ".next" ]; then
  echo "No .next directory found, running next build with current env vars..."
  npm run build
fi

exec "$@"
