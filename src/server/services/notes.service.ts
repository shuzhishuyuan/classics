import db from '../db/connection'
import { v4 as uuidv4 } from 'uuid'

export interface NoteRow {
  id: string; user_id: string; classic_id: string; chapter_id: string | null
  content: string; is_public: number; created_at: string; updated_at: string
}

export function createNote(userId: string, data: { classicId: string; chapterId?: string; content: string; isPublic?: boolean }) {
  const id = uuidv4()
  db.prepare('INSERT INTO user_notes (id, user_id, classic_id, chapter_id, content, is_public) VALUES (?,?,?,?,?,?)')
    .run(id, userId, data.classicId, data.chapterId || null, data.content, data.isPublic ? 1 : 0)
  return db.prepare('SELECT * FROM user_notes WHERE id=?').get(id) as NoteRow
}

export function getNotes(userId: string, classicId?: string) {
  let sql = 'SELECT * FROM user_notes WHERE user_id=?'
  const params: string[] = [userId]
  if (classicId) { sql += ' AND classic_id=?'; params.push(classicId) }
  sql += ' ORDER BY updated_at DESC'
  return db.prepare(sql).all(...params) as NoteRow[]
}

export function updateNote(noteId: string, userId: string, data: { content?: string; isPublic?: boolean }) {
  const note = db.prepare('SELECT * FROM user_notes WHERE id=? AND user_id=?').get(noteId, userId) as NoteRow | undefined
  if (!note) return null
  db.prepare("UPDATE user_notes SET content=?, is_public=?, updated_at=datetime('now') WHERE id=?")
    .run(data.content ?? note.content, data.isPublic !== undefined ? (data.isPublic ? 1 : 0) : note.is_public, noteId)
  return db.prepare('SELECT * FROM user_notes WHERE id=?').get(noteId) as NoteRow
}

export function deleteNote(noteId: string, userId: string): boolean {
  const r = db.prepare('DELETE FROM user_notes WHERE id=? AND user_id=?').run(noteId, userId)
  return r.changes > 0
}
