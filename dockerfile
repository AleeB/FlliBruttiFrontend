FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY src/ ./src/
COPY public/ ./public/
COPY angular.json tsconfig.json tsconfig.app.json ./
RUN npm run build

# serve con Nginx
FROM nginx:1.27-alpine
COPY --from=build /app/dist/FE/browser/ /usr/share/nginx/html/
COPY nginx/default.prod.conf /etc/nginx/conf.d/default.conf