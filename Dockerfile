FROM node:22-alpine

RUN corepack enable

WORKDIR /app

# Copy workspace root files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy monorepo sources
COPY apps ./apps
COPY packages ./packages

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build Stripe app (workspace path filter)
RUN pnpm --filter apps/stripe build

EXPOSE 3000

# Start Stripe app (workspace path filter)
ENTRYPOINT ["pnpm", "--filter", "apps/stripe", "start"]
