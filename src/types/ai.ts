export type AiProviderId =
  | 'deepseek'
  | 'openai'
  | 'moonshot'
  | 'qwen'
  | 'siliconflow'
  | 'custom'

export type AiRole = 'system' | 'user' | 'assistant'

export interface AiMessage {
  role: AiRole
  content: string
}

export interface AiProviderPreset {
  id: AiProviderId
  label: string
  baseUrl: string
  model: string
  keyLabel: string
}

export interface AiClientConfig {
  provider: AiProviderId
  apiKey: string
  baseUrl: string
  model: string
}

export interface AiChatRequest extends AiClientConfig {
  messages: AiMessage[]
  temperature?: number
}

export interface AiChatResponse {
  content: string
  provider: AiProviderId
  model: string
  raw?: unknown
}

export const AI_PROVIDERS: AiProviderPreset[] = [
  {
    id: 'deepseek',
    label: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com',
    model: 'deepseek-chat',
    keyLabel: 'DeepSeek API Key',
  },
  {
    id: 'openai',
    label: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    keyLabel: 'OpenAI API Key',
  },
  {
    id: 'moonshot',
    label: 'Moonshot',
    baseUrl: 'https://api.moonshot.cn/v1',
    model: 'moonshot-v1-8k',
    keyLabel: 'Moonshot API Key',
  },
  {
    id: 'qwen',
    label: 'Qwen',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: 'qwen-plus',
    keyLabel: 'DashScope API Key',
  },
  {
    id: 'siliconflow',
    label: 'SiliconFlow',
    baseUrl: 'https://api.siliconflow.cn/v1',
    model: 'deepseek-ai/DeepSeek-V3',
    keyLabel: 'SiliconFlow API Key',
  },
  {
    id: 'custom',
    label: '自定义',
    baseUrl: '',
    model: 'gpt-4o-mini',
    keyLabel: 'API Key',
  },
]

export const DEFAULT_AI_PROVIDER: AiProviderId = 'deepseek'

export function getAiProviderPreset(provider: AiProviderId) {
  return AI_PROVIDERS.find((item) => item.id === provider) ?? AI_PROVIDERS[0]
}

export function createDefaultAiConfig(provider: AiProviderId = DEFAULT_AI_PROVIDER): AiClientConfig {
  const preset = getAiProviderPreset(provider)
  return {
    provider,
    apiKey: '',
    baseUrl: preset.baseUrl,
    model: preset.model,
  }
}

export function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.trim().replace(/\/+$/, '')
}

export function buildChatCompletionsUrl(baseUrl: string) {
  return `${normalizeBaseUrl(baseUrl)}/chat/completions`
}
