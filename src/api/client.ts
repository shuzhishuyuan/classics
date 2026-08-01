import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// 请求拦截器：注入当前用户 ID（后端就绪后改为真实 token）
apiClient.interceptors.request.use((config) => {
  const raw = localStorage.getItem('current_user')
  if (raw) {
    try {
      const user = JSON.parse(raw)
      if (user?.id) {
        config.headers['X-User-Id'] = user.id
      }
    } catch {
      // 忽略解析错误
    }
  }
  return config
})

// 响应拦截器：统一错误格式
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

export default apiClient
