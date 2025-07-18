# Multi-stage Dockerfile for Nest.js backend

# Development stage
FROM node:18-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build shared package first
RUN npm run build --workspace=@monorepo/shared

# Expose port
EXPOSE 3001

# Start development server
CMD ["npm", "run", "dev", "--workspace=@monorepo/backend"]

# Production build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/
COPY packages/shared/package*.json ./packages/shared/

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build shared package first
RUN npm run build --workspace=@monorepo/shared

# Build backend application
RUN npm run build --workspace=@monorepo/backend

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copy package files
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/
COPY packages/shared/package*.json ./packages/shared/

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from build stage
COPY --from=build --chown=nestjs:nodejs /app/packages/backend/dist ./packages/backend/dist
COPY --from=build --chown=nestjs:nodejs /app/packages/shared/dist ./packages/shared/dist

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node packages/backend/dist/src/health-check.js || exit 1

# Start production server
CMD ["npm", "run", "start:prod", "--workspace=@monorepo/backend"]