import type { Discussion, DiscussionReply } from '../types'
import { seedDiscussions } from '../data/discussion'

// ---- 服务接口（后端需实现的契约） ----
export interface DiscussionsService {
  getDiscussionsForPage(): Promise<Discussion[]>
  addReply(sectionId: string, reply: Omit<DiscussionReply, 'id' | 'createdAt'>): Promise<DiscussionReply>
}

// ---- 内存存储（mock 模式） ----
const store: Discussion[] = structuredClone(seedDiscussions)

const MOCK_DELAY_MS = 300

function delay<T>(data: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), MOCK_DELAY_MS))
}

// ---- Mock 实现 ----
export const mockDiscussionsApi: DiscussionsService = {
  async getDiscussionsForPage() {
    return delay(structuredClone(store))
  },

  async addReply(sectionId, reply) {
    const newReply: DiscussionReply = {
      ...reply,
      id: `reply-${Date.now()}`,
      createdAt: Date.now(),
    }

    const existing = store.find((d) => d.sectionId === sectionId)
    if (existing) {
      existing.replies.push(newReply)
    } else {
      store.push({
        id: `disc-${sectionId}`,
        sectionId,
        topic: sectionId,
        classicId: '',
        initiatorId: reply.userId,
        createdAt: Date.now(),
        replies: [newReply],
      })
    }

    return delay(newReply)
  },
}

// ---- 导出（后端就绪后替换为 realDiscussionsApi） ----
export const discussionsApi: DiscussionsService = mockDiscussionsApi
