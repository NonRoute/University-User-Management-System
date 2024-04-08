FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy prisma schema and generate prisma client
COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

EXPOSE 8080

CMD ["npm","run", "start:prod"]