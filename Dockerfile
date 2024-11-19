FROM node:18.16 as base

WORKDIR /app

COPY ./package.json /app/
RUN npm install

RUN apt-get -y update 
RUN chmod -R 777 /app/node_modules
COPY ./ /app