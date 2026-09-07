# 拾遗学舍部署说明

## 服务器要求

- Node.js 20 或更高版本
- npm
- Git
- 可用端口 3001

## 首次部署

```bash
git clone https://github.com/shuzhishuyuan/classics.git
cd classics
npm ci
cp .env.example .env
```

编辑 `.env`，至少设置：

```env
DB_TYPE=sqlite
JWT_SECRET=请替换为随机长字符串
PORT=3001
NODE_ENV=production
CORS_ORIGIN=
```

构建并启动：

```bash
npm run build
npm run start
```

浏览器访问 `http://服务器IP:3001/`。

## 使用 PM2 长期运行

```bash
npm install -g pm2
mkdir -p server/logs
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

执行 `pm2 startup` 后，按终端输出的命令完成开机自启配置。

常用命令：

```bash
pm2 status
pm2 logs shuyuan
pm2 restart shuyuan
```

## 发布更新

```bash
git pull --ff-only
npm ci
npm run build
pm2 restart shuyuan
```

## 数据备份

SQLite 数据库和用户上传文件位于：

```text
server/data/shuyuan.db
server/data/uploads/
```

请定期备份整个 `server/data/` 目录。该目录不会提交到 Git。

## 注意事项

- 不要将 `.env`、数据库、上传文件或日志提交到 Git。
- 生产环境必须更换 `JWT_SECRET`。
- 同源部署时保持 `CORS_ORIGIN=` 为空即可。
- `public/logo.png` 会随 Git 一起部署。