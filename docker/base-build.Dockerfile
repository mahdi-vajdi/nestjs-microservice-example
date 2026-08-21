FROM node:22-alpine AS base

WORKDIR /usr/src/app

COPY . .

RUN corepack enable && yarn install --immutable
RUN yarn build --all
