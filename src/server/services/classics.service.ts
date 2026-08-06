import { classicsData } from '../../data/classics'
import type { Classic, Volume, Chapter } from '../../types'

/** 获取典籍列表（带筛选和分页） */
export function listClassics(params: {
  dimension?: string
  academy?: string
  genre?: string
  schoolLevel?: string
  keyword?: string
  page?: number
  pageSize?: number
}) {
  let list = [...classicsData]
  const { dimension, academy, genre, schoolLevel, keyword, page = 1, pageSize = 20 } = params

  if (dimension) {
    const dims = dimension.split(',')
    list = list.filter(c => c.dimensions.some(d => dims.includes(d)))
  }
  if (academy) {
    const acs = academy.split(',')
    list = list.filter(c => acs.includes(c.academySource))
  }
  if (genre) {
    const gens = genre.split(',')
    list = list.filter(c => gens.includes(c.genre))
  }
  if (schoolLevel) {
    const levels = schoolLevel.split(',')
    list = list.filter(c => c.schoolLevel.some(l => levels.includes(l)))
  }
  if (keyword) {
    const kw = keyword.toLowerCase()
    list = list.filter(c =>
      c.name.includes(kw) ||
      c.author.includes(kw) ||
      c.description.includes(kw)
    )
  }

  // 默认按热度排序
  list.sort((a, b) => b.popularity - a.popularity)

  const total = list.length
  const start = (page - 1) * pageSize
  const paged = list.slice(start, start + pageSize)

  return { list: paged, total, page, pageSize }
}

/** 获取典籍详情 */
export function getClassicDetail(id: string): Classic | null {
  return classicsData.find(c => c.id === id) ?? null
}

/** 获取章节内容 */
export function getChapter(classicId: string, chapterId: string): { classic: Classic; volume: Volume; chapter: Chapter } | null {
  const classic = classicsData.find(c => c.id === classicId)
  if (!classic) return null
  for (const vol of classic.chapters) {
    const ch = vol.chapters.find(c => c.id === chapterId)
    if (ch) return { classic, volume: vol, chapter: ch }
  }
  return null
}

/** 全文搜索 */
export function searchClassics(keyword: string) {
  if (!keyword.trim()) return []
  const kw = keyword.toLowerCase()
  const results: { type: 'classic' | 'chapter'; classicId: string; classicName: string; chapterId?: string; chapterTitle?: string; matchContent: string }[] = []

  for (const classic of classicsData) {
    if (classic.name.includes(kw) || classic.description.includes(kw)) {
      results.push({ type: 'classic', classicId: classic.id, classicName: classic.name, matchContent: classic.description.slice(0, 80) })
    }
    for (const vol of classic.chapters) {
      for (const ch of vol.chapters) {
        if (ch.title.includes(kw) || ch.content.original.includes(kw)) {
          results.push({ type: 'chapter', classicId: classic.id, classicName: classic.name, chapterId: ch.id, chapterTitle: ch.title, matchContent: ch.content.original.slice(0, 80) })
        }
      }
    }
  }
  return results.slice(0, 20)
}
