import { get, post } from '../hooks/useApi'
import type { ResourceItem } from '../types/resource'

export function fetchResources(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString()
  return get<{ list: ResourceItem[]; total: number }>(`/resources${qs ? '?' + qs : ''}`)
}

export function fetchResourceDetail(id: string) {
  return get<ResourceItem>(`/resources/${id}`)
}

export function fetchCategoryStats() {
  return get<Record<string, number>>('/resources/categories')
}

export async function toggleResourceFavorite(resourceId: string) {
  return post(`/resources/favorites/${resourceId}`)
}

// ===== 用户投稿的共享资源 =====
export function createSharedResource(data: { title: string; description?: string; category?: string; type?: string; tags?: string[]; fileUrl?: string }) {
  return post('/resources/shared', data)
}

export function fetchSharedResources(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString()
  return get<{ list: any[]; total: number }>(`/resources/shared/list${qs ? '?' + qs : ''}`)
}

export function fetchSharedDetail(id: string) {
  return get<any>(`/resources/shared/${id}`)
}
