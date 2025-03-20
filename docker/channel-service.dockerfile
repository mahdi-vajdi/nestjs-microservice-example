FROM base-build AS release

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --from=base-build /usr/src/app/apps/channel/package.json ./apps/channel/
COPY --from=base-build /usr/src/app/libs ./libs
COPY --from=base-build /usr/src/app/package.json ./
COPY --from=base-build /usr/src/app/package-lock.json ./

COPY --from=base-build /usr/src/app/dist/apps/channel ./dist/apps/channel
COPY --from=base-build /usr/src/app/dist/libs/ ./dist/libs/

COPY apps/channel/.env ./

RUN npm ci --omit=dev && npm cache clean --force

CMD ["node", "dist/apps/channel/main"]