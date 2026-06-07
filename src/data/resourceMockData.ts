/**
 * 资源共享模块 - Mock 数据
 * 涵盖四大资源专题：名师微课、教师备课、学生学习、亲子共读
 * 数据结构方便后续接入真实 API
 */

import type { ResourceItem, AcademyCulture } from '../types/resource'

// ============================================================
// 一、名师微课资源
// ============================================================

export const featuredCoursesData: ResourceItem[] = [
  {
    id: 'course-01',
    title: '白鹿洞书院揭示——朱熹的教育理念',
    category: '名师微课',
    type: '视频',
    stage: ['初中', '高中'],
    duration: '28分钟',
    teacher: '张明远 教授',
    courseTopic: '学规解读',
    tags: ['白鹿洞书院', '朱熹', '学规', '教育理念'],
    description:
      '系统解读《白鹿洞书院揭示》的五大纲领——五教之目、为学之序、修身之要、处事之要、接物之要，深入剖析朱熹"学以成人"的教育哲学思想对当代中小学教育的启示。',
    downloads: 12800,
    rating: 4.8,
    updatedAt: '2025-12-15',
    coverEmoji: '🏛️',
    hasDownload: true,
    hasExercise: true,
  },
  {
    id: 'course-02',
    title: '书院千年——中国古代书院发展史',
    category: '名师微课',
    type: '视频',
    stage: ['小学高段', '初中'],
    duration: '35分钟',
    teacher: '李清华 副教授',
    courseTopic: '书院历史',
    tags: ['书院史', '四大书院', '文化传承', '通识教育'],
    description:
      '从唐代丽正书院到清末书院改制，全景式展现中国古代书院一千三百年的发展历程，重点讲述岳麓、白鹿洞、嵩阳、应天、石鼓五大书院的历史地位与文化贡献。',
    downloads: 9600,
    rating: 4.7,
    updatedAt: '2025-11-20',
    coverEmoji: '⛩️',
    hasDownload: true,
    hasExercise: true,
  },
  {
    id: 'course-03',
    title: '程门立雪与尊师重道——先贤求学精神',
    category: '名师微课',
    type: '视频',
    stage: ['小学低段', '小学高段'],
    duration: '18分钟',
    teacher: '王雅文 特级教师',
    courseTopic: '先贤精神',
    tags: ['程门立雪', '杨时', '尊师重道', '品格教育'],
    description:
      '以"程门立雪"经典故事为主线，讲述杨时、游酢尊师求学的感人事迹，引导学生理解中华传统中尊师重道、谦逊好学的精神品质，培养良好的学习态度。',
    downloads: 15400,
    rating: 4.9,
    updatedAt: '2026-01-10',
    coverEmoji: '❄️',
    hasDownload: true,
    hasExercise: true,
  },
  {
    id: 'course-04',
    title: '《岳阳楼记》精读——先忧后乐的家国情怀',
    category: '名师微课',
    type: '视频',
    stage: ['初中', '高中'],
    duration: '42分钟',
    teacher: '陈文博 高级教师',
    courseTopic: '经典导读',
    tags: ['岳阳楼记', '范仲淹', '家国情怀', '文言文教学'],
    description:
      '逐段解析《岳阳楼记》的文学价值与思想内涵，以"不以物喜，不以己悲"和"先天下之忧而忧，后天下之乐而乐"为核心，探讨范仲淹的家国情怀对当代青少年的启迪。',
    downloads: 18200,
    rating: 4.9,
    updatedAt: '2025-10-08',
    coverEmoji: '🏗️',
    hasDownload: true,
    hasExercise: true,
  },
  {
    id: 'course-05',
    title: '朱子读书法——传统文化中的学习方法论',
    category: '名师微课',
    type: '视频',
    stage: ['初中', '高中'],
    duration: '32分钟',
    teacher: '张明远 教授',
    courseTopic: '经典导读',
    tags: ['朱子读书法', '朱熹', '学习方法', '循序渐进'],
    description:
      '系统讲解"循序渐进、熟读精思、虚心涵泳、切己体察、着紧用力、居敬持志"六大读书法，结合现代学习科学研究，指导学生掌握高效的深度阅读与学习方法。',
    downloads: 13500,
    rating: 4.8,
    updatedAt: '2026-02-20',
    coverEmoji: '📖',
    hasDownload: true,
    hasExercise: true,
  },
  {
    id: 'course-06',
    title: '岳麓书院学规——古代书院的行为规范教育',
    category: '名师微课',
    type: '视频',
    stage: ['小学高段', '初中'],
    duration: '25分钟',
    teacher: '李清华 副教授',
    courseTopic: '学规解读',
    tags: ['岳麓书院', '王文清', '学规', '行为规范'],
    description:
      '深入解读《岳麓书院学规》十八条，从"时常省问父母"到"读书必须过笔"，剖析古代书院如何将德行培养与学习规范融入日常，为当代学校德育提供历史镜鉴。',
    downloads: 8700,
    rating: 4.6,
    updatedAt: '2025-09-15',
    coverEmoji: '📋',
    hasDownload: true,
    hasExercise: true,
  },
  {
    id: 'course-07',
    title: '范仲淹与应天书院——从寒门学子到一代名臣',
    category: '名师微课',
    type: '视频',
    stage: ['小学高段', '初中'],
    duration: '22分钟',
    teacher: '王雅文 特级教师',
    courseTopic: '先贤精神',
    tags: ['范仲淹', '应天书院', '励志故事', '品格教育'],
    description:
      '讲述范仲淹"断齑画粥"的求学故事与其在应天书院的成长历程，展现其"以天下为己任"的胸怀如何从书院教育中孕育而生，激励当代学子立志成才。',
    downloads: 11200,
    rating: 4.8,
    updatedAt: '2026-03-05',
    coverEmoji: '👤',
    hasDownload: true,
    hasExercise: true,
  },
  {
    id: 'course-08',
    title: '二程论学——格物致知的哲学智慧',
    category: '名师微课',
    type: '视频',
    stage: ['高中'],
    duration: '38分钟',
    teacher: '陈文博 高级教师',
    courseTopic: '经典导读',
    tags: ['二程', '格物致知', '理学', '哲学思辨'],
    description:
      '围绕程颢、程颐"格物致知""主敬集义"的理学思想，结合嵩阳书院的讲学传统，引导学生理解中国传统哲学的认识论与修养论，培养批判性思维与哲学素养。',
    downloads: 6200,
    rating: 4.7,
    updatedAt: '2025-08-22',
    coverEmoji: '☯️',
    hasDownload: true,
    hasExercise: true,
  },
]

