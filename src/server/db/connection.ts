import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data')
const DB_PATH = path.join(DATA_DIR, 'shuyuan.db')

// 确保目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

const db = new Database(DB_PATH)

// 启用 WAL 模式提升并发性能
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

export default db
