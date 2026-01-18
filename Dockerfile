FROM node:22-alpine

RUN corepack enable

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages

# Install dependencies
RUN pnpm install --frozen-lockfile

# Go to Stripe app
WORKDIR /app/apps/stripe

# FORCE Next.js production build (bypass turbo)
RUN pnpm exec next build

# Expose Next.js port
EXPOSE 8080

# Start production server
CMD ["pnpm", "exec", "next", "start", "-p", "8080"]
