import { Router } from 'express'
import { ok, fail } from '../middleware/response'
import { chatWithProvider, listAiProviders } from '../services/ai.service'
import type { AiChatRequest, AiProviderId } from '../../types/ai'

const router = Router()

router.get('/providers', (_req, res) => {
  return ok(res, listAiProviders())
})

router.post('/chat', async (req, res) => {
  try {
    const {
      provider = 'deepseek',
      apiKey,
      baseUrl,
      model,
      messages,
      temperature,
    } = req.body as Partial<AiChatRequest> & { provider?: AiProviderId }

    if (!Array.isArray(messages) || messages.length === 0) {
      return fail(res, '请先输入对话内容')
    }

    const result = await chatWithProvider({
      provider,
      apiKey: apiKey || '',
      baseUrl: baseUrl || '',
      model: model || '',
      messages,
      temperature,
    })

    return ok(res, result)
  } catch (error: any) {
    return fail(res, error?.message || 'AI 请求失败', 500)
  }
})

export default router
