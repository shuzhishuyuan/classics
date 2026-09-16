import { get, post } from '../hooks/useApi'
import type { AiChatRequest, AiChatResponse, AiProviderInfo } from '../types/ai'

export function fetchAiProviders() {
  return get<AiProviderInfo[]>('/ai/providers')
}

export function sendAiChat(payload: AiChatRequest) {
  return post<AiChatResponse>('/ai/chat', payload)
}