// ============================================================
// 二、教师备课资源
// ============================================================

export const teacherPrepData: ResourceItem[] = [
  {
    id: 'prep-01',
    title: '《白鹿洞书院揭示》精品教案（高中语文）',
    category: '教师备课',
    subCategory: '精品教案',
    type: '精品教案',
    stage: '高中',
    subject: '语文',
    format: 'DOCX / PDF',
    tags: ['文言文教学', '书院文化', '核心素养', '群文阅读'],
    description:
      '对标《普通高中语文课程标准》"中华传统文化经典研习"学习任务群，以《白鹿洞书院揭示》为核心文本，设计三课时完整教案。含教学目标、重难点分析、教学过程设计、评价方案及拓展阅读推荐。',
    downloads: 5600,
    rating: 4.8,
    updatedAt: '2026-01-20',
    coverEmoji: '📝',
  },
  {
    id: 'prep-02',
    title: '书院文化主题班会设计方案（初中）',
    category: '教师备课',
    subCategory: '主题班会设计',
    type: '主题班会设计',
    stage: '初中',
    subject: '道德与法治',
    format: 'PPTX / PDF',
    tags: ['主题班会', '书院文化', '品格教育', '班级管理'],
    description:
      '以"书院精神与我的成长"为主题的系列班会设计方案（共4次），涵盖"尊师重道""勤奋好学""家国情怀""规则意识"四个子主题。每课时含导入活动、主体环节、反思总结、延伸实践完整流程。',
    downloads: 4200,
    rating: 4.7,
    updatedAt: '2025-12-10',
    coverEmoji: '🎯',
  },
  {
    id: 'prep-03',
    title: '《岳阳楼记》教学课件（初中语文统编版）',
    category: '教师备课',
    subCategory: '教学课件',
    type: '教学课件',
    stage: '初中',
    subject: '语文',
    format: 'PPTX',
    tags: ['岳阳楼记', '范仲淹', '文言文', '情境教学'],
    description:
      '配合统编版初中语文教材《岳阳楼记》课文，设计45页精美教学课件。包含洞庭湖情境导入、分层诵读指导、关键字词解析、情感脉络梳理、"先忧后乐"精神研讨、跨学科拓展（历史/地理/书法）等模块。',
    downloads: 8900,
    rating: 4.9,
    updatedAt: '2026-02-15',
    coverEmoji: '🎬',
  },
  {
    id: 'prep-04',
    title: '书院文化研学活动操作手册',
    category: '教师备课',
    subCategory: '研学活动手册',
    type: '研学活动手册',
    stage: ['小学高段', '初中', '高中'],
    subject: '综合实践活动',
    format: 'PDF',
    tags: ['研学旅行', '书院文化', '实践课程', '活动设计'],
    description:
      '面向岳麓书院实地研学的完整操作手册，含行前准备指南、研学任务单（分学段）、现场教学活动设计方案、安全预案模板、研学成果评价量规及后期延伸活动建议。同时提供通用框架，可适配其他书院研学场景。',
    downloads: 3800,
    rating: 4.6,
    updatedAt: '2025-11-05',
    coverEmoji: '🗺️',
  },
  {
    id: 'prep-05',
    title: '儒家经典名句同步检测试题（初中语文）',
    category: '教师备课',
    subCategory: '同步检测试题',
    type: '同步检测试题',
    stage: '初中',
    subject: '语文',
    format: 'DOCX',
    tags: ['检测试题', '儒家经典', '名句默写', '阅读理解'],
    description:
      '涵盖《论语》《孟子》《大学》《中庸》及书院学规经典名句的同步检测试题库（共8套），每套含名句默写、词句解释、阅读理解、情境运用四种题型。附参考答案与评分标准，可直接用于单元检测或期中期末考试。',
    downloads: 6700,
    rating: 4.7,
    updatedAt: '2026-03-01',
    coverEmoji: '📋',
  },
  {
    id: 'prep-06',
    title: '"先贤精神与生涯规划"主题教学设计（高中）',
    category: '教师备课',
    subCategory: '精品教案',
    type: '精品教案',
    stage: '高中',
    subject: '道德与法治',
    format: 'DOCX / PDF',
    tags: ['生涯规划', '先贤精神', '价值观教育', '项目式学习'],
    description:
      '将范仲淹、朱熹、王阳明等先贤的人生选择与当代高中生生涯规划相结合，通过案例研习、价值观澄清、生涯访谈、发展规划撰写等活动，引导学生确立积极的人生方向。对标课标"人生价值观"相关内容。',
    downloads: 3100,
    rating: 4.8,
    updatedAt: '2025-10-28',
    coverEmoji: '🧭',
  },
  {
    id: 'prep-07',
    title: '"古代书院与现代学校"历史比较教学资源包（初中历史）',
    category: '教师备课',
    subCategory: '教学课件',
    type: '教学课件',
    stage: '初中',
    subject: '历史',
    format: 'PPTX / MP4',
    tags: ['书院史', '比较教学', '教育史', '跨时空对话'],
    description:
      '以"如果古代书院是一所现代学校"为驱动问题，设计比较探究课程。资源包含古代书院与现代学校在办学理念、课程设置、师生关系、评价方式等维度的可视化对比素材、历史图片集、微视频及课堂讨论引导策略。',
    downloads: 2900,
    rating: 4.5,
    updatedAt: '2026-01-08',
    coverEmoji: '⚖️',
  },
  {
    id: 'prep-08',
    title: '"程门立雪"课本剧排演方案（小学语文）',
    category: '教师备课',
    subCategory: '主题班会设计',
    type: '主题班会设计',
    stage: ['小学低段', '小学高段'],
    subject: '语文',
    format: 'DOCX',
    tags: ['课本剧', '程门立雪', '戏剧教育', '德育融合'],
    description:
      '将"程门立雪"改编为适合小学生排演的课本剧，包含剧本（分角色台词）、导演指导、道具制作指南、背景音乐推荐及演出后的讨论引导问题。通过角色扮演深化学生对尊师重道精神的理解与认同。',
    downloads: 5100,
    rating: 4.8,
    updatedAt: '2025-12-20',
    coverEmoji: '🎭',
  },
]

