import db from '../db/connection'
import { v4 as uuidv4 } from 'uuid'

export interface TaskRow {
  id: string; title: string; description: string | null; dimension: string | null
  related_classic_id: string | null; examples: string | null; completed_count: number
}

const MOCK_TASKS: TaskRow[] = [
  { id: 'task-01', title: '每日诵读打卡', description: '选择一篇典籍章节，大声朗读并录制音频上传', dimension: '实践养成', related_classic_id: null, examples: '《白鹿洞书院揭示》选段、《岳阳楼记》选段', completed_count: 0 },
  { id: 'task-02', title: '书院文化小调研', description: '走访本地与书院文化相关的历史遗迹，记录你的发现', dimension: '实践养成', related_classic_id: null, examples: '本地孔庙、书院遗址、碑刻', completed_count: 0 },
  { id: 'task-03', title: '写一篇读后感', description: '选择一部已学典籍，撰写不少于500字的读后感', dimension: '价值引领', related_classic_id: null, examples: '"先天下之忧而忧"的现实意义', completed_count: 0 },
  { id: 'task-04', title: '设计一份学规', description: '参照《岳麓书院学规》的形式，为自己的班级设计一份行为公约', dimension: '制度规约', related_classic_id: 'yuelu-xuegui', examples: '包含作息、礼仪、学习方面的条目', completed_count: 0 },
  { id: 'task-05', title: '绘制书院地图', description: '研究五大书院的地理位置，绘制一张"中国古代书院分布图"', dimension: '空间叙事', related_classic_id: null, examples: '标注五大书院位置、简介、代表人物', completed_count: 0 },
  { id: 'task-06', title: '录制诵读视频', description: '选择一篇典籍的选段，录制一段3分钟以内的诵读视频', dimension: '实践养成', related_classic_id: null, examples: '《岳阳楼记》选段、《朱子读书法》选段', completed_count: 0 },
  { id: 'task-07', title: '做一个文化调查报告', description: '调查你所在城市与书院文化相关的地点或活动，撰写一份简短的调查报告', dimension: '空间叙事', related_classic_id: null, examples: '城市里的孔庙、文庙、书院遗址、国学馆', completed_count: 0 },
  { id: 'task-08', title: '比较古代书院与现代学校', description: '从办学理念、课程设置、师生关系、评价方式等角度，制作一份对比分析表', dimension: '知识建构', related_classic_id: null, examples: '书院讲会制度 vs 现代课堂讨论、书院学规 vs 学校校规', completed_count: 0 },
  { id: 'task-09', title: '采访长辈的家风故事', description: '采访家中或社区的长辈，了解家族中的家风传承故事，整理成一篇口述史', dimension: '价值引领', related_classic_id: 'fanwenzheng-jiayu', examples: '家族中的读书传统、勤俭故事、互助精神', completed_count: 0 },
  { id: 'task-10', title: '创作一幅书院主题书法作品', description: '选取一句书院经典名句，用毛笔或硬笔书法创作一幅作品，并附简短创作说明', dimension: '实践养成', related_classic_id: null, examples: '"博学之，审问之，慎思之，明辨之，笃行之"', completed_count: 0 },
]

// 首次启动时插入 mock 数据
export function seedTasks() {
  const count = (db.prepare('SELECT COUNT(*) as cnt FROM practice_tasks').get() as { cnt: number }).cnt
  if (count > 0) return
  const insert = db.prepare('INSERT INTO practice_tasks (id, title, description, dimension, related_classic_id, examples, completed_count) VALUES (?,?,?,?,?,?,?)')
  for (const t of MOCK_TASKS) {
    insert.run(t.id, t.title, t.description, t.dimension, t.related_classic_id, t.examples, t.completed_count)
  }
}

export function getTasks(dimension?: string) {
  if (dimension) return db.prepare('SELECT * FROM practice_tasks WHERE dimension=?').all(dimension) as TaskRow[]
  return db.prepare('SELECT * FROM practice_tasks').all() as TaskRow[]
}

export function getTaskDetail(id: string) {
  return (db.prepare('SELECT * FROM practice_tasks WHERE id=?').get(id) as TaskRow) ?? null
}

export function submitTask(userId: string, taskId: string, content: string) {
  const id = uuidv4()
  db.prepare('INSERT INTO task_submissions (id, user_id, task_id, content) VALUES (?,?,?,?)').run(id, userId, taskId, content)
  db.prepare('UPDATE practice_tasks SET completed_count = completed_count + 1 WHERE id=?').run(taskId)
  return db.prepare('SELECT * FROM task_submissions WHERE id=?').get(id)
}

export function getMySubmissions(userId: string) {
  return db.prepare('SELECT * FROM task_submissions WHERE user_id=? ORDER BY created_at DESC').all(userId)
}
