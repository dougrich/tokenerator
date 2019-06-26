FROM node:12

ENV NODE_ENV=production

WORKDIR /app

COPY package* /app/

RUN npm i

COPY src /app/src

ENTRYPOINT node ./src/index.js