// ============================================================
// 三、学生学习资源
// ============================================================

export const studentLearningData: ResourceItem[] = [
  {
    id: 'student-01',
    title: '书院文化知识卡——四大书院知多少',
    category: '学生学习',
    type: '图文',
    stage: ['小学高段', '初中'],
    learningTime: '15分钟',
    tags: ['四大书院', '文化常识', '知识卡片', '自主阅读'],
    description:
      '一套精美的书院文化知识卡片（共20张），涵盖岳麓、白鹿洞、嵩阳、应天四大书院的地理位置、历史沿革、著名人物、经典故事。图文并茂，可作为课前预习或课后拓展阅读材料。',
    rating: 4.7,
    updatedAt: '2025-11-15',
    coverEmoji: '🃏',
  },
  {
    id: 'student-02',
    title: '经典诵读材料——学规名篇诵读本',
    category: '学生学习',
    type: '音频',
    stage: ['小学低段', '小学高段', '初中'],
    learningTime: '20分钟',
    tags: ['经典诵读', '学规', '名篇', '晨读素材'],
    description:
      '精选《白鹿洞书院揭示》《岳麓书院学规》《朱子读书法》等经典篇目，配以专业诵读音频（含跟读版）。每篇标注拼音、断句，附诵读指导提示，适合晨读、课前诵读及家庭诵读练习。',
    rating: 4.8,
    updatedAt: '2026-02-10',
    coverEmoji: '🎵',
  },
  {
    id: 'student-03',
    title: '书院人物故事——朱熹与白鹿洞书院',
    category: '学生学习',
    type: '图文',
    stage: ['小学高段', '初中'],
    learningTime: '10分钟',
    tags: ['朱熹', '白鹿洞书院', '人物故事', '拓展阅读'],
    description:
      '生动讲述朱熹重建白鹿洞书院、制定《白鹿洞书院揭示》、讲学传道的故事。包含朱熹生平简介、白鹿洞书院实景图片、相关书法碑刻欣赏。语言通俗易懂，适合学生自主阅读。',
    rating: 4.6,
    updatedAt: '2025-10-20',
    coverEmoji: '👨‍🏫',
  },
  {
    id: 'student-04',
    title: '学习任务单——"我心中的理想书院"项目式学习',
    category: '学生学习',
    type: '任务单',
    stage: ['小学高段', '初中'],
    learningTime: '45分钟',
    tags: ['项目式学习', '创意表达', '跨学科', '任务单'],
    description:
      '引导学生研究古代书院的功能布局，结合现代学校的需求，设计"我心中的理想书院/学校"。任务单含研究指引、设计模板、评估量规及优秀作品示例。融合语文表达、美术设计、历史知识等跨学科能力。',
    rating: 4.9,
    updatedAt: '2026-03-12',
    coverEmoji: '✏️',
  },
  {
    id: 'student-05',
    title: '短视频——三分钟了解一座书院',
    category: '学生学习',
    type: '视频',
    stage: ['小学低段', '小学高段', '初中'],
    learningTime: '3分钟/集',
    tags: ['短视频', '书院巡礼', '趣味科普', '视听学习'],
    description:
      '系列短视频（共5集），每集3分钟介绍一座著名书院。采用动画+实景+解说的形式，轻松有趣地展现各书院的历史故事和文化特色。适合课间、课后碎片化学习，也可作为课堂导入素材。',
    rating: 4.8,
    updatedAt: '2026-01-25',
    coverEmoji: '🎬',
  },
  {
    id: 'student-06',
    title: '书院人物故事——范仲淹"断齑画粥"',
    category: '学生学习',
    type: '图文',
    stage: ['小学低段', '小学高段'],
    learningTime: '8分钟',
    tags: ['范仲淹', '应天书院', '励志故事', '品格教育'],
    description:
      '以连环画形式讲述范仲淹少时在应天书院刻苦求学的故事。语言浅显生动，配以精美插画，适合小学阶段学生自主阅读或教师课堂讲述。附"我的学习计划"互动小任务。',
    rating: 4.9,
    updatedAt: '2025-12-05',
    coverEmoji: '📖',
  },
  {
    id: 'student-07',
    title: '书院文化知识卡——古代书院的"课程表"',
    category: '学生学习',
    type: '图文',
    stage: ['小学高段', '初中'],
    learningTime: '12分钟',
    tags: ['书院制度', '课程设置', '比较文化', '历史探究'],
    description:
      '还原古代书院的一日作息与课程安排，与现代学校课表进行趣味对比。包含"讲会""会讲""日课""月考"等古代书院教学制度的介绍，帮助学生在对比中理解古今教育的异同。',
    rating: 4.5,
    updatedAt: '2025-09-28',
    coverEmoji: '📅',
  },
]

