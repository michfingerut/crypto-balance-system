FROM node:18

WORKDIR /usr/src/app

RUN npm install -g nodemon

COPY ../../package*.json ./

RUN npm install

COPY . .

EXPOSE 3002

CMD ["npm", "run", "start:dev"]
