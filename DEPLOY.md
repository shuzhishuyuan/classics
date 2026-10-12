# 拾遗学舍部署说明

## 服务器要求

- Node.js 20 或更高版本
- npm
- Git
- Git LFS（视频文件约 3.2 GB，必须下载实际文件）
- 可用端口 3001

## 首次部署

```bash
git clone --branch master https://github.com/shuzhishuyuan/classics.git
cd classics
git lfs install --local
git lfs pull origin master
npm ci
cp .env.example .env
```

实际项目在 `master` 分支；GitHub 的默认分支 `main` 不包含完整项目。
服务器需预先安装 Git LFS，例如 Ubuntu/Debian 使用 `sudo apt-get install git-lfs`。
仅下载 Git 仓库或源码压缩包，可能拿到约 130 字节的 LFS 指针，而非实际 MP4。
构建会检查视频文件头，遇到指针文件或无效 MP4 时停止发布。

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
git pull --ff-only origin master
git lfs install --local
git lfs pull origin master
npm ci
npm run build
pm2 restart shuyuan
```

上述命令需在 `master` 分支的项目目录执行。下载视频后必须重新构建，
因为网站提供的是 `dist/materials` 中的文件，单独执行 `git lfs pull` 不会更新旧构建。

## 视频播放排查

- 先确认线上视频地址返回 `video/mp4`，并检查文件大小是否与本地一致。
- 若响应内容以 `version https://git-lfs.github.com/spec/v1` 开头，按发布更新步骤下载视频并重新构建。
- 若响应是 HTML 或 404，检查是否发布了完整的 `dist/materials`，以及代理是否将 `/materials/` 指向静态文件服务。
- 请求 `Range: bytes=0-127` 应返回 `206 Partial Content` 和 `Content-Range`；部分大视频的索引位于文件末尾，需要代理保留字节范围请求。
- 视频统一使用 H.264 画面和 AAC 音频。H.265 视频在部分浏览器中可能只有声音、没有画面。
- 更换视频后，清理 CDN 缓存并刷新浏览器。

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
