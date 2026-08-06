import type { UserRow, SafeUser } from '../types/auth.types'

// ===== 创建用户入参 =====
export interface CreateUserInput {
  name: string
  phone: string
  password: string  // 已 bcrypt 哈希
  avatar?: string
  school?: string
  grade?: string
}

// ===== 资料更新入参 =====
export interface ProfileInput {
  name?: string
  school?: string
  grade?: string
}

// ===== Repository 接口 =====
export interface UserRepository {
  findByPhone(phone: string): Promise<UserRow | null>
  findById(id: string): Promise<UserRow | null>
  getStudents(): Promise<UserRow[]>
  createUser(input: CreateUserInput): Promise<UserRow>
  updateProfile(id: string, input: ProfileInput): Promise<UserRow | null>
  count(): Promise<number>
}

export interface TokenRepository {
  create(userId: string): Promise<string>
  consume(token: string): Promise<string | null>
  revokeAll(userId: string): Promise<void>
}

export interface AppRepositories {
  user: UserRepository
  token: TokenRepository
}
