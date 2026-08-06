import { Router } from 'express'
import { authRequired } from '../middleware/auth'
import { ok } from '../middleware/response'
import * as svc from '../services/recitation.service'

const router = Router()

router.post('/', authRequired, (req, res) => {
  const r = svc.createRecitation(req.currentUser!.userId, req.body)
  return ok(res, r)
})

router.get('/my', authRequired, (req, res) => {
  return ok(res, svc.getMyRecitations(req.currentUser!.userId))
})

router.get('/', (_req, res) => {
  return ok(res, svc.getRecitationList())
})

router.post('/:id/like', authRequired, (req, res) => {
  const liked = svc.toggleRecitationLike(req.currentUser!.userId, String(req.params.id))
  return ok(res, { liked })
})

export default router
