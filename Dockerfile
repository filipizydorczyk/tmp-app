# build environment
FROM node:13.12.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

RUN apk update && apk upgrade
RUN apk add --no-cache git


COPY . ./
RUN npm ci --silent
RUN npm install react-scripts@5.0.0 -g --silent
RUN npm install @craco/craco@6.4.3 --silent
RUN npm run build

# production environment
FROM nginx:stable-alpine as production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]