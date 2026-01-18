FROM node:22-alpine

# Enable pnpm
RUN corepack enable

WORKDIR /app

# ---- Build-time envs (REQUIRED) ----
ARG SECRET_KEY
ARG DYNAMODB_MAIN_TABLE_NAME
ARG AWS_REGION
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

ENV SECRET_KEY=$SECRET_KEY
ENV DYNAMODB_MAIN_TABLE_NAME=$DYNAMODB_MAIN_TABLE_NAME
ENV AWS_REGION=$AWS_REGION
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY

ENV NODE_ENV=production
ENV PORT=8080

# ---- Copy workspace ----
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages

# ---- Install deps ----
RUN pnpm install --frozen-lockfile

# ---- Build Stripe app ONLY ----
WORKDIR /app/apps/stripe
RUN pnpm exec next build --no-lint

EXPOSE 8080

CMD ["pnpm", "start"]
