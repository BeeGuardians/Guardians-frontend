# 1단계: 빌드
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY .env ./
RUN npm ci

COPY . .
RUN npm run build

# 2단계: 배포용
FROM nginx:1.25-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
