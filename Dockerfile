FROM node:24-alpine

WORKDIR /app

COPY package.json app.js ./

USER node

EXPOSE 3000

CMD ["node", "app.js"]
