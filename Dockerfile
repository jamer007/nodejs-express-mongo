FROM node:10-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

ADD .env.production ./

ADD package.json .
ADD package-lock.json .
ADD .env.production .env
RUN npm install --production

ADD src ./src
ADD index.js .

EXPOSE 8080
CMD [ "node", "index" ]
