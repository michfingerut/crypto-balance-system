FROM node:18

WORKDIR /usr/src/app

RUN npm install -g nodemon

COPY ../../package*.json ./

RUN npm install

COPY . .

RUN mkdir -p ./dist/apps/data && \
    if [ ! -f ./dist/apps/data/balanceData.json ]; then \
      echo '{"balance": 0}' > ./dist/apps/data/balanceData.json; \
    fi

EXPOSE 3001

CMD ["npm", "run", "start:dev"]
