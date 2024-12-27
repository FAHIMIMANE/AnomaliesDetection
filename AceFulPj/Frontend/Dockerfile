# Stage 1: Build React App
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
COPY default.conf /etc/nginx/conf.d/default.conf

RUN npm run build

# Stage 2: Serve React App with NGINX
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
