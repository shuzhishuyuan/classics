import { useState, useEffect, useCallback } from 'react'

/**
 * localStorage 持久化 Hook
 * 用于收藏、搜索历史、阅读进度等数据持久化
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value
        window.localStorage.setItem(key, JSON.stringify(nextValue))
        return nextValue
      })
    },
    [key]
  )

  return [storedValue, setValue]
}
