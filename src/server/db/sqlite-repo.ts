import { v4 as uuidv4 } from 'uuid'
import db from './connection'
import type { UserRepository, TokenRepository, CreateUserInput, ProfileInput } from './repository'
import type { UserRow } from '../types/auth.types'

// ===== User =====
export const sqliteUserRepo: UserRepository = {
  async findByPhone(phone: string) {
    return (db.prepare('SELECT * FROM users WHERE phone = ?').get(phone) as UserRow) ?? null
  },
  async findById(id: string) {
    return (db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow) ?? null
  },
  async getStudents() {
    return db.prepare('SELECT * FROM users WHERE role = ? ORDER BY created_at ASC').all('学生') as UserRow[]
  },
  async createUser(input: CreateUserInput) {
    const id = uuidv4()
    db.prepare(`INSERT INTO users (id, name, phone, password, avatar, school, grade)
      VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
      id, input.name, input.phone, input.password,
      input.avatar ?? '🧑‍🎓', input.school ?? '未设置', input.grade ?? '未设置',
    )
    return (db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow)
  },
  async updateProfile(id: string, input: ProfileInput) {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined
    if (!user) return null
    db.prepare("UPDATE users SET name=?, school=?, grade=?, updated_at=datetime('now') WHERE id=?")
      .run(input.name ?? user.name, input.school ?? user.school, input.grade ?? user.grade, id)
    return (db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow)
  },
  async count() {
    return (db.prepare('SELECT COUNT(*) as cnt FROM users').get() as { cnt: number }).cnt
  },
}

// ===== Token =====
export const sqliteTokenRepo: TokenRepository = {
  async create(userId: string) {
    const token = uuidv4()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    db.prepare('INSERT INTO refresh_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)')
      .run(uuidv4(), userId, token, expiresAt)
    return token
  },
  async consume(token: string) {
    const row = db.prepare(
      "SELECT user_id FROM refresh_tokens WHERE token = ? AND expires_at > datetime('now')"
    ).get(token) as { user_id: string } | undefined
    if (!row) return null
    db.prepare('DELETE FROM refresh_tokens WHERE token = ?').run(token)
    return row.user_id
  },
  async revokeAll(userId: string) {
    db.prepare('DELETE FROM refresh_tokens WHERE user_id = ?').run(userId)
  },
}
