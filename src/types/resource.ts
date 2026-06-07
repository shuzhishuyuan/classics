/**
 * 资源共享模块 - 类型定义
 * 涵盖名师微课、教师备课、学生学习、亲子共读四大资源板块
 */

import type { SchoolLevel, AcademySource } from './index'

// ===== 资源分类 =====

/** 四大资源专题 */
export type ResourceCategory =
  | '名师微课'
  | '教师备课'
  | '学生学习'
  | '亲子共读'

/** 资源介质类型 */
export type ResourceType =
  | '视频'
  | '教案'
  | '课件'
  | '试题'
  | '图文'
  | '音频'
  | '任务单'
  | '活动方案'
  | '操作手册'

/** 微课专题标签 */
export type CourseTopic =
  | '书院历史'
  | '学规解读'
  | '先贤精神'
  | '经典导读'

/** 教师备课资源类型 */
export type PrepResourceType =
  | '精品教案'
  | '教学课件'
  | '同步检测试题'
  | '主题班会设计'
  | '研学活动手册'

/** 适用学科 */
export type Subject =
  | '语文'
  | '历史'
  | '道德与法治'
  | '综合实践活动'
  | '校本课程'

/** 共读方式 */
export type ReadingMethod =
  | '亲子共读'
  | '家长导读'
  | '学生自读+家长点评'
  | '角色扮演'

/** 家庭场景 */
export type FamilyScenario =
  | '睡前共读'
  | '周末书房'
  | '假期研学'
  | '日常熏陶'
  | '节日专题'

// ===== 核心资源类型 =====

export interface ResourceItem {
  id: string
  title: string
  category: ResourceCategory
  subCategory?: string
  type: ResourceType | PrepResourceType | string
  stage: SchoolLevel | SchoolLevel[]
  subject?: Subject | string
  duration?: string
  teacher?: string
  academySource?: AcademySource | string
  format?: string
  tags: string[]
  description: string
  downloads?: number
  rating?: number
  updatedAt?: string
  isFavorite?: boolean
  coverEmoji?: string
  /** 微课特有 */
  courseTopic?: CourseTopic
  hasDownload?: boolean
  hasExercise?: boolean
  /** 亲子共读特有 */
  familyScenario?: FamilyScenario
  readingMethod?: ReadingMethod
  /** 学习资源特有 */
  learningTime?: string
}

// ===== 文化拓展（五大书院地域文化） =====

export interface AcademyCulture {
  id: string
  academyName: AcademySource
  location: string
  history: string
  folkCustoms: string[]
  intangibleHeritage: string[]
  digitalCases: DigitalCase[]
  localResources: LocalResource[]
}

export interface DigitalCase {
  title: string
  description: string
  techType: 'VR/AR' | '3D建模' | '互动H5' | '数字展厅' | 'AI导览'
  url?: string
}

export interface LocalResource {
  title: string
  type: '地域历史' | '民俗风情' | '非遗传承' | '数智化案例'
  description: string
  coverEmoji: string
}

// ===== 筛选/搜索 =====

export interface ResourceFilters {
  category: ResourceCategory | '全部'
  stage: SchoolLevel | ''
  type: string
  subject: string
  courseTopic: CourseTopic | ''
  keyword: string
}
