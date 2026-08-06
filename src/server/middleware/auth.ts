import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { JwtPayload } from '../types/auth.types'

const JWT_SECRET = process.env.JWT_SECRET || 'shuyuan-dev-secret-2024'
const ACCESS_EXPIRES = '15min'

/** 签出 accessToken */
export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES })
}

// 扩展 Express Request
declare global {
  namespace Express {
    interface Request {
      currentUser?: JwtPayload
    }
  }
}

/** 必须登录 */
export function authRequired(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '请先登录', data: null })
  }

  try {
    req.currentUser = jwt.verify(header.slice(7), JWT_SECRET) as JwtPayload
    next()
  } catch {
    return res.status(401).json({ code: 401, message: '登录已过期，请重新登录', data: null })
  }
}
