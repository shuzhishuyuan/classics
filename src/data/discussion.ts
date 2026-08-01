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

export type DebateDirection = '修身立德' | '勤学善思' | '家国担当' | '社会观察'
export type CreationTrack = '经典解读' | '诗词创作' | '书画作品' | '文脉故事'

export interface CampOption {
  id: string
  name: string
  thesis: string
  votes: number
}

export interface ClassicSeminar {
  id: string
  title: string
  source: string
  academy: string
  summary: string
  scene: string
  camps: CampOption[]
  teacherComment: string
  featuredViews: string[]
}

export interface DebateTopic {
  id: string
  direction: DebateDirection
  schoolLevel: string
  title: string
  prompt: string
  guidingQuestions: string[]
  evidence: string[]
}

export interface RitualTask {
  id: string
  title: string
  context: string
  duration: string
  steps: string[]
  evidenceHint: string
}

export interface CreationWork {
  id: string
  track: CreationTrack
  title: string
  author: string
  role: '学生' | '教师' | '亲子'
  excerpt: string
  likes: number
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
    title: '朱张会讲：为学当如何用功？',
    source: '岳麓书院',
    academy: '岳麓书院',
    summary: '以朱熹、张栻讲论为原型，引导学生理解“讲明义理、切己体察”的书院会讲精神。',
    scene: '讲堂中，两位先生围绕读书次第、修身工夫与实践养成展开问难，学生需要选择自己的理解立场。',
    camps: [
      { id: 'principle', name: '先明义理', thesis: '读书应先把经典中的道理辨清，再落实到日常行动。', votes: 36 },
      { id: 'practice', name: '先从实践', thesis: '学习不能停在理解，要从今日可做的一件小事开始体认。', votes: 29 },
    ],
    teacherComment:
      '两种立场并非对立。书院会讲强调“讲”与“行”相互照亮，学生表达观点时要能回到文本，也能联系生活。',
    featuredViews: [
      '我支持“先明义理”，因为不理解为什么做，就容易把修身变成形式。',
      '我支持“先从实践”，每天整理书桌、按时完成阅读，本身就是治学工夫。',
    ],
  },
  {
    id: 'ehu',
    title: '鹅湖之会：读书是求同还是存异？',
    source: '鹅湖书院会讲传统',
    academy: '跨书院专题',
    summary: '借历史上的学术论辩，训练学生尊重差异、依据经典和事实表达观点。',
    scene: '不同学派围绕修养路径展开讨论。学生需要判断：共同目标重要，还是保留方法差异更重要？',
    camps: [
      { id: 'common', name: '求其共同', thesis: '会讲应先找到共同的育人目标，再讨论方法差异。', votes: 41 },
      { id: 'difference', name: '尊重差异', thesis: '真正的讨论要允许不同路径并存，才能激发思辨。', votes: 34 },
    ],
    teacherComment:
      '会讲的价值不在“谁赢”，而在把理由说清楚、把证据摆出来、把对方观点听进去。',
    featuredViews: [
      '如果只追求一致，可能会忽略每个人学习方式不同。',
      '先确认共同目标，讨论才不会变成互相否定。',
    ],
  },
]

export const debateDirections: DebateDirection[] = ['修身立德', '勤学善思', '家国担当', '社会观察']

