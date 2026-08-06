import type { Response } from 'express'

/** 统一成功响应 */
export function ok(res: Response, data: unknown = null, message = 'ok') {
  return res.json({ code: 200, message, data })
}

/** 分页响应 */
export function paginated(
  res: Response,
  list: unknown[],
  total: number,
  page: number,
  pageSize: number,
) {
  return res.json({
    code: 200,
    message: 'ok',
    data: { list, total, page, pageSize },
  })
}

/** 业务错误 */
export function fail(res: Response, message: string, code = 400) {
  return res.status(code).json({ code, message, data: null })
}
