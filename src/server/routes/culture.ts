import { Router } from 'express'
import { ok, fail } from '../middleware/response'
import * as svc from '../services/culture.service'

const router = Router()

router.get('/academies', (_req, res) => ok(res, svc.listAcademies()))

router.get('/academies/:name', (req, res) => {
  const a = svc.getAcademyDetail(String(req.params.name))
  if (!a) return fail(res, '书院不存在', 404)
  return ok(res, a)
})

export default router
