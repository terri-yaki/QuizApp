FROM node:12.18.3

WORKDIR ./

COPY package*.json ./

ENV DB_URL "mongodb://mongo:27017/quizapp"
ENV QUIZAPI_TOKEN "IRkB794A9YeOFMlPbQHHi2Bi1SSfaOjp77P2yTnr"
ENV TWITTER_BEARER_TOKEN "AAAAAAAAAAAAAAAAAAAAAEJ1aAEAAAAA9yAQ9ubr2zGTWMwO9KLDj1ZFU5A%3DJOrpHboAvmOkGsM4t5mh40fcVJkvRDYBhE0eVSqSjNQV9WbZHD"

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "dev"]