// ============================================================
// 四、亲子共读资源
// ============================================================

export const parentChildReadingData: ResourceItem[] = [
  {
    id: 'family-01',
    title: '亲子诵读——《白鹿洞书院揭示》亲子共读版',
    category: '亲子共读',
    type: '音频',
    stage: ['小学高段', '初中'],
    duration: '15分钟',
    readingMethod: '亲子共读',
    familyScenario: '周末书房',
    tags: ['经典诵读', '白鹿洞揭示', '亲子互动', '分段诵读'],
    description:
      '专为亲子共读设计的《白鹿洞书院揭示》分段诵读音频。采用"家长领读+孩子跟读+共同讨论"的三段式结构，每段附有亲子讨论话题，帮助家长引导孩子理解经典内涵。',
    rating: 4.8,
    updatedAt: '2026-02-28',
    coverEmoji: '🎧',
  },
  {
    id: 'family-02',
    title: '先贤家风故事——朱熹的家教智慧',
    category: '亲子共读',
    type: '图文',
    stage: ['小学高段', '初中', '高中'],
    duration: '20分钟',
    readingMethod: '家长导读',
    familyScenario: '睡前共读',
    tags: ['家风故事', '朱熹', '家庭教育', '品格培养'],
    description:
      '讲述朱熹教育子孙的家风故事，包括《朱子家训》中的家教智慧、朱熹与子女的书信往来等。每则故事后附"亲子讨论角"，提供具体话题帮助家长与孩子展开深度对话。',
    rating: 4.7,
    updatedAt: '2025-11-30',
    coverEmoji: '🏠',
  },
  {
    id: 'family-03',
    title: '家庭礼仪微课堂——从书院学规学日常礼仪',
    category: '亲子共读',
    type: '视频',
    stage: ['小学低段', '小学高段'],
    duration: '10分钟',
    readingMethod: '角色扮演',
    familyScenario: '日常熏陶',
    tags: ['礼仪教育', '学规', '日常生活', '习惯养成'],
    description:
      '以《岳麓书院学规》中的日常行为规范为蓝本，设计家庭礼仪微课堂（共6课）。每课通过情景短剧展示一项礼仪（如问候父母、恭敬师长、饮食节制等），家长可与孩子一起观看后实践演练。',
    rating: 4.9,
    updatedAt: '2026-01-15',
    coverEmoji: '🙇',
  },
  {
    id: 'family-04',
    title: '亲子共学任务卡——"寻访身边的书院文化"',
    category: '亲子共读',
    type: '任务单',
    stage: ['小学高段', '初中'],
    duration: '半天',
    readingMethod: '学生自读+家长点评',
    familyScenario: '假期研学',
    tags: ['研学任务', '实地探访', '亲子合作', '文化寻踪'],
    description:
      '一份完整的亲子研学任务卡，引导家长与孩子在周末或假期共同寻访当地与书院文化相关的历史遗迹、博物馆或文化地标。含行前准备清单、探访任务、拍照记录模板及研学小报制作指南。',
    rating: 4.8,
    updatedAt: '2025-10-15',
    coverEmoji: '🔍',
  },
  {
    id: 'family-05',
    title: '先贤家风故事——范仲淹的"义庄"与家风传承',
    category: '亲子共读',
    type: '图文',
    stage: ['初中', '高中'],
    duration: '25分钟',
    readingMethod: '亲子共读',
    familyScenario: '周末书房',
    tags: ['家风故事', '范仲淹', '义庄', '家族文化'],
    description:
      '讲述范仲淹设立"范氏义庄"救济族人的故事，深入解读"先忧后乐"精神在家族层面的体现。引导亲子共同探讨"什么样的家风值得传承"以及"我的家庭有哪些好的传统"。',
    rating: 4.6,
    updatedAt: '2026-03-08',
    coverEmoji: '🏡',
  },
  {
    id: 'family-06',
    title: '亲子诵读——"每日一诵"书院经典打卡计划',
    category: '亲子共读',
    type: '音频',
    stage: ['小学低段', '小学高段'],
    duration: '5分钟/日',
    readingMethod: '亲子共读',
    familyScenario: '日常熏陶',
    tags: ['每日诵读', '打卡计划', '习惯养成', '亲子陪伴'],
    description:
      '为期30天的亲子诵读打卡计划，每日精选一句书院经典名句（含拼音、释义、家长引导语）。配套诵读音频和打卡记录表，帮助家庭建立每日共读的仪式感，在坚持中培养孩子的文化素养。',
    rating: 4.9,
    updatedAt: '2026-02-01',
    coverEmoji: '📆',
  },
  {
    id: 'family-07',
    title: '家庭礼仪微课堂——节日中的传统文化礼仪',
    category: '亲子共读',
    type: '视频',
    stage: ['小学低段', '小学高段', '初中'],
    duration: '12分钟',
    readingMethod: '角色扮演',
    familyScenario: '节日专题',
    tags: ['节日礼仪', '传统文化', '家庭活动', '习俗传承'],
    description:
      '围绕春节、清明、端午、中秋、重阳五大传统节日，讲解节日中蕴含的传统礼仪和文化内涵。每课设计一个亲子互动实践环节，如春节拜年礼仪练习、中秋赏月诗会等，让传统文化在家庭中"活"起来。',
    rating: 4.8,
    updatedAt: '2025-12-25',
    coverEmoji: '🏮',
  },
  {
    id: 'family-08',
    title: '亲子共学任务卡——"我家的读书角"空间布置挑战',
    category: '亲子共读',
    type: '任务单',
    stage: ['小学低段', '小学高段'],
    duration: '1-2小时',
    readingMethod: '学生自读+家长点评',
    familyScenario: '周末书房',
    tags: ['空间营造', '阅读习惯', '亲子合作', '创意手工'],
    description:
      '受古代书院"读书空间"理念启发，亲子共同设计并布置家中的阅读角落。任务卡含空间设计指引、书籍分类建议、阅读公约模板、布置成果展示模板。通过共同营造阅读环境，培养孩子的阅读兴趣和习惯。',
    rating: 4.7,
    updatedAt: '2026-01-30',
    coverEmoji: '🪑',
  },
]

