FROM node:22-alpine

# Enable pnpm via corepack
RUN corepack enable

# App root
WORKDIR /app

# Copy workspace root files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy monorepo packages
COPY apps ./apps
COPY packages ./packages

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build ONLY the Stripe app
RUN pnpm --filter @saleor/app-stripe build

# Expose app port
EXPOSE 3000

# Start ONLY the Stripe app (no turbo)
ENTRYPOINT ["pnpm", "--filter", "@saleor/app-stripe", "start"]
