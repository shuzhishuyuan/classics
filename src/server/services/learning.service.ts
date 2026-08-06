import db from '../db/connection'
import { classicsData } from '../../data/classics'
import { toSafeUser } from '../types/auth.types'

// ===== 收藏 =====
export function toggleClassicFavorite(userId: string, classicId: string): boolean {
  const row = db.prepare('SELECT 1 FROM classic_favorites WHERE user_id=? AND classic_id=?').get(userId, classicId)
  if (row) {
    db.prepare('DELETE FROM classic_favorites WHERE user_id=? AND classic_id=?').run(userId, classicId)
    return false // 已取消
  }
  db.prepare('INSERT OR IGNORE INTO classic_favorites (user_id, classic_id) VALUES (?, ?)').run(userId, classicId)
  return true // 已收藏
}

export function getClassicFavorites(userId: string) {
  return (db.prepare('SELECT classic_id FROM classic_favorites WHERE user_id=? ORDER BY created_at DESC').all(userId) as { classic_id: string }[])
    .map(r => classicsData.find(c => c.id === r.classic_id)).filter(Boolean)
}

// ===== 加入学习 =====
export function toggleEnroll(userId: string, classicId: string): boolean {
  const row = db.prepare('SELECT 1 FROM user_enrolled WHERE user_id=? AND classic_id=?').get(userId, classicId)
  if (row) {
    db.prepare('DELETE FROM user_enrolled WHERE user_id=? AND classic_id=?').run(userId, classicId)
    return false
  }
  db.prepare('INSERT OR IGNORE INTO user_enrolled (user_id, classic_id) VALUES (?, ?)').run(userId, classicId)
  return true
}

export function getEnrolled(userId: string) {
  const rows = db.prepare('SELECT classic_id FROM user_enrolled WHERE user_id=? ORDER BY created_at DESC').all(userId) as { classic_id: string }[]
  return rows.map(r => {
    const classic = classicsData.find(c => c.id === r.classic_id)
    if (!classic) return null
    const total = classic.chapters.reduce((s, v) => s + v.chapters.length, 0)
    const done = (db.prepare('SELECT COUNT(*) as cnt FROM reading_progress WHERE user_id=? AND classic_id=?').get(userId, r.classic_id) as { cnt: number }).cnt
    const progress = total > 0 ? Math.round((done / total) * 100) : 0
    return { ...classic, progress, totalChapters: total, readChapters: done }
  }).filter(Boolean)
}

// ===== 阅读进度 =====
export function saveProgress(userId: string, classicId: string, chapterId: string) {
  db.prepare(`INSERT OR REPLACE INTO reading_progress (user_id, classic_id, chapter_id, progress, updated_at)
    VALUES (?, ?, ?, 100, datetime('now'))`).run(userId, classicId, chapterId)
}

export function getProgress(userId: string, classicId?: string) {
  let sql = 'SELECT * FROM reading_progress WHERE user_id=?'
  const params: string[] = [userId]
  if (classicId) { sql += ' AND classic_id=?'; params.push(classicId) }
  return db.prepare(sql).all(...params)
}

// ===== 统计 =====
export function getLearningStats(userId: string) {
  const enrolled = (db.prepare('SELECT COUNT(*) as cnt FROM user_enrolled WHERE user_id=?').get(userId) as { cnt: number }).cnt
  const completed = (db.prepare('SELECT COUNT(DISTINCT classic_id) as cnt FROM reading_progress WHERE user_id=?').get(userId) as { cnt: number }).cnt
  const notes = (db.prepare('SELECT COUNT(*) as cnt FROM user_notes WHERE user_id=?').get(userId) as { cnt: number }).cnt
  const recitations = (db.prepare('SELECT COUNT(*) as cnt FROM recitations WHERE user_id=?').get(userId) as { cnt: number }).cnt
  const discussions = (db.prepare('SELECT COUNT(*) as cnt FROM discussions WHERE user_id=?').get(userId) as { cnt: number }).cnt
  const replies = (db.prepare('SELECT COUNT(*) as cnt FROM discussion_replies WHERE user_id=?').get(userId) as { cnt: number }).cnt
  return {
    enrolledClassics: enrolled,
    completedClassics: completed,
    noteCount: notes,
    recitationCount: recitations,
    discussionCount: discussions + replies,
  }
}
