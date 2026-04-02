FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_GROQ_API_KEY=$REACT_APP_GROQ_API_KEY

RUN npm run build

FROM nginx:alpine

RUN apk add --no-cache nodejs npm

COPY --from=builder /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
