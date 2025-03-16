FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
COPY apps/account/package.json ./apps/account/
COPY libs/common/package*.json ./libs/common/
COPY tsconfig.json nest-cli.json ./

RUN npm ci --loglevel verbose

COPY apps/account ./apps/account
COPY libs ./libs

RUN npm run build -- account-service

FROM node:22-alpine AS release

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Copy production dependencies
COPY --from=build /usr/src/app/dist/apps/account ./dist/apps/account
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/package-lock.json ./

RUN npm ci --only=production && npm cache clean --force

COPY apps/account/.env ./

CMD ["node", "dist/apps/account/main"]