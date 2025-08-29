# Build stage
FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps
RUN npm install ajv@^8 ajv-keywords@^5 --legacy-peer-deps

COPY . .

# Default to .env, but allow overriding with ARG
ARG ENV_FILE=.env
RUN cp $ENV_FILE .env

RUN npm run build

# Serve stage (using Nginx)
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Add custom nginx config for React Router support
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
