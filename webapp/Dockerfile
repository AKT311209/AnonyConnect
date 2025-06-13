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

# Do NOT run next build here! Client will run next build with their own env vars at container startup

# Start the app using the entrypoint script
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "start"]
