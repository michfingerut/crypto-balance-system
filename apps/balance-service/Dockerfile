FROM node:22

ENV SERVER_PORT=${SERVER_PORT} 
ENV RATE_SERVER_URL=${RATE_SERVER_URL}

WORKDIR /usr/src/app

RUN npm install -g nodemon

COPY ./package*.json ./

RUN npm install 

COPY . .

RUN mkdir -p ./dist/data && \
    if [ ! -f ./dist/data/balanceData.json ]; then \
      echo '[]' > ./dist/data/balanceData.json; \
    fi

EXPOSE 3001

CMD ["npm", "run", "start:dev"]
