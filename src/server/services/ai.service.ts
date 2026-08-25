import type { AiChatRequest, AiChatResponse, AiProviderId } from '../../types/ai'
import { buildChatCompletionsUrl, getAiProviderPreset, normalizeBaseUrl } from '../../types/ai'

function normalizeMessages(messages: AiChatRequest['messages']) {
  return messages
    .filter((message) => message.content.trim())
    .map((message) => ({
      role: message.role,
      content: message.content,
    }))
}

async function readProviderResponse(res: Response) {
  const text = await res.text()
  if (!text.trim()) return { text: '' }

  try {
    return JSON.parse(text) as Record<string, any>
  } catch {
    return { text }
  }
}

export async function chatWithProvider(input: AiChatRequest): Promise<AiChatResponse> {
  const preset = getAiProviderPreset(input.provider)
  const baseUrl = normalizeBaseUrl(input.baseUrl || preset.baseUrl)

  if (!baseUrl) throw new Error('请填写 API 地址')
  if (!input.apiKey.trim()) throw new Error('请填写 API Key')

  const payload = {
    model: input.model || preset.model,
    messages: normalizeMessages(input.messages),
    temperature: input.temperature ?? 0.7,
    stream: false,
  }

  let res: Response
  try {
    res = await fetch(buildChatCompletionsUrl(baseUrl), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${input.apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error(`无法连接 ${preset.label} API，请检查 Base URL 和网络连接`)
  }

  const raw = await readProviderResponse(res)
  if (!res.ok) {
    const message =
      raw?.error?.message ||
      raw?.message ||
      raw?.text ||
      `AI 请求失败（HTTP ${res.status}）`
    throw new Error(message)
  }

  const content =
    raw?.choices?.[0]?.message?.content?.trim?.() ||
    raw?.choices?.[0]?.text?.trim?.() ||
    raw?.output_text?.trim?.() ||
    ''

  if (!content) {
    throw new Error('AI 返回为空，请检查 API Key、模型名称和接口地址')
  }

  return {
    content,
    provider: input.provider,
    model: payload.model,
    raw,
  }
}

export function listAiProviders() {
  return (['deepseek', 'openai', 'moonshot', 'qwen', 'siliconflow', 'custom'] as AiProviderId[]).map((id) => {
    const preset = getAiProviderPreset(id)
    return {
      id: preset.id,
      label: preset.label,
      baseUrl: preset.baseUrl,
      model: preset.model,
      keyLabel: preset.keyLabel,
    }
  })
}
