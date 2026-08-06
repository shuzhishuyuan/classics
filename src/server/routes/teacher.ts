import { Router } from 'express'
import { authRequired } from '../middleware/auth'
import { ok } from '../middleware/response'
import { teacherPrepData } from '../../data/resourceMockData'

const router = Router()

// GET /teacher/resources — 教师备课资源
router.get('/resources', (_req, res) => {
  return ok(res, teacherPrepData)
})

// GET /teacher/class-progress — 班级概览 (mock)
router.get('/class-progress', authRequired, (_req, res) => {
  return ok(res, {
    totalStudents: 42,
    completedTasks: 156,
    avgProgress: 68,
    topClassic: '白鹿洞书院揭示',
    recentActivity: [
      { name: '李明轩', action: '完成了诵读打卡', time: '10分钟前' },
      { name: '张晓雅', action: '提交了读后感', time: '25分钟前' },
      { name: '王子涵', action: '收藏了《岳阳楼记》', time: '1小时前' },
    ],
  })
})

export default router
