import fs from 'node:fs'
import path from 'node:path'
import type { AiChatRequest, AiChatResponse, AiProviderId } from '../../types/ai'
import { buildChatCompletionsUrl, getAiProviderPreset, normalizeBaseUrl } from '../../types/ai'

const DEFAULT_DEEPSEEK_KEY_FILES = [
  process.env.DEEPSEEK_API_KEY_FILE,
  process.env.DEEPSEEK_API_KEY_OVERRIDE_FILE,
  path.resolve(process.cwd(), 'server', 'config', 'deepseek-api-key.txt'),
  path.resolve(process.cwd(), 'deepseek-api-key.txt'),
].filter((filePath): filePath is string => Boolean(filePath?.trim()))

function readKeyFromFile(filePath: string) {
  try {
    if (!fs.statSync(filePath).isFile()) return ''
    return fs.readFileSync(filePath, 'utf8').trim()
  } catch {
    return ''
  }
}

/**
 * 默认密钥只在服务端解析，避免把平台密钥暴露给浏览器。
 * 替换文件优先于环境变量，便于部署时无须修改代码。
 */
export function getDefaultDeepSeekApiKey() {
  for (const filePath of DEFAULT_DEEPSEEK_KEY_FILES) {
    const key = readKeyFromFile(filePath)
    if (key) return key
  }

  return process.env.DEEPSEEK_API_KEY?.trim() || ''
}

function resolveApiKey(input: AiChatRequest) {
  const userApiKey = input.apiKey?.trim()
  if (userApiKey) return userApiKey

  if (input.provider === 'deepseek') {
    const defaultApiKey = getDefaultDeepSeekApiKey()
    if (defaultApiKey) return defaultApiKey
  }

  throw new Error('请填写 API Key，或在服务端配置默认密钥')
}

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
  const apiKey = resolveApiKey(input)

  if (!baseUrl) throw new Error('请填写 API 地址')

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
        Authorization: `Bearer ${apiKey}`,
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
      hasDefaultKey: id === 'deepseek' && Boolean(getDefaultDeepSeekApiKey()),
    }
  })
}
