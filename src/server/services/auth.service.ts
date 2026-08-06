import bcrypt from 'bcryptjs'
import type { UserRow, SafeUser, UserRole } from '../types/auth.types'
import { toSafeUser } from '../types/auth.types'
import type { AppRepositories, ProfileInput } from '../db/repository'

// ===== 单例 repos（由 app.ts 初始化时注入） =====
let repos: AppRepositories

export function setRepos(r: AppRepositories) {
  repos = r
}

// ===== 查询 =====
export async function findUserByPhone(phone: string): Promise<UserRow | null> {
  return repos.user.findByPhone(phone)
}

export async function findUserById(id: string): Promise<UserRow | null> {
  return repos.user.findById(id)
}

export async function getStudents(): Promise<SafeUser[]> {
  const rows = await repos.user.getStudents()
  return rows.map(toSafeUser)
}

// ===== 认证 =====
export async function login(input: { phone: string; password: string }): Promise<{ user: SafeUser } | { error: string }> {
  const row = await repos.user.findByPhone(input.phone)
  if (!row) return { error: '该手机号未注册' }

  const valid = await bcrypt.compare(input.password, row.password)
  if (!valid) return { error: '密码错误' }

  return { user: toSafeUser(row) }
}

export async function register(input: { phone: string; name: string; password: string }): Promise<{ user: SafeUser } | { error: string }> {
  const exist = await repos.user.findByPhone(input.phone)
  if (exist) return { error: '该手机号已注册，请直接登录' }

  const hash = await bcrypt.hash(input.password, 10)
  const row = await repos.user.createUser({ name: input.name.trim(), phone: input.phone, password: hash })
  return { user: toSafeUser(row) }
}

// ===== RefreshToken =====
export async function createRefreshToken(userId: string): Promise<string> {
  return repos.token.create(userId)
}

export async function consumeRefreshToken(token: string): Promise<string | null> {
  return repos.token.consume(token)
}

export async function revokeUserTokens(userId: string): Promise<void> {
  return repos.token.revokeAll(userId)
}

// ===== 用户资料 =====
export async function updateProfile(userId: string, input: ProfileInput): Promise<SafeUser | null> {
  const row = await repos.user.updateProfile(userId, input)
  return row ? toSafeUser(row) : null
}
