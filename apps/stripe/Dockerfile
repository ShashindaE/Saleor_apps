FROM node:20-slim

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# System deps
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy entire monorepo
COPY . .

# Install workspace dependencies
RUN pnpm install --frozen-lockfile

# Build only Stripe app
RUN pnpm --filter @saleor/app-stripe build

EXPOSE 3000

# Start Stripe app
CMD ["pnpm", "--filter", "@saleor/app-stripe", "start"]
