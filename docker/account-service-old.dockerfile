FROM node:22-alpine AS development

WORKDIR /usr/src/app

COPY apps/account/package.json ./
COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

COPY apps/account apps/account
COPY libs libs

RUN npm install --loglevel verbose
RUN cd libs/common npm install --loglevel verbose

RUN npm run build -- account-service

FROM node:22-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY apps/account/package.json ./
COPY package*.json ./
COPY .env ./

RUN npm install --omit=dev --loglevel verbose

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/account/main"]