// ============================================================
// 五、文化拓展——五大书院地域文化
// ============================================================

export const academyCultureData: AcademyCulture[] = [
  {
    id: 'culture-yuelu',
    academyName: '岳麓书院',
    location: '湖南·长沙·岳麓山',
    history:
      '岳麓书院始建于北宋开宝九年（976年），是世界上最古老的学府之一，历经宋、元、明、清各代，弦歌不绝，世称"千年学府"。南宋时期，张栻、朱熹在此会讲，开创了自由讲学之风。',
    folkCustoms: ['湖湘文化', '长沙花鼓戏', '湘剧', '浏阳花炮制作', '火宫殿庙会'],
    intangibleHeritage: ['湘绣', '长沙窑铜官陶瓷烧制技艺', '长沙弹词', '浏阳菊花石雕'],
    digitalCases: [
      {
        title: '岳麓书院数字全景展厅',
        description: '利用360°全景摄影技术，实现在线沉浸式参观岳麓书院，包含语音讲解、历史场景复原。',
        techType: 'VR/AR',
      },
      {
        title: '"千年学府"互动时间轴',
        description: '以H5形式呈现岳麓书院千年发展历程，支持关键历史节点点击展开，融入音频、视频多媒体内容。',
        techType: '互动H5',
      },
    ],
    localResources: [
      {
        title: '湖湘文化精神与书院教育',
        type: '地域历史',
        description: '探讨"经世致用"的湖湘文化精神如何通过岳麓书院的教育实践影响了一代代湖湘人才。',
        coverEmoji: '🌄',
      },
      {
        title: '湘绣中的书院文化元素',
        type: '非遗传承',
        description: '展示以岳麓书院、爱晚亭等为主题的湘绣作品，了解湘绣技艺与书院文化的创意融合。',
        coverEmoji: '🧵',
      },
    ],
  },
  {
    id: 'culture-bailudong',
    academyName: '白鹿洞书院',
    location: '江西·九江·庐山',
    history:
      '白鹿洞书院始建于唐代，南唐升元年间正式建为学馆，称"庐山国学"。南宋淳熙六年（1179年），朱熹知南康军时重建书院，亲定《白鹿洞书院揭示》，确立了中国书院教育的纲领性文献。',
    folkCustoms: ['庐山云雾茶制作', '九江采茶戏', '湖口草龙', '瑞昌剪纸', '庐山石雕'],
    intangibleHeritage: ['景德镇手工制瓷技艺', '庐山篆刻', '星子金星砚制作技艺', '湖口青阳腔'],
    digitalCases: [
      {
        title: '白鹿洞书院3D古建复原',
        description: '基于史料和考古成果，利用3D建模技术完整复原南宋时期白鹿洞书院建筑群，支持多角度浏览。',
        techType: '3D建模',
      },
      {
        title: '"朱熹讲学"VR体验',
        description: '戴上VR设备即可穿越到南宋白鹿洞书院，聆听朱熹讲学，与虚拟弟子互动交流。',
        techType: 'VR/AR',
      },
    ],
    localResources: [
      {
        title: '庐山文化与书院精神',
        type: '地域历史',
        description: '以庐山为背景，探索自然山水与人文书院的关系，理解古人"择胜地而立精舍"的选址理念。',
        coverEmoji: '🏔️',
      },
      {
        title: '景德镇陶瓷上的书院纹样',
        type: '非遗传承',
        description: '展示景德镇瓷器上以白鹿洞书院为题材的装饰纹样，了解陶瓷文化与书院文化的跨界融合。',
        coverEmoji: '🏺',
      },
    ],
  },
  {
    id: 'culture-songyang',
    academyName: '嵩阳书院',
    location: '河南·登封·嵩山',
    history:
      '嵩阳书院位于中岳嵩山南麓，始建于北魏太和八年（484年），初名嵩阳寺。宋景祐二年（1035年）重修并更名嵩阳书院。程颢、程颐曾在此讲学十余年，使其成为洛学（理学的重要学派）的发源地。',
    folkCustoms: ['少林武术', '河洛大鼓', '嵩山木版年画', '登封窑陶瓷', '中岳庙会'],
    intangibleHeritage: ['少林功夫', '河图洛书传说', '登封泥塑', '嵩山宝剑锻造技艺'],
    digitalCases: [
      {
        title: '嵩阳书院AI导览小程序',
        description: '基于AI语音识别和自然语言处理，游客可通过语音提问获取嵩阳书院的讲解服务，实现智能互动导览。',
        techType: 'AI导览',
      },
      {
        title: '"汉柏见证"数字影像展',
        description: '以嵩阳书院内4500年树龄的"将军柏"为叙事线索，通过数字影像展现书院跨越千年的历史变迁。',
        techType: '数字展厅',
      },
    ],
    localResources: [
      {
        title: '河洛文化与嵩阳书院',
        type: '地域历史',
        description: '追溯河洛大地作为华夏文明核心区的历史，探讨嵩阳书院在河洛文化传承中的枢纽地位。',
        coverEmoji: '🐉',
      },
      {
        title: '少林功夫与书院武德',
        type: '民俗风情',
        description: '探讨嵩山地区"文武兼修"的文化传统，比较少林武德与书院德育的相通之处。',
        coverEmoji: '🥋',
      },
    ],
  },
  {
    id: 'culture-yingtian',
    academyName: '应天书院',
    location: '河南·商丘',
    history:
      '应天书院始建于五代后晋时期，北宋大中祥符二年（1009年）正式赐匾"应天府书院"。范仲淹少时在此苦读，后主持书院教务，培养了大批人才。应天书院在北宋中期升为南京国子监，成为官方最高学府之一。',
    folkCustoms: ['商丘豫剧', '柘城泥人', '民权画虎', '火神台庙会', '商丘唢呐'],
    intangibleHeritage: ['四平调', '商丘火神祭祀', '宋绣', '柘城李秀山泥塑'],
    digitalCases: [
      {
        title: '应天书院数字复原与线上博物馆',
        description: '通过数字展厅技术，复原展示应天书院的建筑原貌与历史变迁，收藏展示相关文物高清影像。',
        techType: '数字展厅',
      },
    ],
    localResources: [
      {
        title: '殷商文明与应天书院',
        type: '地域历史',
        description: '商丘作为殷商文明的重要发祥地，探索上古文化与北宋书院教育之间的历史脉络。',
        coverEmoji: '🏛️',
      },
      {
        title: '宋绣中的书院人物',
        type: '非遗传承',
        description: '展示商丘宋绣（宋代刺绣）中以范仲淹等书院人物为主题的非遗作品，了解传统手工艺的文化表达。',
        coverEmoji: '🪡',
      },
    ],
  },
  {
    id: 'culture-shigu',
    academyName: '石鼓书院',
    location: '湖南·衡阳',
    history:
      '石鼓书院位于衡阳市石鼓山，始建于唐元和五年（810年），宋代名列"天下四大书院"之一。朱熹曾作《衡州石鼓书院记》阐述其教育宗旨。石鼓书院临蒸水、湘江交汇处，自然景观与人文建筑交相辉映。',
    folkCustoms: ['衡阳花鼓戏', '衡山影子戏', '祁剧', '南岳庙会', '衡阳渔鼓'],
    intangibleHeritage: ['衡州窑陶瓷烧制技艺', '南岳衡山祭祀', '衡阳丝弦', '界牌釉下五彩瓷'],
    digitalCases: [
      {
        title: '石鼓书院"云游学"互动H5',
        description: '开发石鼓书院线上"云游学"H5页面，融合地图导览、知识问答、打卡集章等游戏化元素，提升学习趣味性。',
        techType: '互动H5',
      },
    ],
    localResources: [
      {
        title: '南岳文化与石鼓书院',
        type: '地域历史',
        description: '衡山作为五岳之一的南岳，其宗教文化与儒家书院教育在石鼓山交汇融合，形成独特的文化景观。',
        coverEmoji: '⛰️',
      },
      {
        title: '衡州窑陶瓷与书院文化创意',
        type: '数智化案例',
        description: '讲述衡州窑传统陶瓷工艺如何与现代文创设计结合，以书院文化为IP开发系列文化创意产品。',
        coverEmoji: '🏺',
      },
    ],
  },
]

// ============================================================
// 综合导出
// ============================================================

/** 按类别获取资源列表 */
export function getResourcesByCategory(category: ResourceItem['category']): ResourceItem[] {
  switch (category) {
    case '名师微课':
      return featuredCoursesData
    case '教师备课':
      return teacherPrepData
    case '学生学习':
      return studentLearningData
    case '亲子共读':
      return parentChildReadingData
    default:
      return []
  }
}

/** 所有资源汇总（用于搜索） */
export const allResources: ResourceItem[] = [
  ...featuredCoursesData,
  ...teacherPrepData,
  ...studentLearningData,
  ...parentChildReadingData,
]
