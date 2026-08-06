import db from '../db/connection'
import { v4 as uuidv4 } from 'uuid'

export interface DiscussionRow {
  id: string; user_id: string; classic_id: string | null; topic: string; content: string; created_at: string
}
export interface ReplyRow {
  id: string; discussion_id: string; user_id: string; content: string; created_at: string
}

export function createDiscussion(userId: string, data: { classicId?: string; topic: string; content: string }) {
  const id = uuidv4()
  db.prepare('INSERT INTO discussions (id, user_id, classic_id, topic, content) VALUES (?,?,?,?,?)')
    .run(id, userId, data.classicId || null, data.topic, data.content)
  return db.prepare('SELECT * FROM discussions WHERE id=?').get(id) as DiscussionRow
}

export function getDiscussions(classicId?: string) {
  if (classicId) return db.prepare('SELECT * FROM discussions WHERE classic_id=? ORDER BY created_at DESC').all(classicId) as DiscussionRow[]
  return db.prepare('SELECT * FROM discussions ORDER BY created_at DESC LIMIT 50').all() as DiscussionRow[]
}

export function getDiscussionDetail(id: string) {
  const d = db.prepare('SELECT * FROM discussions WHERE id=?').get(id) as DiscussionRow | undefined
  if (!d) return null
  const replies = db.prepare('SELECT * FROM discussion_replies WHERE discussion_id=? ORDER BY created_at ASC').all(id) as ReplyRow[]
  return { ...d, replies }
}

export function createReply(userId: string, discussionId: string, content: string) {
  const id = uuidv4()
  db.prepare('INSERT INTO discussion_replies (id, discussion_id, user_id, content) VALUES (?,?,?,?)')
    .run(id, discussionId, userId, content)
  return db.prepare('SELECT * FROM discussion_replies WHERE id=?').get(id) as ReplyRow
}
