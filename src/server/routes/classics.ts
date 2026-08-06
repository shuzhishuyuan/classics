import { Router } from 'express'
import { ok, fail } from '../middleware/response'
import * as svc from '../services/classics.service'

const router = Router()

// GET /classics — 列表
router.get('/', (req, res) => {
  const { dimension, academy, genre, schoolLevel, keyword, page, pageSize } = req.query as Record<string, string>
  const result = svc.listClassics({
    dimension, academy, genre, schoolLevel, keyword,
    page: page ? parseInt(page) : 1,
    pageSize: pageSize ? parseInt(pageSize) : 20,
  })
  return ok(res, result)
})

// GET /classics/search — 全文搜索
router.get('/search', (req, res) => {
  const keyword = (req.query.keyword as string) || ''
  if (!keyword.trim()) return fail(res, '请输入搜索关键词')
  return ok(res, svc.searchClassics(keyword))
})

// GET /classics/:id — 详情
router.get('/:id', (req, res) => {
  const classic = svc.getClassicDetail(String(req.params.id))
  if (!classic) return fail(res, '典籍不存在', 404)
  return ok(res, classic)
})

// GET /classics/:id/chapters/:chapterId — 章节内容
router.get('/:id/chapters/:chapterId', (req, res) => {
  const result = svc.getChapter(String(req.params.id), String(req.params.chapterId))
  if (!result) return fail(res, '章节不存在', 404)
  return ok(res, result)
})

export default router
