FROM node:11

ENV NODE_ENV=production

WORKDIR /app

COPY package* /app/
COPY fonts/ /usr/share/fonts/roboto_sans

RUN npm i

COPY src /app/src

ENTRYPOINT node ./src/index.js