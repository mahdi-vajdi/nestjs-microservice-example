FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# First copy package.json files (root level first)
COPY package.json package-lock.json ./
COPY apps/account/package.json ./apps/account/
COPY libs/common/package.json ./libs/common/
# Copy any other lib package.json files you need
# COPY libs/jwt-utils/package.json ./libs/jwt-utils/

# Copy config files
COPY tsconfig.json ./
COPY nest-cli.json ./

# Install dependencies at root level
RUN npm install --loglevel verbose

# Copy source code
COPY apps/account ./apps/account
COPY libs ./libs

# Build the application (use the correct name from nest-cli.json)
RUN npm run build -- account-service

FROM node:22-alpine AS release

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Copy production dependencies
COPY --from=builder /usr/src/app/dist/apps/account ./dist/apps/account
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/package-lock.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy env file if needed
COPY .env ./

CMD ["node", "dist/apps/account/main"]