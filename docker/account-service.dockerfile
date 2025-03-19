FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY . .

RUN npm ci --loglevel verbose
RUN npm run build -- --all

FROM node:22-alpine AS release

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/apps/account/package.json ./apps/account/
COPY --from=build /usr/src/app/libs ./libs
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/package-lock.json ./

COPY --from=build /usr/src/app/dist/apps/account ./dist/apps/account
COPY --from=build /usr/src/app/dist/libs/ ./dist/libs/

COPY apps/account/.env ./

RUN npm ci --omit=dev && npm cache clean --force

CMD ["node", "dist/apps/account/main"]