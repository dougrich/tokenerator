FROM node:12

WORKDIR /app

COPY package* /app/

RUN npm i

COPY next.config.js /app/next.config.js
COPY src /app/src
COPY pages /app/pages
COPY components /app/components
COPY static /app/static

RUN npm run lint && npm run build

FROM node:12-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package* /app/

RUN npm i
COPY --from=0 /app/.next /app/.next
COPY src/server.js /app/src/server.js

ENTRYPOINT npm run start