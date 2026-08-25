import type { IconType } from 'react-icons'
import {
  FaBalanceScale,
  FaBookOpen,
  FaHandsHelping,
  FaLeaf,
  FaPaintBrush,
  FaPenNib,
  FaSchool,
  FaUsers,
} from 'react-icons/fa'
import type { Discussion } from '../types'

export type CreationTrack = '经典解读' | '诗词创作' | '书画作品' | '文脉故事'

export interface CampOption {
  id: string
  name: string
}

export interface ClassicSeminar {
  id: string
  title: string
  background: string
  question: string
  camps: CampOption[]
  hints: string[]
}

export interface DebateTopic {
  id: string
  schoolLevel: string
  title: string
  context: string
  task: string
  materials: string[]
}

export interface RitualTask {
  id: string
  title: string
  description: string
}

export interface CreationWork {
  id: string
  track: CreationTrack
  title: string
  author: string
  excerpt: string
}

export interface DiscussionMenuItem {
  id: string
  label: string
  icon: IconType
}

export const discussionMenu: DiscussionMenuItem[] = [
  { id: 'classic-seminar', label: '经典会讲', icon: FaSchool },
  { id: 'debate-lab', label: '思辨论辩', icon: FaBalanceScale },
  { id: 'ritual-practice', label: '礼仪习养', icon: FaHandsHelping },
  { id: 'co-creation', label: '师生共创', icon: FaUsers },
]

export const classicSeminars: ClassicSeminar[] = [
  {
    id: 'zhu-zhang',
    title: '朱张会讲：读书与践行，哪一个应该在前？',
    background: '朱熹与张栻围绕读书、修身与实践展开讨论。面对同一个问题，他们对学习次序和方法有不同侧重。',
    question: '理解一个道理之后再去行动，还是先从行动中逐渐理解？',
    camps: [
      { id: 'understand-first', name: '先理解，再行动' },
      { id: 'practice-first', name: '在行动中理解' },
    ],
    hints: [
      '先理解、再行动的一方，容易忽略：有些道理只有做了才真正明白。',
      '在行动中理解的一方，容易忽略：没有基本理解，行动可能走偏。',
    ],
  },
  {
    id: 'ehu',
    title: '鹅湖之会：学习方法需要统一吗？',
    background: '面对不同的读书和修养方法，参与者需要判断是否有必要统一学习方法。',
    question: '共同目标是否意味着必须采用相同路径？',
    camps: [
      { id: 'common-principle', name: '应先找到共同原则' },
      { id: 'keep-different', name: '可以保留不同路径' },
    ],
    hints: [
      '追求共同原则的一方，容易忽略：不同人的起点和节奏并不相同。',
      '保留不同路径的一方，容易忽略：完全没有共同方向，讨论会各说各话。',
    ],
  },
]

export const debateTopics: DebateTopic[] = [
  {
    id: 'profit-righteousness',
    schoolLevel: '初中',
    title: '面对个人利益与班级规则冲突时，应如何取舍？',
    context: '从书院“义利之辨”出发，讨论现代校园生活中的选择。',
    task: '选择一种立场，至少提出一条理由，并回应一条不同意见。',
    materials: ['什么是“义”，什么是“利”', '规则是否一定高于个人方便', '有没有兼顾双方的办法'],
  },
  {
    id: 'learning-method',
    schoolLevel: '小学高段',
    title: '背诵经典时，记住原文和理解意思哪个更重要？',
    context: '联系诵读、注释、讨论三种学习方式，形成自己的学习建议。',
    task: '选择一种立场，至少提出一条理由，并回应一条不同意见。',
    materials: ['只背不懂会有什么问题', '先懂再背会不会影响韵味', '如何安排学习顺序'],
  },
  {
    id: 'family-country',
    schoolLevel: '初中',
    title: '“先天下之忧而忧”对今天的中学生意味着什么？',
    context: '从范仲淹与应天书院的故事出发，把家国情怀转化为可实践的小行动。',
    task: '选择一种立场，至少提出一条理由，并回应一条不同意见。',
    materials: ['中学生能承担哪些具体责任', '关心公共事务是否离我们很远', '如何避免空喊口号'],
  },
  {
    id: 'digital-video',
    schoolLevel: '高中',
    title: '把传统文化做成短视频，会帮助理解还是造成误读？',
    context: '越来越多传统文化内容通过短视频、互动展览和数字应用传播。它们降低了接触门槛，但也可能省略必要的历史背景。',
    task: '选择一种立场，至少提出两条理由，并回应一条不同意见。',
    materials: ['数字传播是否扩大了接触人群', '内容压缩是否造成语境缺失', '互动形式是否促进了主动学习', '用户能否继续追溯原始资料'],
  },
]

