FROM node:22-alpine

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/stripe

# Disable ESLint in production build
RUN pnpm exec next build --no-lint

EXPOSE 8080
CMD ["pnpm", "exec", "next", "start", "-p", "8080"]
