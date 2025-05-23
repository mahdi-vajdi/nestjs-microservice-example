FROM base-build AS release

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --from=base-build /usr/src/app/apps/project/package.json ./apps/project/
COPY --from=base-build /usr/src/app/libs ./libs
COPY --from=base-build /usr/src/app/package.json ./
COPY --from=base-build /usr/src/app/package-lock.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=base-build /usr/src/app/dist/apps/project ./dist/apps/project
COPY --from=base-build /usr/src/app/dist/libs/ ./dist/libs/

CMD ["node", "dist/apps/project/main"]