import { get, post, put, del } from '../hooks/useApi'
// Note: need to add del to useApi

export function createNote(data: { classicId: string; chapterId?: string; content: string; isPublic?: boolean }) {
  return post('/notes', data)
}

export function fetchNotes(classicId?: string) {
  const qs = classicId ? `?classicId=${classicId}` : ''
  return get(`/notes${qs}`)
}

export function updateNote(id: string, data: { content?: string; isPublic?: boolean }) {
  return put(`/notes/${id}`, data)
}

export function deleteNote(id: string) {
  return del(`/notes/${id}`)
}
