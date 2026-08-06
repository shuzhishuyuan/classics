import { Router } from 'express'
import { authRequired, signAccessToken } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { loginLimiter, registerLimiter } from '../middleware/rateLimiter'
import { loginSchema, registerSchema, refreshSchema, profileSchema } from '../validators/auth.validator'
import * as authService from '../services/auth.service'
import { ok, fail } from '../middleware/response'
import { toSafeUser } from '../types/auth.types'

const router = Router()

// ===== POST /login =====
router.post('/login', loginLimiter, validate(loginSchema), async (req, res) => {
  const result = await authService.login(req.body)
  if ('error' in result) return fail(res, result.error)

  const { user } = result
  const accessToken = signAccessToken({ userId: user.id, role: user.role })
  const refreshToken = await authService.createRefreshToken(user.id)
  return ok(res, { accessToken, refreshToken, user }, '登录成功')
})

// ===== POST /register =====
router.post('/register', registerLimiter, validate(registerSchema), async (req, res) => {
  const result = await authService.register(req.body)
  if ('error' in result) return fail(res, result.error)

  const { user } = result
  const accessToken = signAccessToken({ userId: user.id, role: user.role })
  const refreshToken = await authService.createRefreshToken(user.id)
  return ok(res, { accessToken, refreshToken, user }, '注册成功')
})

// ===== POST /refresh =====
router.post('/refresh', validate(refreshSchema), async (req, res) => {
  const userId = await authService.consumeRefreshToken(req.body.refreshToken)
  if (!userId) return fail(res, '登录已过期，请重新登录', 401)

  const user = await authService.findUserById(userId)
  if (!user) return fail(res, '用户不存在', 404)

  const accessToken = signAccessToken({ userId: user.id, role: user.role })
  const refreshToken = await authService.createRefreshToken(user.id)

  return ok(res, { accessToken, refreshToken })
})

// ===== GET /me =====
router.get('/me', authRequired, async (req, res) => {
  const user = await authService.findUserById(req.currentUser!.userId)
  if (!user) return fail(res, '用户不存在', 404)

  return ok(res, toSafeUser(user))
})

// ===== GET /students — 学生列表（需登录）=====
router.get('/students', authRequired, async (_req, res) => {
  return ok(res, await authService.getStudents())
})

// ===== PUT /profile =====
router.put('/profile', authRequired, validate(profileSchema), async (req, res) => {
  const user = await authService.updateProfile(req.currentUser!.userId, req.body)
  if (!user) return fail(res, '用户不存在', 404)
  return ok(res, user, '修改成功')
})

export default router
