FROM node:12-alpine
WORKDIR /srv/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
#ENV NODE_ENV=production
CMD ["npm", "start"]
