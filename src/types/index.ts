/** ========================================
 * 书院文化教育平台 - 核心类型定义
 * 基于申报书的6大功能模块、5育人维度
 * ======================================== */

// ===== 分类维度 =====

/** 五大育人维度（申报书核心框架） */
export type EducateDimension =
  | '价值引领'
  | '知识建构'
  | '制度规约'
  | '空间叙事'
  | '实践养成'

/** 书院来源 */
export type AcademySource =
  | '白鹿洞书院'
  | '岳麓书院'
  | '石鼓书院'
  | '嵩阳书院'
  | '应天书院'

/** 体裁类型 */
export type GenreType =
  | '学规'
  | '语录'
  | '会讲记录'
  | '碑刻'
  | '文集'

// ===== 内容分级 =====

/** 学段适配（K12） */
export type SchoolLevel = '小学低段' | '小学高段' | '初中' | '高中'

/** 难度等级 */
export type Difficulty = 1 | 2 | 3 | 4 | 5

// ===== 三级内容结构 =====

/** 三级内容呈现：原文 + 白话译文 + 文化解读 */
export interface ContentLevels {
  original: string
  translation?: string
  culturalNote?: string
}

/** 重点标注 */
export interface Annotation {
  id: string
  startChar: number
  endChar: number
  type: 'keyword' | 'phrase' | 'reference'
  note: string
}

/** 章节 */
export interface Chapter {
  id: string
  title: string
  content: ContentLevels
  annotations?: Annotation[]
  audioUrl?: string
  keyConcepts?: string[]
  discussionQuestions?: string[]
}

/** 卷/篇 */
export interface Volume {
  id: string
  title: string
  chapters: Chapter[]
}

/** 典籍 */
export interface Classic {
  id: string
  name: string
  author: string
  dynasty: string
  /** 五大育人维度（可多个） */
  dimensions: EducateDimension[]
  /** 书院来源 */
  academySource: AcademySource
  /** 体裁类型 */
  genre: GenreType
  /** 适配学段 */
  schoolLevel: SchoolLevel[]
  difficulty: Difficulty
  description: string
  coverEmoji: string
  studentCount: number
  chapters: Volume[]
  themeTopics?: string[]
  publishDate: number
  popularity: number
  practiceTasks?: string[]
}

// ===== 筛选/排序 =====

export type FilterTag = '全部' | '最新上线' | '热门推荐' | '本周必读' | '已收藏' | '我的课程'
export type SortOption = '综合' | '热度' | '难度' | '朝代' | '学段'

// ===== 搜索相关 =====

export type SearchResultType = 'classic' | 'chapter' | 'theme' | 'task' | 'note'

export interface SearchResult {
  type: SearchResultType
  classicId?: string
  classicName?: string
  chapterId?: string
  chapterTitle?: string
  matchContent: string
  dimension?: EducateDimension
}

export interface SearchHistoryItem {
  keyword: string
  timestamp: number
}

// ===== 用户相关 =====

export interface ReadingProgress {
  classicId: string
  volumeId: string
  chapterId: string
  lastReadAt: number
  progress: number
}

export interface UserNote {
  id: string
  classicId: string
  chapterId: string
  content: string
  createdAt: number
  updatedAt: number
  isPublic: boolean
}

export interface UserProfile {
  totalLearningMinutes: number
  completedTasks: number
  recitationCount: number
  discussionCount: number
  noteCount: number
  learnedClassics: string[]
  masteredConcepts: string[]
  dimensionDistribution: Record<EducateDimension, number>
}

// ===== 互动功能 =====

export interface Recitation {
  id: string
  userId: string
  classicId: string
  chapterId: string
  audioBlob?: string
  duration: number
  createdAt: number
  likes: number
}

export interface Discussion {
  id: string
  topic: string
  classicId: string
  initiatorId: string
  createdAt: number
  replies: DiscussionReply[]
}

export interface DiscussionReply {
  id: string
  userId: string
  content: string
  createdAt: number
}

export interface PracticeTask {
  id: string
  title: string
  description: string
  dimension: EducateDimension
  relatedClassicId?: string
  examples: string[]
  completedCount: number
}

// ===== 教师/家长相关 =====

export interface TeacherResource {
  id: string
  classicId: string
  type: '课件' | '教学设计' | '活动方案'
  title: string
  description: string
}

export interface FamilyReadingTask {
  id: string
  classicId: string
  chapterId: string
  parentGuide: string
  childActivity: string
  discussionQuestions: string[]
}
