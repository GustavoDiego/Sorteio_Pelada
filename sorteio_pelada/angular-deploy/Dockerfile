FROM node:18-alpine as build

RUN npm install -g serve

WORKDIR /app

COPY . .

WORKDIR /app/angular-deploy

CMD ["serve", "-s", "browser", "-l", "8080"]
