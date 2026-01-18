FROM node:22-alpine

RUN corepack enable

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages

# Install deps
RUN pnpm install --frozen-lockfile

# Build Stripe app
RUN pnpm --filter "apps/stripe..." build

# Expose port
EXPOSE 3000

# Run Stripe app directly (NO pnpm, NO turbo)
CMD ["node", "apps/stripe/dist/index.js"]
