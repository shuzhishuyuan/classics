import rateLimit from 'express-rate-limit'

/** 登录接口限流：每个 IP 每分钟最多 5 次 */
export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 429,
    message: '登录尝试过于频繁，请 1 分钟后再试',
    data: null,
  },
})

/** 注册接口限流：每个 IP 每分钟最多 3 次 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 429,
    message: '注册过于频繁，请 1 分钟后再试',
    data: null,
  },
})
