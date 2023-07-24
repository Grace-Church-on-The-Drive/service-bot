FROM node:18.17.0 AS base

FROM --platform=$BUILDPLATFORM base AS dev-deps
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
WORKDIR /app
COPY --link package.json yarn.lock .yarnrc.yml ./
COPY --link .yarn .yarn
RUN yarn workspaces focus --production

FROM ghcr.io/puppeteer/puppeteer:20.9.0 AS runner
WORKDIR /app
USER root

ENV NODE_ENV production

RUN groupadd --gid 65536 -r nodejs && useradd -rm -g nodejs --uid 1035 nodejs

COPY --link --chown=1035:65536 package.json ./
COPY --from=prod-deps --link --chown=1035:65536 /app/node_modules ./node_modules
COPY --from=builder --link --chown=1035:65536 /app/dist ./dist
RUN ln -s /home/pptruser/.cache /home/nodejs/.cache
RUN ln -s /home/pptruser/node_modules /home/nodejs/node_modules
RUN mkdir screenshots

USER nodejs

EXPOSE 3000

CMD ["node", "./dist/index.js"]