export const ritualTasks: RitualTask[] = [
  {
    id: 'prepare',
    title: '会讲准备',
    description: '阅读材料后，写下一个真正想弄清楚的问题。',
  },
  {
    id: 'listen-respond',
    title: '倾听回应',
    description: '阅读一位立场不同的同学的观点，先复述对方的理由，再表达不同意见。',
  },
  {
    id: 'summarize',
    title: '讨论整理',
    description: '会讲结束后，记录自己仍然坚持的观点，以及发生改变的地方。',
  },
]

export const creationTracks: { track: CreationTrack; icon: IconType }[] = [
  { track: '经典解读', icon: FaBookOpen },
  { track: '诗词创作', icon: FaPenNib },
  { track: '书画作品', icon: FaPaintBrush },
  { track: '文脉故事', icon: FaLeaf },
]

export const creationWorks: CreationWork[] = [
  {
    id: 'work-1',
    track: '经典解读',
    title: '《朱张会讲》一页导读',
    author: '高二（3）班读书小组',
    excerpt: '我们整理了会讲背景、两种主要观点和仍未解决的三个问题。',
  },
  {
    id: 'work-2',
    track: '书画作品',
    title: '岳麓书院匾额文字整理',
    author: '书法社与历史社共同完成',
    excerpt: '收录匾额文字、出处及含义说明。',
  },
  {
    id: 'work-3',
    track: '诗词创作',
    title: '岳麓晨读（学生习作）',
    author: '初二（1）班 林同学',
    excerpt: '以晨读为题的一首习作，附上对诗中意象的简短说明。',
  },
  {
    id: 'work-4',
    track: '文脉故事',
    title: '程门立雪新讲',
    author: '初一（2）班 何同学',
    excerpt: '把尊师重道理解为认真倾听、及时回应和带着准备去请教。',
  },
]

// ===== 种子讨论数据（评论区种子回复） =====

const now = Date.now()
const DAY = 86400000

