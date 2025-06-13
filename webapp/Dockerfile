FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only package files first to leverage Docker cache
COPY package.json package-lock.json* ./

# Install dependencies (do not copy node_modules from host)
RUN npm install --production

# Copy the rest of the application, but do not overwrite node_modules
COPY . .

# Copy the default config file to the app root (not inside storage)
COPY storage/config.json /app/config.default.json

# Copy entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Expose Next.js default port
EXPOSE 3000

# Accept build-time public env vars
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_BASE_URL=https://connect.khoi.io.vn
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAA-RcQdPu6mWgu-p

# Build Next.js app
RUN npm run build

# Start the app using the entrypoint script
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "start"]
