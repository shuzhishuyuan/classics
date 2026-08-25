const BASE = '/api/v1'

type ApiResponse<T> = {
  code: number
  message: string
  data: T
}

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

async function readApiResponse<T>(res: Response): Promise<ApiResponse<T>> {
  const text = await res.text()

  if (!text.trim()) {
    throw new Error(
      res.status === 502 || res.status === 503
        ? '后端服务未启动，请运行 npm run server'
        : `服务器返回空响应（HTTP ${res.status}）`,
    )
  }

  try {
    return JSON.parse(text) as ApiResponse<T>
  } catch {
    throw new Error(`服务器返回了无效响应（HTTP ${res.status}）`)
  }
}

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
    const json = await readApiResponse<{ accessToken: string; refreshToken: string }>(res)
    if (json.code === 200 && json.data) {
      setTokens(json.data.accessToken, json.data.refreshToken)
      return json.data.accessToken
    }
  } catch {
    // Refresh failures are handled by clearing the local tokens below.
  }

  clearTokens()
  return null
}

export async function request<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = getAccessToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${BASE}${path}`, { ...options, headers })
  } catch {
    throw new Error('无法连接后端服务，请确认已运行 npm run server')
  }

  if (res.status === 401 && getRefreshToken()) {
    if (!isRefreshing) {
      isRefreshing = true
      const newToken = await tryRefresh()
      isRefreshing = false

      if (newToken) {
        refreshQueue.forEach((callback) => callback(newToken))
        refreshQueue = []
        headers.Authorization = `Bearer ${newToken}`
        res = await fetch(`${BASE}${path}`, { ...options, headers })
      } else {
        refreshQueue = []
      }
    } else {
      const newToken = await new Promise<string | null>((resolve) => {
        refreshQueue.push((newAccessToken) => resolve(newAccessToken))
        setTimeout(() => resolve(null), 5000)
      })

      if (newToken) {
        headers.Authorization = `Bearer ${newToken}`
        res = await fetch(`${BASE}${path}`, { ...options, headers })
      }
    }
  }

  return readApiResponse<T>(res)
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
