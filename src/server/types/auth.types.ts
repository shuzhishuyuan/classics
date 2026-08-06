/** 错误码枚举 */
export const ErrorCode = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
} as const

/** 用户角色 */
export type UserRole = '学生' | '教师' | '家长'

/** 数据库用户行 */
export interface UserRow {
  id: string
  name: string
  phone: string
  password: string
  role: UserRole
  avatar: string
  school: string
  grade: string
  subject: string | null
  student_name: string | null
  student_grade: string | null
  created_at: string
  updated_at: string
}

/** 返回给前端的用户信息（脱敏） */
export interface SafeUser {
  id: string
  name: string
  role: UserRole
  avatar: string
  school: string
  grade: string
  subject?: string
  studentName?: string
  studentGrade?: string
}

/** 将数据库行转为前端安全对象 */
export function toSafeUser(row: UserRow): SafeUser {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    avatar: row.avatar,
    school: row.school,
    grade: row.grade,
    ...(row.subject ? { subject: row.subject } : {}),
    ...(row.student_name ? { studentName: row.student_name } : {}),
    ...(row.student_grade ? { studentGrade: row.student_grade } : {}),
  }
}

/** JWT payload */
export interface JwtPayload {
  userId: string
  role: UserRole
}
