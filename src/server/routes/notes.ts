import { Router } from 'express'
import { authRequired } from '../middleware/auth'
import { ok, fail } from '../middleware/response'
import * as svc from '../services/notes.service'

const router = Router()

router.post('/', authRequired, (req, res) => {
  const { classicId, chapterId, content, isPublic } = req.body as Record<string, any>
  if (!classicId || !content) return fail(res, '缺少必填参数')
  const note = svc.createNote(req.currentUser!.userId, { classicId, chapterId, content, isPublic })
  return ok(res, note)
})

router.get('/', authRequired, (req, res) => {
  const classicId = String(req.query.classicId || '')
  return ok(res, svc.getNotes(req.currentUser!.userId, classicId || undefined))
})

router.put('/:id', authRequired, (req, res) => {
  const note = svc.updateNote(String(req.params.id), req.currentUser!.userId, req.body)
  if (!note) return fail(res, '笔记不存在', 404)
  return ok(res, note)
})

router.delete('/:id', authRequired, (req, res) => {
  const ok_ = svc.deleteNote(String(req.params.id), req.currentUser!.userId)
  if (!ok_) return fail(res, '笔记不存在', 404)
  return ok(res, null, '已删除')
})

export default router
