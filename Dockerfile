FROM node:12.16.3-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY config.json reg2pg.js ./

CMD node --inspect=0.0.0.0:9229 reg2pg.js
