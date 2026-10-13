/**
 * 聊天室/会讲在线用户管理（内存态，重启即清空，演示场景足够）
 * 支持多个房间（聊天室 / 圆桌会讲），按房间隔离在线用户
 */

interface OnlineUser {
  id: string
  name: string
  joinedAt: number
}

const rooms = new Map<string, Map<string, OnlineUser>>()

function getRoom(room: string): Map<string, OnlineUser> {
  if (!rooms.has(room)) rooms.set(room, new Map())
  return rooms.get(room)!
}

/** 加入房间 */
export function joinChatroom(room: string, userId: string, name: string): number {
  getRoom(room).set(userId, { id: userId, name: name.trim() || '匿名', joinedAt: Date.now() })
  return getRoom(room).size
}

/** 离开房间 */
export function leaveChatroom(room: string, userId: string): number {
  getRoom(room).delete(userId)
  return getRoom(room).size
}

/** 获取房间在线用户列表 */
export function getOnlineUsers(room: string): OnlineUser[] {
  return Array.from(getRoom(room).values())
}

/** 获取房间在线人数 */
export function getOnlineCount(room: string): number {
  return getRoom(room).size
}
