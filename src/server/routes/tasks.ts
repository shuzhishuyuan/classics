import { Router } from 'express'
import { authRequired } from '../middleware/auth'
import { ok, fail } from '../middleware/response'
import * as svc from '../services/task.service'

const router = Router()

router.get('/', (req, res) => {
  return ok(res, svc.getTasks(String(req.query.dimension || '') || undefined))
})

router.get('/:id', (req, res) => {
  const t = svc.getTaskDetail(String(req.params.id))
  if (!t) return fail(res, '任务不存在', 404)
  return ok(res, t)
})

router.post('/:id/submit', authRequired, (req, res) => {
  const { content } = req.body as Record<string, string>
  if (!content) return fail(res, '请输入提交内容')
  return ok(res, svc.submitTask(req.currentUser!.userId, String(req.params.id), content))
})

router.get('/my/submissions', authRequired, (req, res) => {
  return ok(res, svc.getMySubmissions(req.currentUser!.userId))
})

export default router
