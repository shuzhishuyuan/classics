import express from 'express'
import path from 'path'
import fs from 'fs'

/**
 * 生产环境：托管前端静态文件 + SPA fallback
 * 开发环境：不做任何事（Vite dev server 处理前端）
 */
export function setupStatic(app: express.Express) {
  if (process.env.NODE_ENV !== 'production') return

  const distDir = path.resolve(process.cwd(), 'dist')

  if (!fs.existsSync(distDir)) {
    console.warn('  ⚠️  dist/ 目录不存在，请先执行 npm run build')
    return
  }

  // 上传文件静态访问
  const uploadsDir = path.resolve(process.cwd(), 'server', 'data', 'uploads')
  app.use('/uploads', express.static(uploadsDir))

  // 前端构建产物
  app.use(express.static(distDir))

  // SPA fallback：非 /api 的路由返回 index.html
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) return next()
    // 如果请求的是真实文件（js/css/png等），express.static 已经处理了
    // 这里只处理前端路由的 HTML5 History fallback
    const filePath = path.join(distDir, req.path)
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      return res.sendFile(path.join(distDir, 'index.html'))
    }
    next()
  })

  console.log('  🌐 静态文件服务已启用 (dist/)')
}
