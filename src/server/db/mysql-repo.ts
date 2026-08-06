import mysql from 'mysql2/promise'
import { v4 as uuidv4 } from 'uuid'
import type { UserRepository, TokenRepository, CreateUserInput, ProfileInput } from './repository'
import type { UserRow } from '../types/auth.types'

function getPool() {
  return mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'shuyuan',
    waitForConnections: true,
    connectionLimit: 10,
  })
}

let pool: mysql.Pool | null = null

function p() {
  if (!pool) pool = getPool()
  return pool
}

/** 将 MySQL row 转为 UserRow */
function mapRow(r: any): UserRow {
  return {
    ...r,
    subject: r.subject ?? null,
    student_name: r.student_name ?? null,
    student_grade: r.student_grade ?? null,
    created_at: typeof r.created_at === 'string' ? r.created_at : String(r.created_at),
    updated_at: typeof r.updated_at === 'string' ? r.updated_at : String(r.updated_at),
  }
}

// ===== User =====
export const mysqlUserRepo: UserRepository = {
  async findByPhone(phone: string) {
    const [rows] = await p().execute('SELECT * FROM users WHERE phone = ?', [phone])
    const arr = rows as any[]
    return arr.length > 0 ? mapRow(arr[0]) : null
  },
  async findById(id: string) {
    const [rows] = await p().execute('SELECT * FROM users WHERE id = ?', [id])
    const arr = rows as any[]
    return arr.length > 0 ? mapRow(arr[0]) : null
  },
  async getStudents() {
    const [rows] = await p().execute('SELECT * FROM users WHERE role = ? ORDER BY created_at ASC', ['学生'])
    return (rows as any[]).map(mapRow)
  },
  async createUser(input: CreateUserInput) {
    const id = uuidv4()
    await p().execute(
      `INSERT INTO users (id, name, phone, password, avatar, school, grade)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, input.name, input.phone, input.password,
       input.avatar ?? '🧑‍🎓', input.school ?? '未设置', input.grade ?? '未设置'],
    )
    const [rows] = await p().execute('SELECT * FROM users WHERE id = ?', [id])
    return mapRow((rows as any[])[0])
  },
  async updateProfile(id: string, input: ProfileInput) {
    const [found] = await p().execute('SELECT * FROM users WHERE id = ?', [id])
    const arr = found as any[]
    if (arr.length === 0) return null
    const u = arr[0]
    await p().execute(
      'UPDATE users SET name=?, school=?, grade=?, updated_at=NOW() WHERE id=?',
      [input.name ?? u.name, input.school ?? u.school, input.grade ?? u.grade, id],
    )
    const [rows] = await p().execute('SELECT * FROM users WHERE id = ?', [id])
    return mapRow((rows as any[])[0])
  },
  async count() {
    const [rows] = await p().execute('SELECT COUNT(*) as cnt FROM users')
    return Number((rows as any[])[0].cnt)
  },
}

// ===== Token =====
export const mysqlTokenRepo: TokenRepository = {
  async create(userId: string) {
    const token = uuidv4()
    await p().execute(
      'INSERT INTO refresh_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
      [uuidv4(), userId, token],
    )
    return token
  },
  async consume(token: string) {
    const [rows] = await p().execute(
      'SELECT user_id FROM refresh_tokens WHERE token = ? AND expires_at > NOW()',
      [token],
    )
    const arr = rows as any[]
    if (arr.length === 0) return null
    await p().execute('DELETE FROM refresh_tokens WHERE token = ?', [token])
    return arr[0].user_id as string
  },
  async revokeAll(userId: string) {
    await p().execute('DELETE FROM refresh_tokens WHERE user_id = ?', [userId])
  },
}
