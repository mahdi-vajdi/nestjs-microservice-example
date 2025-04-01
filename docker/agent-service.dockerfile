FROM base-build AS release

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --from=base-build /usr/src/app/apps/user/package.json ./apps/user/
COPY --from=base-build /usr/src/app/libs ./libs
COPY --from=base-build /usr/src/app/package.json ./
COPY --from=base-build /usr/src/app/package-lock.json ./

COPY --from=base-build /usr/src/app/dist/apps/user ./dist/apps/user
COPY --from=base-build /usr/src/app/dist/libs/ ./dist/libs/

COPY apps/user/.env ./

RUN npm ci --omit=dev && npm cache clean --force

CMD ["node", "dist/apps/user/main"]