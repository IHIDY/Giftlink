# 使用 Node.js 官方镜像
FROM node:18

# 创建工作目录
WORKDIR /app

# 复制 package.json 并安装依赖
COPY package*.json ./
RUN npm install

# 复制项目代码
COPY . .

# 设置默认端口
EXPOSE 3060

# 启动后端应用
CMD ["npm", "start"]
