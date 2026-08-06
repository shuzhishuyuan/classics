import { z } from 'zod'

/** 手机号正则 */
const phoneRegex = /^1[3-9]\d{9}$/

export const loginSchema = z.object({
  phone: z.string().regex(phoneRegex, '请输入有效的手机号'),
  password: z.string().min(1, '请输入密码'),
})

export const registerSchema = z.object({
  phone: z.string().regex(phoneRegex, '请输入有效的手机号'),
  name: z.string().min(1, '请输入姓名').max(10, '姓名不超过10个字符'),
  password: z.string().min(6, '密码至少6位'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: '两次密码不一致',
  path: ['confirmPassword'],
})

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, '缺少 refreshToken'),
})

export const profileSchema = z.object({
  name: z.string().min(1).max(10).optional(),
  school: z.string().max(50).optional(),
  grade: z.string().max(20).optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type RefreshInput = z.infer<typeof refreshSchema>
export type ProfileInput = z.infer<typeof profileSchema>
