import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Discussion, DiscussionReply } from '../types'

export interface Submission {
  id: string
  topicId?: string
  track?: string
  title: string
  author: string
  content: string
  createdAt: number
}

interface DiscussionState {
  votes: Record<string, string>
  checkedRituals: Record<string, boolean>
  likedWorks: Record<string, boolean>
  submissions: Submission[]
  /** 评论区数据，按 sectionId 索引 */
  discussions: Record<string, Discussion>
  setVote: (seminarId: string, campId: string) => void
  toggleRitual: (taskId: string) => void
  toggleWorkLike: (workId: string) => void
  addSubmission: (submission: Omit<Submission, 'id' | 'createdAt'>) => void
  addComment: (sectionId: string, reply: DiscussionReply) => void
  initDiscussions: (discussions: Discussion[]) => void
}

export const useDiscussionStore = create<DiscussionState>()(
  persist(
    (set) => ({
      votes: {},
      checkedRituals: {},
      likedWorks: {},
      submissions: [],
      discussions: {},
      setVote: (seminarId, campId) =>
        set((state) => ({
          votes: {
            ...state.votes,
            [seminarId]: campId,
          },
        })),
      toggleRitual: (taskId) =>
        set((state) => ({
          checkedRituals: {
            ...state.checkedRituals,
            [taskId]: !state.checkedRituals[taskId],
          },
        })),
      toggleWorkLike: (workId) =>
        set((state) => ({
          likedWorks: {
            ...state.likedWorks,
            [workId]: !state.likedWorks[workId],
          },
        })),
      addSubmission: (submission) =>
        set((state) => ({
          submissions: [
            {
              ...submission,
              id: `submission-${Date.now()}`,
              createdAt: Date.now(),
            },
            ...state.submissions,
          ],
        })),
      addComment: (sectionId, reply) =>
        set((state) => {
          const existing = state.discussions[sectionId]
          return {
            discussions: {
              ...state.discussions,
              [sectionId]: existing
                ? { ...existing, replies: [...existing.replies, reply] }
                : {
                    id: `disc-${sectionId}`,
                    sectionId,
                    topic: sectionId,
                    classicId: '',
                    initiatorId: reply.userId,
                    createdAt: Date.now(),
                    replies: [reply],
                  },
            },
          }
        }),
      initDiscussions: (discussions) =>
        set((state) => {
          const next = { ...state.discussions }
          for (const d of discussions) {
            if (!next[d.sectionId]) {
              next[d.sectionId] = d
            }
          }
          return { discussions: next }
        }),
    }),
    {
      name: 'discussion-demo-state',
      partialize: (state) => ({
        votes: state.votes,
        checkedRituals: state.checkedRituals,
        likedWorks: state.likedWorks,
        submissions: state.submissions,
        discussions: state.discussions,
      }),
    },
  ),
)
