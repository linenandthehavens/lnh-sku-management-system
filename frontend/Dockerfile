# Frontend Dockerfile for React Application
# Multi-stage build for smaller image size

# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Accept backend URL as build argument
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev deps needed for build)
RUN npm ci

# Copy source code
COPY . .

# Debug: Show what URL we're building with
RUN echo "=======================================" && \
    echo "🚀 Building Frontend" && \
    echo "=======================================" && \
    echo "VITE_API_URL: ${VITE_API_URL}" && \
    echo "======================================="

# Build for production (Vite reads VITE_API_URL from ENV)
RUN npm run build

# Debug: Verify backend URL is in bundle (not localhost)
RUN echo "=======================================" && \
    echo "🔍 Checking built bundle for URLs..." && \
    echo "=======================================" && \
    if grep -r "localhost:8080" dist/assets/*.js 2>/dev/null; then \
      echo "❌ WARNING: localhost:8080 found in bundle!"; \
    else \
      echo "✅ No localhost:8080 found (good!)"; \
    fi && \
    if grep -r "lnh-backend" dist/assets/*.js 2>/dev/null | head -1; then \
      echo "✅ Backend URL found in bundle!"; \
    else \
      echo "⚠️ Backend URL not found in bundle"; \
    fi && \
    echo "======================================="

# Stage 2: Production with Nginx
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Create non-root user for nginx
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx

# Expose port 8080 (Cloud Run requirement)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
