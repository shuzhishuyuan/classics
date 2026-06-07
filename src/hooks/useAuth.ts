import { useState, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

export type UserRole = '学生' | '教师' | '家长'

export interface User {
  id: string
  name: string
  role: UserRole
  avatar: string
  school: string
  grade: string
  /** 教师专用 */
  subject?: string
  /** 家长专用 */
  studentName?: string
  studentGrade?: string
}

const defaultAvatars: Record<UserRole, string> = {
  '学生': '🧑‍🎓',
  '教师': '👩‍🏫',
  '家长': '👨‍👩‍👧',
}

/** 模拟用户数据库 */
const mockUsers: Record<UserRole, User[]> = {
  '学生': [
    { id: 'stu-01', name: '李明轩', role: '学生', avatar: '🧑‍🎓', school: '长沙市第一中学', grade: '初中二年级' },
    { id: 'stu-02', name: '张晓雅', role: '学生', avatar: '👩‍🎓', school: '岳麓区实验小学', grade: '小学五年级' },
    { id: 'stu-03', name: '王子涵', role: '学生', avatar: '🧑‍🎓', school: '河南省实验中学', grade: '高中一年级' },
  ],
  '教师': [
    { id: 'tch-01', name: '张明远', role: '教师', avatar: '👨‍🏫', school: '长沙市第一中学', grade: '初中', subject: '语文' },
    { id: 'tch-02', name: '王雅文', role: '教师', avatar: '👩‍🏫', school: '岳麓区实验小学', grade: '小学', subject: '道德与法治' },
    { id: 'tch-03', name: '陈文博', role: '教师', avatar: '👨‍🏫', school: '河南省实验中学', grade: '高中', subject: '语文' },
  ],
  '家长': [
    { id: 'par-01', name: '李建国', role: '家长', avatar: '👨‍👩‍👧', school: '—', grade: '—', studentName: '李明轩', studentGrade: '初中二年级' },
    { id: 'par-02', name: '赵丽华', role: '家长', avatar: '👨‍👩‍👧', school: '—', grade: '—', studentName: '张晓雅', studentGrade: '小学五年级' },
    { id: 'par-03', name: '王建军', role: '家长', avatar: '👨‍👩‍👧', school: '—', grade: '—', studentName: '王子涵', studentGrade: '高中一年级' },
  ],
}

export function useAuth() {
  const [user, setUser] = useLocalStorage<User | null>('current_user', null)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [showUserList, setShowUserList] = useState(false)

  /** 选择角色 */
  const selectRole = useCallback((role: UserRole) => {
    setSelectedRole(role)
    setShowUserList(true)
  }, [])

  /** 以某个用户身份登录 */
  const login = useCallback((u: User) => {
    setUser(u)
    setShowUserList(false)
  }, [setUser])

  /** 切换角色（回到角色选择） */
  const switchRole = useCallback(() => {
    setShowUserList(false)
    setSelectedRole(null)
  }, [])

  /** 登出 */
  const logout = useCallback(() => {
    setUser(null)
    setSelectedRole(null)
    setShowUserList(false)
  }, [setUser])

  /** 获取当前角色可用的用户列表 */
  const availableUsers = selectedRole ? mockUsers[selectedRole] : []

  const isLoggedIn = !!user

  return {
    user,
    isLoggedIn,
    selectedRole,
    showUserList,
    availableUsers,
    selectRole,
    login,
    switchRole,
    logout,
  }
}