export const debateTopics: DebateTopic[] = [
  {
    id: 'profit-righteousness',
    direction: '修身立德',
    schoolLevel: '初中',
    title: '面对个人利益与班级规则冲突时，应如何取舍？',
    prompt: '从书院“义利之辨”出发，讨论现代校园生活中的选择。',
    guidingQuestions: ['什么是“义”？', '规则是否一定高于个人方便？', '有没有兼顾双方的办法？'],
    evidence: ['《白鹿洞书院揭示》强调“义利之辨”。', '班级公约体现共同生活中的相互尊重。'],
  },
  {
    id: 'learning-method',
    direction: '勤学善思',
    schoolLevel: '小学高段',
    title: '背诵经典时，记住原文和理解意思哪个更重要？',
    prompt: '联系诵读、注释、讨论三种学习方式，形成自己的学习建议。',
    guidingQuestions: ['只背不懂会有什么问题？', '先懂再背会不会降低韵味？', '如何安排学习顺序？'],
    evidence: ['朱子读书法重视熟读精思。', '现有经典研习模块提供原文、译文和文化解读。'],
  },
  {
    id: 'family-country',
    direction: '家国担当',
    schoolLevel: '初中',
    title: '“先天下之忧而忧”对今天的中学生意味着什么？',
    prompt: '从范仲淹与应天书院故事出发，把家国情怀转化为可实践的小行动。',
    guidingQuestions: ['中学生能承担哪些责任？', '关心公共事务是否离我们很远？', '如何避免空喊口号？'],
    evidence: ['范仲淹少时在应天书院苦学。', '家国情怀可以体现在社区服务、环境保护和同伴互助中。'],
  },
  {
    id: 'digital-culture',
    direction: '社会观察',
    schoolLevel: '高中',
    title: '传统文化数字化会让文化更鲜活，还是更碎片化？',
    prompt: '结合数智化书院 App 的设计，评价技术对文化传承的作用。',
    guidingQuestions: ['数字化解决了哪些问题？', '碎片化风险来自哪里？', '怎样让技术服务育人目标？'],
    evidence: ['申报书提出避免技术与文化简单拼接。', '会讲互动把观看转化为表达、论证和反馈。'],
  },
]

export const ritualTasks: RitualTask[] = [
  {
    id: 'respect-teacher',
    title: '尊师礼',
    context: '课前、请教问题、活动汇报等校园场景。',
    duration: '3天实践',
    steps: ['课前整理桌面和学习材料', '提问前先说明自己已经思考的部分', '课后用一句话记录老师建议'],
    evidenceHint: '上传一段实践记录或填写今日反思。',
  },
  {
    id: 'gratitude',
    title: '感恩礼',
    context: '家庭共育与亲子共读场景。',
    duration: '1周实践',
    steps: ['选择一则先贤家风故事共读', '向家人表达一次具体感谢', '共同完成一张家庭修身任务卡'],
    evidenceHint: '上传亲子共读照片占位或填写共读心得。',
  },
  {
    id: 'growth',
    title: '成长礼',
    context: '班级主题活动或学期成长总结。',
    duration: '主题活动',
    steps: ['写下一个需要改进的习惯', '邀请同伴给出一条建议', '一周后回看并更新行动记录'],
    evidenceHint: '提交成长承诺和复盘记录。',
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
    title: '从“博学之”看我的学习计划',
    author: '初二学生 林同学',
    role: '学生',
    excerpt: '我把“博学、审问、慎思、明辨、笃行”拆成五个学习动作，用来复盘每周的阅读。',
    likes: 28,
  },
  {
    id: 'work-2',
    track: '诗词创作',
    title: '岳麓晨读',
    author: '语文教师 陈老师',
    role: '教师',
    excerpt: '晨钟入林薄，书声过石栏。少年知问道，风露满青衫。',
    likes: 35,
  },
  {
    id: 'work-3',
    track: '书画作品',
    title: '道南正脉临摹卡',
    author: '亲子共创 周同学家庭',
    role: '亲子',
    excerpt: '用书法临摹配合文字说明，理解岳麓书院“道南正脉”的文化含义。',
    likes: 19,
  },
  {
    id: 'work-4',
    track: '文脉故事',
    title: '程门立雪新讲',
    author: '初一学生 何同学',
    role: '学生',
    excerpt: '我把尊师重道理解为认真倾听、及时回应和带着准备去请教。',
    likes: 22,
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
        content: '关于"传统文化数字化会让文化更鲜活，还是更碎片化"，请同学们结合我们使用这个 App 的体验来谈谈看法。',
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
