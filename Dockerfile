FROM node:18.17.0-alpine3.17 AS base

FROM --platform=$BUILDPLATFORM base AS dev-deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --link package.json yarn.lock .yarnrc.yml ./
COPY --link .yarn .yarn
RUN yarn --frozen-lockfile

FROM --platform=$BUILDPLATFORM base AS builder
WORKDIR /app
COPY --from=dev-deps --link /app/node_modules ./node_modules
COPY --link src src
COPY --link .swcrc ./
COPY --link package.json ./
RUN yarn build

FROM base AS prod-deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --link package.json yarn.lock .yarnrc.yml ./
COPY --link .yarn .yarn
RUN yarn workspaces focus --production

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 65536 -S nodejs && adduser -S nodejs -u 1035

COPY --link --chown=1035:65536 package.json ./
COPY --from=prod-deps --link --chown=1035:65536 /app/node_modules ./node_modules
COPY --from=builder --link --chown=1035:65536 /app/dist ./dist

USER nodejs

CMD ["node", "./dist/index.js"]