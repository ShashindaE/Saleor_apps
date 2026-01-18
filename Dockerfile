FROM node:22-alpine

RUN corepack enable

WORKDIR /app

# Copy workspace root files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy workspace packages
COPY apps ./apps
COPY packages ./packages

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build only Stripe app
RUN pnpm --filter @saleor/stripe build

# Start Stripe app
EXPOSE 3000
CMD ["pnpm", "--filter", "@saleor/stripe", "start"]
