import db from '../db/connection'
import { v4 as uuidv4 } from 'uuid'

export interface RecitationRow {
  id: string; user_id: string; classic_id: string; chapter_id: string | null
  audio_url: string | null; duration: number; created_at: string
}

export function createRecitation(userId: string, data: { classicId: string; chapterId?: string; audioUrl?: string; duration?: number }) {
  const id = uuidv4()
  db.prepare('INSERT INTO recitations (id, user_id, classic_id, chapter_id, audio_url, duration) VALUES (?,?,?,?,?,?)')
    .run(id, userId, data.classicId, data.chapterId || null, data.audioUrl || null, data.duration || 0)
  return db.prepare('SELECT * FROM recitations WHERE id=?').get(id) as RecitationRow
}

export function getMyRecitations(userId: string) {
  return db.prepare('SELECT * FROM recitations WHERE user_id=? ORDER BY created_at DESC').all(userId) as RecitationRow[]
}

export function getRecitationList() {
  return db.prepare('SELECT * FROM recitations ORDER BY created_at DESC LIMIT 50').all() as RecitationRow[]
}

export function toggleRecitationLike(userId: string, recitationId: string): boolean {
  const row = db.prepare('SELECT 1 FROM recitation_likes WHERE user_id=? AND recitation_id=?').get(userId, recitationId)
  if (row) {
    db.prepare('DELETE FROM recitation_likes WHERE user_id=? AND recitation_id=?').run(userId, recitationId)
    return false
  }
  db.prepare('INSERT OR IGNORE INTO recitation_likes (user_id, recitation_id) VALUES (?, ?)').run(userId, recitationId)
  return true
}

export function getRecitationLikeCount(recitationId: string): number {
  return (db.prepare('SELECT COUNT(*) as cnt FROM recitation_likes WHERE recitation_id=?').get(recitationId) as { cnt: number }).cnt
}
