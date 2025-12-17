FROM base-build AS release

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --from=base-build /usr/src/app/apps/gateway/package.json ./apps/gateway/
COPY --from=base-build /usr/src/app/libs ./libs
COPY --from=base-build /usr/src/app/package.json ./
COPY --from=base-build /usr/src/app/package-lock.json ./

COPY --from=base-build /usr/src/app/dist/apps/gateway ./dist/apps/gateway
COPY --from=base-build /usr/src/app/dist/libs/ ./dist/libs/

COPY apps/gateway/.env ./

RUN npm ci --omit=dev && npm cache clean --force

CMD ["node", "dist/apps/gateway/main"]
