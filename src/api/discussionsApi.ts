import type { Discussion, DiscussionReply } from '../types'
import { seedDiscussions } from '../data/discussion'
import apiClient from './client'
import { request } from '../hooks/useApi'

// ---- 服务接口 ----
export interface DiscussionsService {
  getDiscussionsForPage(): Promise<Discussion[]>
  addReply(sectionId: string, reply: Omit<DiscussionReply, 'id' | 'createdAt'>): Promise<DiscussionReply>
}

// ---- 真实后端实现 ----

/** 将后端讨论转为前端 Discussion 格式 */
function mapDiscussion(d: any): Discussion {
  return {
    id: d.id,
    sectionId: d.classicId || d.topic || 'general',
    topic: d.topic,
    classicId: d.classic_id || d.classicId || '',
    initiatorId: d.user_id || d.userId || '',
    createdAt: new Date(d.created_at || d.createdAt).getTime(),
    replies: (d.replies || []).map((r: any) => ({
      id: r.id,
      userId: r.user_id || r.userId,
      content: r.content,
      createdAt: new Date(r.created_at || r.createdAt).getTime(),
    })),
  }
}

async function getDiscussionsForPage(): Promise<Discussion[]> {
  try {
    // 先从后端拉取已有讨论
    const res = await request<any[]>('/discussions')
    if (res.code === 200 && res.data.length > 0) {
      return res.data.map(mapDiscussion)
    }
    // 后端无数据时用 mock 种子数据
    return seedDiscussions as Discussion[]
  } catch {
    return seedDiscussions as Discussion[]
  }
}

async function addReply(
  sectionId: string,
  reply: Omit<DiscussionReply, 'id' | 'createdAt'>,
): Promise<DiscussionReply> {
  try {
    // 先查有没有该 sectionId 对应的讨论
    const listRes = await request<any[]>('/discussions')
    if (listRes.code !== 200) throw new Error('获取讨论失败')

    const list = listRes.data || []
    let discussion = list.find((d: any) =>
      (d.classic_id === sectionId || d.topic === sectionId || d.classicId === sectionId)
    )

    // 没有则创建
    if (!discussion) {
      const createRes = await request<any>('/discussions', {
        method: 'POST', body: JSON.stringify({
          classicId: sectionId,
          topic: sectionId,
          content: reply.content.slice(0, 50) + '...',
        }),
        headers: { 'Content-Type': 'application/json' },
      })
      if (createRes.code !== 200) throw new Error('创建讨论失败')
      discussion = createRes.data
    }

    // 发回复
    const replyRes = await request<any>(`/discussions/${discussion.id}/replies`, {
      method: 'POST',
      body: JSON.stringify({ content: reply.content }),
      headers: { 'Content-Type': 'application/json' },
    })
    if (replyRes.code !== 200) throw new Error('回复失败')

    return {
      id: replyRes.data.id,
      userId: reply.userId,
      content: reply.content,
      createdAt: Date.now(),
    }
  } catch {
    // 降级：本地 mock 行为
    return {
      ...reply,
      id: `reply-${Date.now()}`,
      createdAt: Date.now(),
    }
  }
}

// ---- 导出 ----
export const discussionsApi: DiscussionsService = {
  getDiscussionsForPage,
  addReply,
}
