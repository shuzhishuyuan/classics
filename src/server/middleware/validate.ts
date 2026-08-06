import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'

/** Zod 校验中间件工厂 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const issues = (result.error as any).issues || (result.error as any).errors || []
      const message = issues.length > 0 ? issues[0].message : '参数校验失败'
      return res.status(400).json({
        code: 400,
        message,
        data: null,
      })
    }
    req.body = result.data
    next()
  }
}
