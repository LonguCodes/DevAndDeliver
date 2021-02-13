FROM node:14.15-alpine

WORKDIR /app

COPY ./package.json ./package-lock.json ./tsconfig.json ./
RUN npm install

RUN mkdir ./src
COPY ./src ./src
RUN npm run build
CMD ["node", "./dist/index.js"]