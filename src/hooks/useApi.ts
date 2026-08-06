const BASE = '/api/v1'

// ===== Token 管理 =====

function getAccessToken(): string | null {
  return localStorage.getItem('access_token')
}

function getRefreshToken(): string | null {
  return localStorage.getItem('refresh_token')
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('access_token', accessToken)
  localStorage.setItem('refresh_token', refreshToken)
}

export function clearTokens() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

// ===== 请求封装 =====

let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

async function tryRefresh(): Promise<string | null> {
  const rt = getRefreshToken()
  if (!rt) return null

  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt }),
    })
    const json = await res.json()
    if (json.code === 200 && json.data) {
      setTokens(json.data.accessToken, json.data.refreshToken)
      return json.data.accessToken
    }
  } catch { /* 网络错误 */ }

  clearTokens()
  return null
}

export async function request<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<{ code: number; message: string; data: T }> {
  const token = getAccessToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let res = await fetch(`${BASE}${path}`, { ...options, headers })

  // 401 → 用 refreshToken 刷新 → 重试一次
  if (res.status === 401 && getRefreshToken()) {
    if (!isRefreshing) {
      isRefreshing = true
      const newToken = await tryRefresh()
      isRefreshing = false

      if (newToken) {
        refreshQueue.forEach(cb => cb(newToken))
        refreshQueue = []

        headers['Authorization'] = `Bearer ${newToken}`
        res = await fetch(`${BASE}${path}`, { ...options, headers })
      } else {
        refreshQueue = []
      }
    } else {
      // 已有刷新在进行中，排队等待
      const newToken = await new Promise<string | null>(resolve => {
        refreshQueue.push(token => resolve(token))
        // 超时保护
        setTimeout(() => resolve(null), 5000)
      })
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`
        res = await fetch(`${BASE}${path}`, { ...options, headers })
      }
    }
  }

  return res.json()
}

export function get<T = unknown>(path: string) {
  return request<T>(path)
}

export function post<T = unknown>(path: string, body?: unknown) {
  return request<T>(path, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  })
}

export function put<T = unknown>(path: string, body?: unknown) {
  return request<T>(path, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  })
}

export function del<T = unknown>(path: string) {
  return request<T>(path, { method: 'DELETE' })
}
