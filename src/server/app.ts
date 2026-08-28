import 'dotenv/config'
import express from 'express'
import path from 'path'
import cors from 'cors'
import helmet from 'helmet'
import { runSqliteMigrations } from './db/migrate'
import { runMysqlMigrations } from './db/mysql-migrate'
import { getRepos } from './db/factory'
import { setRepos } from './services/auth.service'
import { runSeed } from './db/seed'
import { seedTasks } from './services/task.service'
import { seedSharedResources } from './services/shared-resource.service'
import { seedDiscussions } from './services/discussion.service'
import { setupStatic } from './serveStatic'

import authRouter from './routes/auth'
import classicsRouter from './routes/classics'
import resourcesRouter from './routes/resources'
import cultureRouter from './routes/culture'
import learningRouter from './routes/learning'
import notesRouter from './routes/notes'
import recitationRouter from './routes/recitation'
import discussionsRouter from './routes/discussions'
import tasksRouter from './routes/tasks'
import teacherRouter from './routes/teacher'
import uploadRouter from './routes/upload'
import immersiveRouter from './routes/immersive'
import aiRouter from './routes/ai'

// ===== 数据库初始化（先完成建表再启动 HTTP）=====
const dbType = process.env.DB_TYPE || 'sqlite'
const isProduction = process.env.NODE_ENV === 'production'

async function initDatabase() {
  if (dbType === 'mysql') {
    await runMysqlMigrations()
    console.log('  📦 MySQL 表已就绪')
  } else {
    runSqliteMigrations()
    console.log('  📦 SQLite 表已就绪')
  }
}

const repos = getRepos()
setRepos(repos)

// 预置种子
async function initSeed() {
  await Promise.all([
    runSeed(repos),
    seedTasks(),
    seedSharedResources(),
    seedDiscussions(),
  ])
}

// ===== Express 初始化 =====
const app = express()

// 安全头
app.use(helmet({
  contentSecurityPolicy: false, // SPA 需要加载内联资源
  crossOriginEmbedderPolicy: false,
}))

// CORS：生产只允许同源，开发放开
const corsOrigin = isProduction
  ? (process.env.CORS_ORIGIN || true) // 设为 true 即同源策略; 可配域名
  : true
app.use(cors({ origin: corsOrigin, credentials: true }))

// 信任代理（部署在 Nginx 后面时需要）
if (isProduction) {
  app.set('trust proxy', 1)
}

app.use(express.json({ limit: '10mb' }))

// 上传文件静态访问
const uploadsDir = path.resolve(process.cwd(), 'server', 'data', 'uploads')
app.use('/uploads', express.static(uploadsDir, { dotfiles: 'deny' }))

// ===== API 路由 =====
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/classics', classicsRouter)
app.use('/api/v1/resources', resourcesRouter)
app.use('/api/v1/culture', cultureRouter)
app.use('/api/v1/learning', learningRouter)
app.use('/api/v1/notes', notesRouter)
app.use('/api/v1/recitation', recitationRouter)
app.use('/api/v1/discussions', discussionsRouter)
app.use('/api/v1/tasks', tasksRouter)
app.use('/api/v1/teacher', teacherRouter)
app.use('/api/v1', uploadRouter)
app.use('/api/v1/immersive', immersiveRouter)
app.use('/api/v1/ai', aiRouter)

// ===== 生产：前端静态文件 =====
setupStatic(app)

// 404 — API
app.use('/api', (_req, res) => {
  res.status(404).json({ code: 404, message: '接口不存在', data: null })
})

// 全局错误
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Server Error]', err.message)
  res.status(500).json({ code: 500, message: '服务器内部错误', data: null })
})

// ===== 启动：先建表 & 种子，再监听 =====
export async function start() {
  console.log(`  🗄️  数据库模式: ${dbType.toUpperCase()}`)
  await initDatabase()
  await initSeed()
  return app
}

export default app
