FROM node:22-alpine AS base

WORKDIR /usr/src/app

COPY . .

RUN npm ci
RUN npm run build -- --all