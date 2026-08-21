FROM base-build AS release

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --from=base-build /usr/src/app/apps/gateway/package.json ./apps/gateway/
COPY --from=base-build /usr/src/app/libs ./libs
COPY --from=base-build /usr/src/app/package.json ./
COPY --from=base-build /usr/src/app/yarn.lock ./
COPY --from=base-build /usr/src/app/.yarn ./.yarn

COPY --from=base-build /usr/src/app/dist/apps/gateway ./dist/apps/gateway
COPY --from=base-build /usr/src/app/dist/libs/ ./dist/libs/

COPY apps/gateway/.env ./

RUN corepack enable && yarn workspaces focus -A --production && yarn cache clean --all

CMD ["node", "dist/apps/gateway/main"]
