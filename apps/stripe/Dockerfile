# ---- Base image ----
FROM node:22-alpine

# Enable pnpm
RUN corepack enable

# Set working directory
WORKDIR /app

# ---- Copy workspace root files ----
COPY ../../package.json ../../pnpm-lock.yaml ../../pnpm-workspace.yaml ./

# ---- Copy workspace packages ----
COPY ../../apps ./apps
COPY ../../packages ./packages

# ---- Install deps (frozen lockfile will now work) ----
RUN pnpm install --frozen-lockfile

# ---- Build Stripe app only ----
RUN pnpm --filter @saleor/stripe build

# ---- Start Stripe app ----
EXPOSE 3000
CMD ["pnpm", "--filter", "@saleor/stripe", "start"]
