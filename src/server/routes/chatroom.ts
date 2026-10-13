import { Router } from 'express'
import { authRequired } from '../middleware/auth'
import { ok, fail } from '../middleware/response'
import * as chatroom from '../services/chatroom.service'

const router = Router()

// POST /chatroom/join — 加入房间（带昵称和房间标识）
router.post('/join', authRequired, (req, res) => {
  const { name, room = 'chat' } = req.body as { name?: string; room?: string }
  if (!name?.trim()) return fail(res, '请输入昵称')
  const onlineCount = chatroom.joinChatroom(room, req.currentUser!.userId, name)
  return ok(res, { onlineCount }, '已进入房间')
})

// POST /chatroom/leave — 离开房间
router.post('/leave', authRequired, (req, res) => {
  const { room = 'chat' } = req.body as { room?: string }
  const onlineCount = chatroom.leaveChatroom(room, req.currentUser!.userId)
  return ok(res, { onlineCount }, '已离开房间')
})

// GET /chatroom/online — 获取房间在线人数和用户列表
router.get('/online', (req, res) => {
  const room = (req.query.room as string) || 'chat'
  const users = chatroom.getOnlineUsers(room).map(u => ({ id: u.id, name: u.name }))
  return ok(res, { onlineCount: users.length, users })
})

export default router
