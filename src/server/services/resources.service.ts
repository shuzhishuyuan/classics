import { allResources, featuredCoursesData, teacherPrepData, studentLearningData, parentChildReadingData } from '../../data/resourceMockData'
import type { ResourceItem } from '../../types/resource'

const categoryMap: Record<string, ResourceItem[]> = {
  '名师微课': featuredCoursesData,
  '教师备课': teacherPrepData,
  '学生学习': studentLearningData,
  '亲子共读': parentChildReadingData,
}

/** 获取资源列表 */
export function listResources(params: {
  category?: string
  stage?: string
  type?: string
  subject?: string
  courseTopic?: string
  keyword?: string
  page?: number
  pageSize?: number
}) {
  let list = params.category ? (categoryMap[params.category] || allResources) : allResources
  const { stage, type, subject, courseTopic, keyword, page = 1, pageSize = 20 } = params

  if (stage) {
    list = list.filter(r => {
      const stages = Array.isArray(r.stage) ? r.stage : [r.stage]
      return stages.includes(stage as any)
    })
  }
  if (type) list = list.filter(r => r.type === type)
  if (subject) list = list.filter(r => r.subject === subject)
  if (courseTopic) list = list.filter(r => (r as any).courseTopic === courseTopic)
  if (keyword) {
    const kw = keyword.toLowerCase()
    list = list.filter(r => r.title.includes(kw) || r.description.includes(kw) || r.tags.some(t => t.includes(kw)))
  }

  const total = list.length
  const start = (page - 1) * pageSize
  return { list: list.slice(start, start + pageSize), total, page, pageSize }
}

/** 获取资源详情 */
export function getResourceDetail(id: string): ResourceItem | null {
  return allResources.find(r => r.id === id) ?? null
}

/** 获取分类统计 */
export function getCategoryStats() {
  return {
    '名师微课': featuredCoursesData.length,
    '教师备课': teacherPrepData.length,
    '学生学习': studentLearningData.length,
    '亲子共读': parentChildReadingData.length,
  }
}
