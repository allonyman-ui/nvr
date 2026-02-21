FROM node:22-alpine
WORKDIR /app
COPY package.json .
RUN npm install --production --no-fund --no-audit
COPY server.js .
EXPOSE 3001
CMD ["node", "server.js"]
