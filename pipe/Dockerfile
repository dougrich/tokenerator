FROM node:12

WORKDIR /app

COPY package* /app/

RUN npm i

COPY src /app/src

ENTRYPOINT npm start