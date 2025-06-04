# 使用 Node.js 镜像构建 React 应用
FROM node:18 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# 构建 React 应用（会读取 REACT_APP_BACKEND_URL）
RUN npm run build

# 使用 Nginx 服务器托管前端
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# 复制自定义 nginx 配置（可选）
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 9000
CMD ["nginx", "-g", "daemon off;"]
