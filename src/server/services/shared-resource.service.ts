import db from '../db/connection'
import { v4 as uuidv4 } from 'uuid'
import { findUserById } from './auth.service'

/** 预置演示共享资源 */
export function seedSharedResources() {
  const count = (db.prepare('SELECT COUNT(*) as cnt FROM shared_resources').get() as { cnt: number }).cnt
  if (count > 0) return

  const demoStudent = db.prepare("SELECT * FROM users WHERE phone='13800000001'").get() as any
  if (!demoStudent) return

  const demos = [
    { title: '白鹿洞书院实地研学照片集', description: '暑假去庐山白鹿洞书院拍的照片，包含建筑全景、碑刻特写、周边环境，共30张', category: '学生学习', tags: ['书院历史', '实地探访', '照片分享'] },
    { title: '《岳阳楼记》课堂实录逐字稿', description: '公开课上《岳阳楼记》的完整逐字稿，包含师生互动环节和学生精彩发言', category: '教师备课', tags: ['教案', '课堂实录', '岳阳楼记'] },
    { title: '亲子每日诵读录音合集（30天）', description: '我和孩子坚持30天的每日诵读录音，从白鹿洞揭示到岳阳楼记', category: '亲子共读', tags: ['亲子共读', '诵读打卡', '习惯养成'] },
    { title: '书院文化主题班会PPT', description: '中学班会课用的PPT，主题是"书院精神与学习态度"，含互动环节设计', category: '教师备课', tags: ['主题班会', 'PPT', '书院精神'] },
    { title: '我录的《白鹿洞书院揭示》全文诵读', description: '自己录制的诵读音频，配了背景古琴音乐，适合晨读跟读', category: '学生学习', tags: ['诵读', '音频', '白鹿洞揭示'] },
  ]

  const stmt = db.prepare('INSERT INTO shared_resources (id, user_id, title, description, category, type, tags, file_url) VALUES (?,?,?,?,?,?,?,?)')
  for (const d of demos) {
    stmt.run(uuidv4(), demoStudent.id, d.title, d.description, d.category, '图文', JSON.stringify(d.tags), null)
  }
  console.log(`  📤 已预置 ${demos.length} 条演示共享资源`)
}

// ... keep existing code ...

export interface SharedResourceRow {
  id: string; user_id: string; title: string; description: string | null
  type: string; tags: string; file_url: string | null
  downloads: number; created_at: string
}

export function createSharedResource(userId: string, data: { title: string; description?: string; category?: string; type?: string; tags?: string[]; fileUrl?: string }) {
  const id = uuidv4()
  db.prepare(`INSERT INTO shared_resources (id, user_id, title, description, category, type, tags, file_url)
    VALUES (?,?,?,?,?,?,?,?)`).run(id, userId, data.title, data.description || '', data.category || '学生学习', data.type || '图文', JSON.stringify(data.tags || []), data.fileUrl || null)
  return getSharedDetail(id)
}

export async function listSharedResources(params: { keyword?: string; category?: string; page?: number; pageSize?: number }) {
  const { keyword, category, page = 1, pageSize = 20 } = params
  let sql = 'SELECT * FROM shared_resources WHERE 1=1'
  const args: string[] = []

  if (category) { sql += ' AND category=?'; args.push(category) }
  if (keyword) { sql += ' AND (title LIKE ? OR description LIKE ?)'; args.push(`%${keyword}%`, `%${keyword}%`) }

  sql += ' ORDER BY created_at DESC'
  const all = db.prepare(sql).all(...args) as SharedResourceRow[]

  const total = all.length
  const start = (page - 1) * pageSize
  const list = all.slice(start, start + pageSize)

  // 附加发布者信息
  const enriched = await Promise.all(list.map(async r => {
    const u = await findUserById(r.user_id)
    return {
      ...r,
      tags: JSON.parse(r.tags || '[]'),
      publisher: u ? { id: u.id, name: u.name, avatar: u.avatar, school: u.school, role: u.role } : null,
    }
  }))

  return { list: enriched, total, page, pageSize }
}

export async function getSharedDetail(id: string) {
  const r = db.prepare('SELECT * FROM shared_resources WHERE id=?').get(id) as SharedResourceRow | undefined
  if (!r) return null
  const u = await findUserById(r.user_id)
  // 增加下载计数
  db.prepare('UPDATE shared_resources SET downloads=downloads+1 WHERE id=?').run(id)
  return {
    ...r,
    tags: JSON.parse(r.tags || '[]'),
    publisher: u ? { id: u.id, name: u.name, avatar: u.avatar, school: u.school, role: u.role } : null,
  }
}
