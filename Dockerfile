FROM node:22-alpine AS builder

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.2.1 --activate

WORKDIR /app

# Copy the entire monorepo
COPY . .

# Install dependencies (ignoring scripts to speed up)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Build the SMTP app
# We filter by the package name found in apps/smtp/package.json which is "saleor-app-smtp"
RUN pnpm turbo run build --filter=saleor-app-smtp

# --- Runner Stage ---
FROM node:22-alpine AS runner

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.2.1 --activate

# Copy necessary files from builder
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/smtp ./apps/smtp
COPY --from=builder /app/packages ./packages

# Set working directory to the app
WORKDIR /app/apps/smtp

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["pnpm", "start"]
