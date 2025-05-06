# 基础镜像
FROM node:20-alpine AS base

# 设置工作目录
WORKDIR /app

# 安装依赖
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# 构建应用
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# 生产环境
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=4200

# 创建非root用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 确保数据库目录存在并有正确权限
RUN mkdir -p /app/data
RUN chown -R nextjs:nodejs /app/data

# 复制构建文件
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# 复制 Prisma 文件
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# 挂载数据卷
VOLUME ["/app/data"]

# 切换到非root用户
USER nextjs

# 暴露端口
EXPOSE 4200

# 启动应用
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
