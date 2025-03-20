FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY . .

RUN npm ci --loglevel verbose
RUN npm run build -- --all