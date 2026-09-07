import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Text, HStack, VStack, Button, Flex,
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, Divider, Spinner,
} from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '../components/Icons'
import { fetchChapter } from '../api/classics'
import { saveProgress } from '../api/learning'
import { useSpeech, splitSentences, isSpeechSupported } from '../hooks/useSpeech'
import type { Classic, Chapter } from '../types'

type SpeakTarget = 'original' | 'translation' | null

/** 朗读高亮样式 */
const highlightStyle: React.CSSProperties = {
  background: '#FEF3C7',
  borderRadius: '3px',
  transition: 'background 0.15s',
}

export default function ReaderPage() {
  const { id, volumeId, chapterId } = useParams<{ id: string; volumeId: string; chapterId: string }>()
  const navigate = useNavigate()
  const [classic, setClassic] = useState<Classic | null>(null)
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null)
  const [showTranslation, setShowTranslation] = useState(false)
  const [showNote, setShowNote] = useState(false)
  const [loading, setLoading] = useState(true)

  const { isPlaying, isPaused, currentIndex, speak, pause, resume, stop } = useSpeech()
  const [speakTarget, setSpeakTarget] = useState<SpeakTarget>(null)
  const speechSupported = isSpeechSupported()

  useEffect(() => {
    if (!id || !chapterId) return
    setLoading(true)
    fetchChapter(id, chapterId).then(res => {
      if (res.code === 200) {
        setClassic(res.data.classic)
        setCurrentChapter(res.data.chapter)
        saveProgress(id, chapterId).catch(() => {})
      }
      setLoading(false)
    })
  }, [id, chapterId])

  // 切换章节时停止朗读
  useEffect(() => {
    stop()
    setSpeakTarget(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId])

  // 拆句
  const sentences = useMemo(() => {
    if (!currentChapter) return []
    return splitSentences(currentChapter.content.original)
  }, [currentChapter])

  const translationSentences = useMemo(() => {
    if (!currentChapter?.content.translation) return []
    return splitSentences(currentChapter.content.translation)
  }, [currentChapter])

  /** 停止朗读（含清空目标） */
  const handleStop = useCallback(() => {
    stop()
    setSpeakTarget(null)
  }, [stop])

  /** 朗读原文 */
  const handleSpeakOriginal = useCallback(() => {
    if (sentences.length === 0) return
    if (isPlaying && speakTarget === 'original') { pause(); return }
    if (isPaused && speakTarget === 'original') { resume(); return }
    handleStop()
    setSpeakTarget('original')
    speak(sentences)
  }, [sentences, isPlaying, isPaused, speakTarget, pause, resume, handleStop, speak])

  /** 朗读译文 */
  const handleSpeakTranslation = useCallback(() => {
    if (translationSentences.length === 0) return
    if (isPlaying && speakTarget === 'translation') { pause(); return }
    if (isPaused && speakTarget === 'translation') { resume(); return }
    handleStop()
    setSpeakTarget('translation')
    speak(translationSentences)
  }, [translationSentences, isPlaying, isPaused, speakTarget, pause, resume, handleStop, speak])

  if (loading) return <Box textAlign="center" pt="120px"><Spinner color="brand.primary" size="lg" /></Box>
  if (!classic || !currentChapter) return (
    <Box pt="120px" textAlign="center" py={20}>
      <Text fontSize="5xl" mb={4}>📖</Text>
      <Text fontSize="lg" color="gray.500">未找到该章节</Text>
      <Button mt={4} variant="ghost" colorScheme="green" onClick={() => navigate('/classics')}>返回典籍列表</Button>
    </Box>
  )

  // 构建章节导航
  const allChapters: { volumeId: string; volumeTitle: string; chapterId: string; title: string }[] = []
  for (const v of classic.chapters) {
    for (const ch of v.chapters) {
      allChapters.push({ volumeId: v.id, volumeTitle: v.title, chapterId: ch.id, title: ch.title })
    }
  }
  const idx = allChapters.findIndex(c => c.chapterId === chapterId)
  const prev = idx > 0 ? allChapters[idx - 1] : null
  const next = idx < allChapters.length - 1 ? allChapters[idx + 1] : null

  return (
    <Box minH="100vh" bg="brand.bg">
      <Box maxW="900px" mx="auto" px={6} pt="100px" pb="40px">
        <Breadcrumb spacing={1} separator="›" mb={6} fontSize="sm">
          <BreadcrumbItem><BreadcrumbLink onClick={() => navigate('/classics')} color="brand.primary">经典研习</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbItem><BreadcrumbLink onClick={() => navigate(`/classics/${id}`)} color="brand.primary">{classic.name}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbItem isCurrentPage><BreadcrumbLink color="gray.500">{currentChapter.title}</BreadcrumbLink></BreadcrumbItem>
        </Breadcrumb>

        <Text fontSize="2xl" fontWeight={700} fontFamily="heading" color="gray.800" textAlign="center" mb={8} letterSpacing={2}>
          {currentChapter.title}
        </Text>

        {/* 功能按钮 + 朗读控制 */}
        <HStack spacing={3} mb={4} justify="center" flexWrap="wrap">
          <Button size="sm" variant={showTranslation ? 'solid' : 'outline'} colorScheme="green" borderRadius="full"
            onClick={() => setShowTranslation(!showTranslation)}>{showTranslation ? '隐藏译文' : '显示译文'}</Button>
          <Button size="sm" variant={showNote ? 'solid' : 'outline'} colorScheme="orange" borderRadius="full"
            onClick={() => setShowNote(!showNote)}>{showNote ? '隐藏解读' : '文化解读'}</Button>

          {speechSupported && (
            speakTarget === 'original' && (isPlaying || isPaused) ? (
              <>
                <Button size="sm" variant="solid" colorScheme="teal" borderRadius="full"
                  leftIcon={<Text fontSize="sm">{isPaused ? '▶' : '⏸'}</Text>}
                  onClick={handleSpeakOriginal}>
                  {isPaused ? '继续' : '暂停'}
                </Button>
                <Button size="sm" variant="outline" colorScheme="gray" borderRadius="full"
                  onClick={handleStop}>⏹ 停止</Button>
              </>
            ) : (
              <Button size="sm" variant="solid" colorScheme="teal" borderRadius="full"
                leftIcon={<Text fontSize="sm">🔊</Text>}
                onClick={handleSpeakOriginal}>
                朗读原文
              </Button>
            )
          )}
        </HStack>

        <Box bg="white" borderRadius="2xl" p={10} boxShadow="sm" border="1px solid" borderColor="blackAlpha.100">
          {/* 原文 */}
          <Box mb={showTranslation || showNote ? 6 : 0}>
            <Text fontSize={{ base: 'md', md: 'lg' }} lineHeight="2.2" color="gray.800" letterSpacing={1}
              fontFamily="heading" whiteSpace="pre-wrap">
              {sentences.map((s, i) => (
                <span
                  key={i}
                  style={i === currentIndex && speakTarget === 'original' ? highlightStyle : undefined}
                >
                  {s}
                </span>
              ))}
            </Text>
          </Box>

          {/* 译文（含朗读按钮 + 高亮） */}
          {showTranslation && currentChapter.content.translation && (
            <>
              <Divider mb={4} />
              <Box>
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontSize="sm" fontWeight={700} color="brand.primary" fontFamily="heading">📝 白话译文</Text>
                  {speechSupported && (
                    speakTarget === 'translation' && (isPlaying || isPaused) ? (
                      <HStack spacing={1.5}>
                        <Button size="xs" variant="solid" colorScheme="teal" borderRadius="full"
                          leftIcon={<Text fontSize="xs">{isPaused ? '▶' : '⏸'}</Text>}
                          onClick={handleSpeakTranslation}>
                          {isPaused ? '继续' : '暂停'}
                        </Button>
                        <Button size="xs" variant="outline" colorScheme="gray" borderRadius="full"
                          onClick={handleStop}>⏹ 停止</Button>
                      </HStack>
                    ) : (
                      <Button size="xs" variant="outline" colorScheme="teal" borderRadius="full"
                        leftIcon={<Text fontSize="xs">🔊</Text>}
                        onClick={handleSpeakTranslation}>
                        朗读译文
                      </Button>
                    )
                  )}
                </Flex>
                <Text fontSize="sm" lineHeight="1.8" color="gray.600" whiteSpace="pre-wrap">
                  {translationSentences.map((s, i) => (
                    <span
                      key={i}
                      style={i === currentIndex && speakTarget === 'translation' ? highlightStyle : undefined}
                    >
                      {s}
                    </span>
                  ))}
                </Text>
              </Box>
            </>
          )}

          {/* 文化解读 */}
          {showNote && currentChapter.content.culturalNote && (
            <>
              <Divider mb={4} />
              <Box><Text fontSize="sm" fontWeight={700} color="brand.secondary" fontFamily="heading" mb={2}>📖 文化解读</Text>
                <Text fontSize="sm" lineHeight="1.8" color="gray.600" whiteSpace="pre-wrap">{currentChapter.content.culturalNote}</Text></Box>
            </>
          )}

          {currentChapter.keyConcepts && currentChapter.keyConcepts.length > 0 && (
            <>
              <Divider mt={4} mb={3} />
              <HStack spacing={2} flexWrap="wrap"><Text fontSize="xs" color="gray.500" fontWeight={600}>核心概念：</Text>
                {currentChapter.keyConcepts.map(c => <Box key={c} px={2} py={0.5} bg="brand.bg" borderRadius="full" fontSize="xs" color="brand.primary" fontWeight={500}>{c}</Box>)}</HStack>
            </>
          )}
        </Box>

        {currentChapter.discussionQuestions && currentChapter.discussionQuestions.length > 0 && (
          <Box mt={6} bg="white" borderRadius="xl" p={6} boxShadow="sm" border="1px solid" borderColor="brand.light">
            <Text fontSize="md" fontWeight={700} fontFamily="heading" color="brand.primary" mb={3}>💬 会讲讨论</Text>
            <VStack spacing={3} align="stretch">
              {currentChapter.discussionQuestions.map((q, i) => (
                <Flex key={i} gap={3} align="flex-start">
                  <Text fontSize="xs" fontWeight={700} color="brand.secondary" bg="brand.bg" px={2} py={0.5} borderRadius="full" flexShrink={0}>Q{i+1}</Text>
                  <Text fontSize="sm" color="gray.700" lineHeight="1.6">{q}</Text>
                </Flex>
              ))}
            </VStack>
          </Box>
        )}

        <Flex justify="space-between" mt={8} gap={4}>
          <Button variant="ghost" colorScheme="green" leftIcon={<ChevronLeftIcon />} isDisabled={!prev}
            onClick={() => prev && navigate(`/classics/${id}/read/${prev.volumeId}/${prev.chapterId}`)} size="lg">
            {prev ? prev.title : '已是第一章'}
          </Button>
          <Button variant="ghost" colorScheme="green" rightIcon={<ChevronRightIcon />} isDisabled={!next}
            onClick={() => next && navigate(`/classics/${id}/read/${next.volumeId}/${next.chapterId}`)} size="lg">
            {next ? next.title : '已是最后一章'}
          </Button>
        </Flex>
      </Box>
    </Box>
  )
}