export const seedDiscussions: Discussion[] = [
  {
    id: 'disc-classic-seminar',
    sectionId: 'classic-seminar',
    topic: '经典会讲',
    classicId: '',
    initiatorId: 'tch-01',
    createdAt: now - 7 * DAY,
    replies: [
      {
        id: 'reply-001',
        userId: 'tch-01',
        userName: '张明远',
        userAvatar: '👨‍🏫',
        userRole: '教师',
        content: '同学们，朱张会讲的核心是"讲明义理、切己体察"。请大家结合自己的生活，分享对这句话的理解。',
        createdAt: now - 7 * DAY,
      },
      {
        id: 'reply-002',
        userId: 'stu-01',
        userName: '李明轩',
        userAvatar: '🧑‍🎓',
        userRole: '学生',
        content: '我觉得要先理解道理，再去做。如果不知道为什么做，很容易变成走形式。比如我每天背书，如果只背不想，很快就忘了。',
        createdAt: now - 5 * DAY,
      },
      {
        id: 'reply-003',
        userId: 'tch-02',
        userName: '王雅文',
        userAvatar: '👩‍🏫',
        userRole: '教师',
        content: '说得很好！"切己体察"就是要联系自己的实际。同学们可以想一想：这周你在哪件事上做到了"先想清楚再做"？',
        createdAt: now - 4 * DAY,
      },
      {
        id: 'reply-004',
        userId: 'stu-02',
        userName: '张晓雅',
        userAvatar: '👩‍🎓',
        userRole: '学生',
        content: '我在做数学题的时候，以前都是直接套公式。现在我会先想想这个公式是怎么来的，虽然慢一点，但正确率高了。',
        createdAt: now - 3 * DAY,
      },
    ],
  },
  {
    id: 'disc-debate-lab',
    sectionId: 'debate-lab',
    topic: '思辨论辩',
    classicId: '',
    initiatorId: 'tch-03',
    createdAt: now - 6 * DAY,
    replies: [
      {
        id: 'reply-005',
        userId: 'tch-03',
        userName: '陈文博',
        userAvatar: '👨‍🏫',
        userRole: '教师',
        content: '关于"把传统文化做成短视频，会帮助理解还是造成误读"，请同学们结合自己的体验来谈谈看法。',
        createdAt: now - 6 * DAY,
      },
      {
        id: 'reply-006',
        userId: 'stu-03',
        userName: '王子涵',
        userAvatar: '🧑‍🎓',
        userRole: '学生',
        content: '我认为数字化让文化更鲜活了。比如以前读《论语》只能看纸书，现在有原文、译文、解读，还能看到其他人的讨论，理解更深了。',
        createdAt: now - 4 * DAY,
      },
      {
        id: 'reply-007',
        userId: 'stu-01',
        userName: '李明轩',
        userAvatar: '🧑‍🎓',
        userRole: '学生',
        content: '但碎片化也是真的。有时候我只想看一段，结果跳来跳去，反而忘了原本要学什么。所以关键还是看我们自己怎么用。',
        createdAt: now - 3 * DAY,
      },
    ],
  },
  {
    id: 'disc-ritual-practice',
    sectionId: 'ritual-practice',
    topic: '礼仪习养',
    classicId: '',
    initiatorId: 'tch-01',
    createdAt: now - 5 * DAY,
    replies: [
      {
        id: 'reply-008',
        userId: 'tch-01',
        userName: '张明远',
        userAvatar: '👨‍🏫',
        userRole: '教师',
        content: '这周的尊师礼实践，请同学们分享一下：你在课前做了哪些准备？有什么新发现？',
        createdAt: now - 5 * DAY,
      },
      {
        id: 'reply-009',
        userId: 'stu-02',
        userName: '张晓雅',
        userAvatar: '👩‍🎓',
        userRole: '学生',
        content: '我每天上课前先把桌面整理干净，把需要的学习材料摆好。发现这样上课时不容易分心，老师讲的内容也更容易跟上。',
        createdAt: now - 3 * DAY,
      },
      {
        id: 'reply-010',
        userId: 'par-01',
        userName: '李建国',
        userAvatar: '👨‍👩‍👧',
        userRole: '家长',
        content: '作为家长，我在家也试着让孩子在写作业前先整理书桌。短短几天，孩子自己都说"感觉脑子清爽多了"。',
        createdAt: now - 2 * DAY,
      },
    ],
  },
  {
    id: 'disc-co-creation',
    sectionId: 'co-creation',
    topic: '师生共创',
    classicId: '',
    initiatorId: 'tch-02',
    createdAt: now - 4 * DAY,
    replies: [
      {
        id: 'reply-011',
        userId: 'tch-02',
        userName: '王雅文',
        userAvatar: '👩‍🏫',
        userRole: '教师',
        content: '诗词创作赛道收到了几份很不错的作品。大家互相看看，给同学的创作一些鼓励和建议吧。',
        createdAt: now - 4 * DAY,
      },
      {
        id: 'reply-012',
        userId: 'stu-01',
        userName: '李明轩',
        userAvatar: '🧑‍🎓',
        userRole: '学生',
        content: '我特别喜欢《岳麓晨读》那首诗，"晨钟入林薄，书声过石栏"，读起来就像在书院里晨读一样。',
        createdAt: now - 2 * DAY,
      },
      {
        id: 'reply-013',
        userId: 'tch-03',
        userName: '陈文博',
        userAvatar: '👨‍🏫',
        userRole: '教师',
        content: '创作最重要的是真情实感。看到同学们把经典中学到的道理变成自己的文字，这就是最好的学习成果。',
        createdAt: now - 1 * DAY,
      },
    ],
  },
]
