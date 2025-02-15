FROM node:22

ENV SERVER_PORT=${SERVER_PORT} 
ENV RATE_REFRESH_INTERVAL=${RATE_REFRESH_INTERVAL}

WORKDIR /usr/src/app

RUN npm install -g nodemon

COPY ./package*.json ./

RUN npm install

COPY . .

EXPOSE 3002

CMD ["npm", "run", "start:dev"]
