FROM node:20-alpine AS build
WORKDIR /app
COPY FlliBruttiFrontend/package*.json ./
RUN npm ci
COPY FlliBruttiFrontend/ ./
RUN npm run build

# serve con Nginx
FROM nginx:1.27-alpine
# Copia la build nella web root di nginx
COPY --from=build /app/dist/ /usr/share/nginx/html
# Config nginx (SPA + reverse proxy)
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
