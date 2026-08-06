import { useState, useCallback, useEffect } from 'react'
import { post, get, setTokens, clearTokens } from './useApi'

export type UserRole = '学生' | '教师' | '家长'

export interface User {
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

interface TokenResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // 页面加载时用 token 恢复登录态
  useEffect(() => {
    const at = localStorage.getItem('access_token')
    if (!at) return

    get<User>('/auth/me')
      .then(res => {
        if (res.code === 200 && res.data) {
          setUser(res.data)
          setIsLoggedIn(true)
        } else {
          clearTokens()
        }
      })
      .catch(() => clearTokens())
  }, [])

  /** 手机号 + 密码登录 */
  const login = useCallback(async (phone: string, password: string) => {
    try {
      const res = await post<TokenResponse>('/auth/login', { phone, password })
      if (res.code === 200 && res.data) {
        setTokens(res.data.accessToken, res.data.refreshToken)
        setUser(res.data.user)
        setIsLoggedIn(true)
        return { success: true as const }
      }
      return { success: false as const, message: res.message }
    } catch {
      return { success: false as const, message: '网络错误，请稍后重试' }
    }
  }, [])

  /** 注册 */
  const register = useCallback(async (data: { phone: string; name: string; password: string; confirmPassword: string }) => {
    try {
      const res = await post<TokenResponse>('/auth/register', {
        phone: data.phone,
        name: data.name,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
      if (res.code === 200 && res.data) {
        setTokens(res.data.accessToken, res.data.refreshToken)
        setUser(res.data.user)
        setIsLoggedIn(true)
        return { success: true as const }
      }
      return { success: false as const, message: res.message }
    } catch {
      return { success: false as const, message: '网络错误，请稍后重试' }
    }
  }, [])

  /** 登出 */
  const logout = useCallback(() => {
    clearTokens()
    setUser(null)
    setIsLoggedIn(false)
  }, [])

  return { user, isLoggedIn, login, register, logout }
}
