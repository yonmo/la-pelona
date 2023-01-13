FROM node:latest
WORKDIR /app/
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 443
CMD ["node", "./dist/la-pelona.js"]