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

# Build ONLY the Stripe app
RUN pnpm --filter "apps/stripe..." build

# Expose Next.js port
EXPOSE 3000

# Start Stripe app using Next.js
WORKDIR /app/apps/stripe
CMD ["pnpm", "start"]
