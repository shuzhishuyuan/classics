import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * 按中文标点拆句，保留标点和换行。
 * 拆句依据：。！？；： 以及换行符
 * 例：'父子有亲，君臣有义。\n右五教之目。' → ['父子有亲，君臣有义。', '\n', '右五教之目。']
 */
export function splitSentences(text: string): string[] {
  if (!text) return []
  const parts = text.match(/[^。！？；：\n]+[。！？；：]?|\n+/g)
  return parts && parts.length > 0 ? parts : [text]
}

/** 浏览器是否支持语音合成 */
export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

/**
 * 逐句朗读 hook
 * 返回 isPlaying / isPaused / currentIndex（当前朗读句索引，用于高亮）
 * 以及 speak / pause / resume / stop 控制函数
 */
export function useSpeech() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(-1)

  // 用 ref 保存可变状态，避免闭包陷阱
  const stateRef = useRef({
    sentences: [] as string[],
    index: 0,
    cancelled: false,
  })

  /** 朗读下一句（递归） */
  const speakNext = useCallback(() => {
    const { sentences, index, cancelled } = stateRef.current
    if (cancelled || index >= sentences.length) {
      setIsPlaying(false)
      setIsPaused(false)
      setCurrentIndex(-1)
      return
    }

    setCurrentIndex(index)

    const utter = new SpeechSynthesisUtterance(sentences[index])
    utter.lang = 'zh-CN'
    utter.rate = 0.9 // 稍慢，更适合文言文

    utter.onend = () => {
      if (!stateRef.current.cancelled) {
        stateRef.current.index += 1
        speakNext()
      }
    }
    utter.onerror = () => {
      // 朗读出错（如被中断），跳过当前句继续
      if (!stateRef.current.cancelled) {
        stateRef.current.index += 1
        speakNext()
      }
    }

    window.speechSynthesis.speak(utter)
  }, [])

  /** 开始朗读（传入拆好的句子数组） */
  const speak = useCallback((sentences: string[]) => {
    if (!isSpeechSupported()) return
    window.speechSynthesis.cancel()
    stateRef.current = { sentences, index: 0, cancelled: false }
    setIsPlaying(true)
    setIsPaused(false)
    // 稍微延迟，确保 cancel 生效
    setTimeout(speakNext, 50)
  }, [speakNext])

  const pause = useCallback(() => {
    window.speechSynthesis.pause()
    setIsPaused(true)
    setIsPlaying(false)
  }, [])

  const resume = useCallback(() => {
    window.speechSynthesis.resume()
    setIsPaused(false)
    setIsPlaying(true)
  }, [])

  const stop = useCallback(() => {
    stateRef.current.cancelled = true
    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
    setCurrentIndex(-1)
  }, [])

  // 组件卸载时停止朗读
  useEffect(() => {
    return () => {
      stateRef.current.cancelled = true
      if (isSpeechSupported()) window.speechSynthesis.cancel()
    }
  }, [])

  return { isPlaying, isPaused, currentIndex, speak, pause, resume, stop }
}
