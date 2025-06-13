#!/bin/sh
# Copy default config if config.json does not exist in storage
if [ ! -f /app/storage/config.json ]; then
  cp /app/config.default.json /app/storage/config.json
fi
exec "$@"
