import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { authRequired } from '../middleware/auth'
import { ok, fail } from '../middleware/response'
import rateLimit from 'express-rate-limit'
import db from '../db/connection'

const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { code: 429, message: '上传过于频繁，请稍后再试', data: null },
})

const UPLOAD_DIR = path.resolve(process.cwd(), 'server', 'data', 'uploads')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${uuidv4()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      // 文档
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      // 视频
      'video/mp4',
      // 音频
      'audio/mpeg',
      'audio/wav',
      'audio/webm',
      // 图片
      'image/jpeg',
      'image/png',
      'image/webp',
    ]
    // 也允许通过扩展名识别（部分浏览器 MIME 不准）
    const ext = file.originalname.split('.').pop()?.toLowerCase()
    const extAllowed = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'mp4', 'mp3', 'wav', 'jpg', 'jpeg', 'png', 'webp']

    if (allowed.includes(file.mimetype) || (ext && extAllowed.includes(ext))) {
      cb(null, true)
    } else {
      cb(new Error(`不支持的文件类型: ${file.mimetype} (.${ext})`))
    }
  },
})

const router = Router()

// POST /upload — 上传文件
router.post('/upload', authRequired, uploadLimiter, upload.single('file'), (req, res) => {
  if (!req.file) return fail(res, '请选择文件')

  const id = uuidv4()
  const url = `/uploads/${req.file.filename}`
  db.prepare('INSERT INTO uploaded_files (id, user_id, filename, mimetype, size, url) VALUES (?,?,?,?,?,?)')
    .run(id, req.currentUser!.userId, req.file.originalname, req.file.mimetype, req.file.size, url)

  return ok(res, { id, filename: req.file.originalname, size: req.file.size, url })
})

// multer 错误处理
router.use((err: any, _req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') return fail(res, '文件大小不能超过 100MB')
    return fail(res, `上传错误: ${err.message}`)
  }
  if (err) return fail(res, err.message || '上传失败')
  next()
})

export default router
