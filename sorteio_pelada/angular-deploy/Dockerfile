FROM node:18-alpine as build

RUN npm install -g serve

WORKDIR /app

COPY . .

CMD ["serve", "-s", ".", "-l", "8080"]
