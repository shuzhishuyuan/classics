import db from '../db/connection'
import { v4 as uuidv4 } from 'uuid'
import { findUserById } from './auth.service'

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
