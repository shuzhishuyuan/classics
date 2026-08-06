import { Router } from 'express'
import { authRequired } from '../middleware/auth'
import { ok, fail } from '../middleware/response'
import * as svc from '../services/discussion.service'

const router = Router()

router.post('/', authRequired, (req, res) => {
  const { classicId, topic, content } = req.body as Record<string, string>
  if (!topic || !content) return fail(res, '请填写主题和内容')
  const d = svc.createDiscussion(req.currentUser!.userId, { classicId, topic, content })
  return ok(res, d)
})

router.get('/', (req, res) => {
  const classicId = String(req.query.classicId || '')
  return ok(res, svc.getDiscussions(classicId || undefined))
})

router.get('/:id', (req, res) => {
  const d = svc.getDiscussionDetail(String(req.params.id))
  if (!d) return fail(res, '讨论不存在', 404)
  return ok(res, d)
})

router.post('/:id/replies', authRequired, (req, res) => {
  const { content } = req.body as Record<string, string>
  if (!content) return fail(res, '请输入回复内容')
  const r = svc.createReply(req.currentUser!.userId, String(req.params.id), content)
  return ok(res, r)
})

export default router
