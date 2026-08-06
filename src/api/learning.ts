import { get, post, put } from '../hooks/useApi'

export async function toggleFavorite(classicId: string) {
  return post<{ favorited: boolean }>(`/learning/favorites/${classicId}`)
}

export function fetchFavorites() {
  return get<any[]>('/learning/favorites')
}

export async function toggleEnroll(classicId: string) {
  return post<{ enrolled: boolean }>(`/learning/enroll/${classicId}`)
}

export function fetchEnrolled() {
  return get<any[]>('/learning/enrolled')
}

export async function saveProgress(classicId: string, chapterId: string) {
  return put('/learning/progress', { classicId, chapterId })
}

export function fetchProgress(classicId?: string) {
  const qs = classicId ? `?classicId=${classicId}` : ''
  return get<any[]>(`/learning/progress${qs}`)
}

export function fetchStats() {
  return get<{ enrolledClassics: number; completedClassics: number; noteCount: number; recitationCount: number }>('/learning/stats')
}
