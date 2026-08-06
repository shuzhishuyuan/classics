import { Router } from 'express'
import { authRequired } from '../middleware/auth'
import { ok, fail } from '../middleware/response'
import * as svc from '../services/resources.service'
import * as shared from '../services/shared-resource.service'

const router = Router()

// GET /resources — 官方资源列表
router.get('/', (req, res) => {
  const { category, stage, type, subject, courseTopic, keyword, page, pageSize } = req.query as Record<string, string>
  const result = svc.listResources({
    category, stage, type, subject, courseTopic, keyword,
    page: page ? parseInt(page) : 1,
    pageSize: pageSize ? parseInt(pageSize) : 20,
  })
  return ok(res, result)
})

// GET /resources/categories — 分类统计
router.get('/categories', (_req, res) => {
  return ok(res, svc.getCategoryStats())
})

// GET /resources/:id — 详情
router.get('/:id', (req, res) => {
  const r = svc.getResourceDetail(String(req.params.id))
  if (!r) return fail(res, '资源不存在', 404)
  return ok(res, r)
})

// ===== 用户投稿的共享资源 =====

// POST /resources/shared — 发布共享资源
router.post('/shared', authRequired, (req, res) => {
  const { title, description, category, type, tags, fileUrl } = req.body as Record<string, any>
  if (!title) return fail(res, '请输入资源标题')
  const r = shared.createSharedResource(req.currentUser!.userId, { title, description, category, type, tags, fileUrl })
  return ok(res, r, '发布成功')
})

// GET /resources/shared/list — 共享资源列表
router.get('/shared/list', async (req, res) => {
  const { keyword, category, page, pageSize } = req.query as Record<string, string>
  return ok(res, await shared.listSharedResources({
    keyword, category,
    page: page ? parseInt(page) : 1,
    pageSize: pageSize ? parseInt(pageSize) : 20,
  }))
})

// GET /resources/shared/:sharedId — 共享资源详情
router.get('/shared/:sharedId', (req, res) => {
  const r = shared.getSharedDetail(String(req.params.sharedId))
  if (!r) return fail(res, '资源不存在', 404)
  return ok(res, r)
})

export default router
