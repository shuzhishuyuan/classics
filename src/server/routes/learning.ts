import { Router } from 'express'
import { authRequired } from '../middleware/auth'
import { ok, fail } from '../middleware/response'
import * as svc from '../services/learning.service'

const router = Router()

router.post('/favorites/:classicId', authRequired, (req, res) => {
  const liked = svc.toggleClassicFavorite(req.currentUser!.userId, String(req.params.classicId))
  return ok(res, { favorited: liked })
})

router.get('/favorites', authRequired, (req, res) => {
  return ok(res, svc.getClassicFavorites(req.currentUser!.userId))
})

router.post('/enroll/:classicId', authRequired, (req, res) => {
  const enrolled = svc.toggleEnroll(req.currentUser!.userId, String(req.params.classicId))
  return ok(res, { enrolled })
})

router.get('/enrolled', authRequired, (req, res) => {
  return ok(res, svc.getEnrolled(req.currentUser!.userId))
})

router.put('/progress', authRequired, (req, res) => {
  const { classicId, chapterId } = req.body as Record<string, string>
  if (!classicId || !chapterId) return fail(res, '缺少参数')
  svc.saveProgress(req.currentUser!.userId, classicId, chapterId)
  return ok(res, null, 'ok')
})

router.get('/progress', authRequired, (req, res) => {
  const classicId = String(req.query.classicId || '')
  return ok(res, svc.getProgress(req.currentUser!.userId, classicId || undefined))
})

router.get('/stats', authRequired, (req, res) => {
  return ok(res, svc.getLearningStats(req.currentUser!.userId))
})

export default router
