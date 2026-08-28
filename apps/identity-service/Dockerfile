# ─── Stage 1: Builder ────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY . .

RUN corepack enable && yarn install --immutable
RUN yarn build identity-service

# ─── Stage 2: Production release ─────────────────────────────────────────────
FROM node:22-alpine AS release

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Copy only the files needed to install production dependencies
COPY --from=builder /usr/src/app/apps/identity-service/package.json ./apps/identity-service/
COPY --from=builder /usr/src/app/libs ./libs
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/yarn.lock ./
COPY --from=builder /usr/src/app/.yarn ./.yarn
COPY --from=builder /usr/src/app/.yarnrc.yml ./

# Copy compiled output
COPY --from=builder /usr/src/app/dist/apps/identity-service ./dist/apps/identity-service
COPY --from=builder /usr/src/app/dist/libs ./dist/libs

# Install production dependencies only, then clean cache
RUN corepack enable && yarn workspaces focus -A --production && yarn cache clean --all

CMD ["node", "dist/apps/identity-service/main"]
