import { get, post } from '../hooks/useApi'
import type { AiChatRequest, AiChatResponse, AiProviderId } from '../types/ai'

export function fetchAiProviders() {
  return get<Array<{ id: AiProviderId; label: string; baseUrl: string; model: string; keyLabel: string }>>('/ai/providers')
}

export function sendAiChat(payload: AiChatRequest) {
  return post<AiChatResponse>('/ai/chat', payload)
}
