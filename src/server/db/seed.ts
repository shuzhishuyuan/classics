import bcrypt from 'bcryptjs'
import type { AppRepositories } from './repository'

interface SeedUser {
  name: string; phone: string; password: string; avatar: string; school: string; grade: string
}

const SEED_STUDENTS: SeedUser[] = [
  { name: '李明轩', phone: '13800000001', password: '123456', avatar: '🧑‍🎓', school: '长沙市第一中学', grade: '初中二年级' },
  { name: '张晓雅', phone: '13800000002', password: '123456', avatar: '👩‍🎓', school: '岳麓区实验小学', grade: '小学五年级' },
  { name: '王子涵', phone: '13800000003', password: '123456', avatar: '🧑‍🎓', school: '河南省实验中学', grade: '高中一年级' },
]

export async function runSeed(repos: AppRepositories) {
  const count = await repos.user.count()
  if (count > 0) {
    console.log(`  📦 数据库已有 ${count} 个用户，跳过初始化`)
    return
  }

  for (const u of SEED_STUDENTS) {
    const hash = await bcrypt.hash(u.password, 10)
    await repos.user.createUser({ name: u.name, phone: u.phone, password: hash, avatar: u.avatar, school: u.school, grade: u.grade })
  }
  console.log(`  🌱 已预置 ${SEED_STUDENTS.length} 个学生账号`)
}
