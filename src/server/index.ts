import 'dotenv/config'
import { start } from './app'

const PORT = Number(process.env.PORT) || 3001

start().then(app => {
  app.listen(PORT, () => {
    console.log()
    console.log(`  🏛️  数智书院已启动`)
    console.log(`  →  http://localhost:${PORT}`)
    console.log(`  →  环境: ${process.env.NODE_ENV || 'development'}`)
    console.log(`  →  数据库: ${(process.env.DB_TYPE || 'sqlite').toUpperCase()}`)
    console.log()
  })
}).catch(err => {
  console.error('启动失败:', err.message)
  process.exit(1)
})
