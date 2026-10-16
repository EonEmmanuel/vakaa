# ==========================================
# Stage 1: Build Vendure Server, Worker & Dashboard
# ==========================================
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy monorepo root manifest and server package manifest
COPY package.json bun.lock ./
COPY apps/server/package.json ./apps/server/

# Install all dependencies (cached if manifests don't change)
RUN bun install --frozen-lockfile

# Copy server source code and assets
COPY apps/server ./apps/server

# Build Dashboard (Vite), Server, and Worker (TypeScript)
WORKDIR /app/apps/server
RUN bun run build

# Prune devDependencies to keep the production layer minimal
WORKDIR /app
RUN bun install --production --frozen-lockfile

# ==========================================
# Stage 2: Production Lightweight Runner (Node 22 Alpine)
# ==========================================
FROM node:22-alpine AS runner

# Install dumb-init for proper PID 1 signal forwarding and curl for healthchecks
RUN apk add --no-cache dumb-init curl

WORKDIR /app/apps/server
ENV NODE_ENV=production
ENV PORT=3000

# Copy node_modules from builder
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/server/node_modules /app/apps/server/node_modules

# Copy package manifests
COPY --from=builder /app/package.json /app/bun.lock /app/
COPY --from=builder /app/apps/server/package.json /app/apps/server/

# Copy compiled files, static templates & catalog assets
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/static ./static
COPY --from=builder /app/apps/server/src/vakaa-products.csv ./dist/vakaa-products.csv

# Ensure correct permissions for the non-root node user
RUN chown -R node:node /app

USER node

EXPOSE 3000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/index.js"]
