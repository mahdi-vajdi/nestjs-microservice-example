FROM admin-base AS release

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --from=admin-base /usr/src/app/apps/auth/package.json ./apps/auth/
COPY --from=admin-base /usr/src/app/libs ./libs
COPY --from=admin-base /usr/src/app/package.json ./
COPY --from=admin-base /usr/src/app/package-lock.json ./

COPY --from=admin-base /usr/src/app/dist/apps/auth ./dist/apps/auth
COPY --from=admin-base /usr/src/app/dist/libs/ ./dist/libs/

COPY apps/auth/.env ./

RUN npm ci --omit=dev && npm cache clean --force

CMD ["node", "dist/apps/auth/main"]