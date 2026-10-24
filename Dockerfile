# Stage 1: Build the React SPA
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (cached if package manifests are unchanged)
COPY package.json package-lock.json* bun.lock* ./
RUN npm install

# Copy source code and assets
COPY . .

# Build production bundle
RUN npm run build

# Stage 2: Serve with lightweight Nginx
FROM nginx:alpine

# Remove default nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
