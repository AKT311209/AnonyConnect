
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only package files first to leverage Docker cache
COPY package.json package-lock.json* ./

# Install dependencies (do not copy node_modules from host)
RUN npm install --production

# Copy the rest of the application, but do not overwrite node_modules
COPY . .

# Copy the config.json file into the image
RUN mkdir -p /app/storage
COPY storage/config.json /app/storage/config.json

# Expose Next.js default port
EXPOSE 3000

# Build Next.js app
RUN npm run build

# Start the Next.js app
RUN ls /app/storage
CMD ["npm", "start"]
