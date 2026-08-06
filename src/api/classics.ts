import { get } from '../hooks/useApi'
import type { Classic, Chapter, Volume } from '../types'

interface ListResult {
  list: Classic[]
  total: number; page: number; pageSize: number
}

interface ChapterResult {
  classic: Classic; volume: Volume; chapter: Chapter
}

export function fetchClassics(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString()
  return get<ListResult>(`/classics${qs ? '?' + qs : ''}`)
}

export function fetchClassicDetail(id: string) {
  return get<Classic>(`/classics/${id}`)
}

export function fetchChapter(classicId: string, chapterId: string) {
  return get<ChapterResult>(`/classics/${classicId}/chapters/${chapterId}`)
}

export function searchClassics(keyword: string) {
  return get<any[]>(`/classics/search?keyword=${encodeURIComponent(keyword)}`)
}
