import db from '../db/connection'
import { v4 as uuidv4 } from 'uuid'
/** 预置演示讨论 */
export function seedDiscussions() {
  const count = (db.prepare('SELECT COUNT(*) as cnt FROM discussions').get() as { cnt: number }).cnt
  if (count > 0) return

  const stu = db.prepare("SELECT * FROM users WHERE phone='13800000001'").get() as any
  const stu2 = db.prepare("SELECT * FROM users WHERE phone='13800000002'").get() as any
  if (!stu || !stu2) return

  const topics = [
    {
      classicId: 'bailu-dong', topic: '"循序而致精"在今天还有意义吗？',
      content: '朱熹说的"未得乎前，则不敢求其后"，在信息爆炸的时代，我们还能做到这样精读一本书吗？想听听大家的看法。',
      replies: ['我觉得在读书时仍然适用，但刷手机看资讯时可能就不太现实了。', '现代人需要区分"精读"和"泛读"，两种方法各有适用的场景。'],
    },
    {
      classicId: 'yuelu-xuegui', topic: '岳麓学规中你最认可哪一条？',
      content: '十八条学规里，我最喜欢"读书必须过笔"这一条。不动笔墨不读书，做笔记真的能加深理解。大家觉得呢？',
      replies: ['"时常省问父母"这一条让我很感动，提醒我们不要忘记关心家人。', '"夜读仍戒晏起"——古人就知道熬夜后不能赖床了！'],
    },
    {
      classicId: 'yuelou-ji', topic: '你觉得"先忧后乐"在现代社会还适用吗？',
      content: '范仲淹说"先天下之忧而忧，后天下之乐而乐"，有人认为太高要求不现实，你怎么看？',
      replies: ['不一定非要"天下"，但关心集体、先人后己的精神还是值得提倡的。', '我觉得在团队合作中，"先忧后乐"体现的就是一种责任担当。'],
    },
  ]

  const insertDisc = db.prepare('INSERT INTO discussions (id, user_id, classic_id, topic, content) VALUES (?,?,?,?,?)')
  const insertReply = db.prepare('INSERT INTO discussion_replies (id, discussion_id, user_id, content) VALUES (?,?,?,?)')

  for (const t of topics) {
    const discId = uuidv4()
    insertDisc.run(discId, stu.id, t.classicId, t.topic, t.content)
    // 不同人回复
    const repliers = [stu2, stu]
    for (let i = 0; i < t.replies.length; i++) {
      insertReply.run(uuidv4(), discId, repliers[i].id, t.replies[i])
    }
  }
  console.log(`  💬 已预置 ${topics.length} 条演示讨论`)
}

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
