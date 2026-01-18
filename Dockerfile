FROM node:22-alpine

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @saleor/stripe build

EXPOSE 3000
CMD ["pnpm", "--filter", "@saleor/stripe", "start"]
