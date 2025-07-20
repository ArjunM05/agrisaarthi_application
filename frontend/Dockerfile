# Use Node.js 18 Alpine as base image for smaller size
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Set build-time environment variables (you can override these during build)
ARG VITE_SUPABASE_URL=""
ARG VITE_SUPABASE_ANON_KEY=""
ARG VITE_OPENWEATHER_API_KEY=""
#ARG VITE_BACKEND_URL="https://agrosaarthi-backend-ws-18-8000.ml.iit-ropar.truefoundry.cloud"

# Set environment variables for the build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_OPENWEATHER_API_KEY=$VITE_OPENWEATHER_API_KEY
#ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create a script to inject environment variables at runtime
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'set -e' >> /docker-entrypoint.sh && \
    echo 'if [ -n "$VITE_SUPABASE_URL" ] && [ -n "$VITE_SUPABASE_ANON_KEY" ]; then' >> /docker-entrypoint.sh && \
    echo '  echo "window.ENV = { VITE_SUPABASE_URL: \"$VITE_SUPABASE_URL\", VITE_SUPABASE_ANON_KEY: \"$VITE_SUPABASE_ANON_KEY\", VITE_OPENWEATHER_API_KEY: \"$VITE_OPENWEATHER_API_KEY\" };" > /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.sh && \
    echo 'fi' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Start the entrypoint script
CMD ["/docker-entrypoint.sh"] 
