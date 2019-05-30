FROM node:12

WORKDIR /app

COPY package* /app/

RUN npm i

COPY next.config.js /app/next.config.js
COPY src /app/src
COPY pages /app/pages
COPY components /app/components

RUN npm run lint && npm run build

ENTRYPOINT npm run start