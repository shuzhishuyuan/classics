import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Text, HStack, VStack, Button, Flex, IconButton,
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, Divider, Spinner,
} from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '../components/Icons'
import { fetchChapter } from '../api/classics'
import { saveProgress } from '../api/learning'
import { useSpeech, splitSentences, isSpeechSupported } from '../hooks/useSpeech'
import type { Classic, Chapter } from '../types'

/** 朗读高亮样式 */
const highlightStyle: React.CSSProperties = {
  background: '#FEF3C7',
  borderRadius: '3px',
  transition: 'background 0.15s',
}

/** 按换行拆段落 */
function splitParagraphs(text: string): string[] {
  return text.split('\n').map(s => s.trim()).filter(s => s.length > 0)
}

export default function ReaderPage() {
  const { id, volumeId, chapterId } = useParams<{ id: string; volumeId: string; chapterId: string }>()
  const navigate = useNavigate()
  const [classic, setClassic] = useState<Classic | null>(null)
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null)
  const [showNote, setShowNote] = useState(false)
  const [loading, setLoading] = useState(true)
  // 分段触发状态
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [expandedAll, setExpandedAll] = useState(false)
  const [speakingParaIndex, setSpeakingParaIndex] = useState<number | null>(null)

  const { isPlaying, isPaused, currentIndex, speak, pause, resume, stop } = useSpeech()
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

  // 切换章节时停止朗读 + 重置分段状态
  useEffect(() => {
    stop()
    setSpeakingParaIndex(null)
    setExpandedIndex(null)
    setExpandedAll(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId])

  // 段落拆分
  const paragraphs = useMemo(() => {
    if (!currentChapter) return []
    return splitParagraphs(currentChapter.content.original)
  }, [currentChapter])

  const translationParagraphs = useMemo(() => {
    if (!currentChapter?.content.translation) return []
    return splitParagraphs(currentChapter.content.translation)
  }, [currentChapter])

  // 每个段落对应的全局句子起始索引（用于全文朗读时的逐句高亮）
  const paragraphStartIndexes = useMemo(() => {
    let start = 0
    return paragraphs.map(para => {
      const current = start
      start += splitSentences(para).length
      return current
    })
  }, [paragraphs])

  // 全文句子数组
  const allSentences = useMemo(() => {
    if (!currentChapter) return []
    return splitSentences(currentChapter.content.original)
  }, [currentChapter])

  const handleStop = useCallback(() => {
    stop()
    setSpeakingParaIndex(null)
  }, [stop])

  /** 朗读全文 */
  const handleSpeakFull = useCallback(() => {
    if (isPlaying || isPaused) { handleStop(); return }
    setSpeakingParaIndex(null)
    speak(allSentences)
  }, [isPlaying, isPaused, handleStop, allSentences, speak])

  /** 朗读某段 */
  const handleSpeakParagraph = useCallback((i: number) => {
    if (speakingParaIndex === i && (isPlaying || isPaused)) { handleStop(); return }
    const sentences = splitSentences(paragraphs[i])
    stop()
    setSpeakingParaIndex(i)
    speak(sentences)
  }, [speakingParaIndex, isPlaying, isPaused, handleStop, paragraphs, stop, speak])

  /** 切换段落译文展开 */
  const toggleParagraph = useCallback((i: number) => {
    setExpandedAll(false)
    setExpandedIndex(prev => prev === i ? null : i)
  }, [])

  const toggleExpandAll = useCallback(() => {
    setExpandedAll(prev => !prev)
    setExpandedIndex(null)
  }, [])

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

        {/* 功能按钮 */}
        <HStack spacing={3} mb={4} justify="center" flexWrap="wrap">
          <Button size="sm" variant={expandedAll ? 'solid' : 'outline'} colorScheme="green" borderRadius="full"
            onClick={toggleExpandAll}>{expandedAll ? '收起全部译文' : '展开全部译文'}</Button>
          <Button size="sm" variant={showNote ? 'solid' : 'outline'} colorScheme="orange" borderRadius="full"
            onClick={() => setShowNote(!showNote)}>{showNote ? '隐藏解读' : '文化解读'}</Button>

          {speechSupported && (
            (isPlaying || isPaused) ? (
              <>
                <Button size="sm" variant="solid" colorScheme="teal" borderRadius="full"
                  leftIcon={<Text fontSize="sm">{isPaused ? '▶' : '⏸'}</Text>}
                  onClick={isPaused ? resume : pause}>
                  {isPaused ? '继续' : '暂停'}
                </Button>
                <Button size="sm" variant="outline" colorScheme="gray" borderRadius="full"
                  onClick={handleStop}>⏹ 停止</Button>
              </>
            ) : (
              <Button size="sm" variant="solid" colorScheme="teal" borderRadius="full"
                leftIcon={<Text fontSize="sm">🔊</Text>}
                onClick={handleSpeakFull}>
                朗读全文
              </Button>
            )
          )}
        </HStack>

        {/* 提示语 */}
        <Text fontSize="xs" color="gray.400" textAlign="center" mb={4}>
          {speechSupported ? '点击段落查看对应译文 · 点击段落右侧 🔊 朗读该段' : '点击段落查看对应译文'}
        </Text>

        <Box bg="white" borderRadius="2xl" p={{ base: 4, md: 10 }} boxShadow="sm" border="1px solid" borderColor="blackAlpha.100">
          {/* 原文段落（分段触发） */}
          <VStack spacing={2} align="stretch">
            {paragraphs.map((para, i) => {
              const sentences = splitSentences(para)
              const isSpeakingPara = speakingParaIndex === i
              const isExpanded = expandedAll || expandedIndex === i
              const hasTranslation = !!translationParagraphs[i]

              return (
                <Box
                  key={i}
                  p={3}
                  borderRadius="lg"
                  cursor="pointer"
                  bg={isSpeakingPara ? '#FEF3C7' : 'transparent'}
                  _hover={{ bg: isSpeakingPara ? '#FEF3C7' : '#FAFAF5' }}
                  transition="background 0.15s"
                  onClick={() => toggleParagraph(i)}
                >
                  {/* 段落原文 + 朗读按钮 */}
                  <Flex justify="space-between" align="flex-start" gap={3}>
                    <Text fontSize={{ base: 'md', md: 'lg' }} lineHeight="2.2" color="gray.800" letterSpacing={1}
                      fontFamily="heading" whiteSpace="pre-wrap" flex={1}>
                      {sentences.map((s, si) => {
                        const globalIndex = paragraphStartIndexes[i] + si
                        const isHighlighted = speakingParaIndex === null && globalIndex === currentIndex
                        return (
                          <span key={si} style={isHighlighted ? highlightStyle : undefined}>{s}</span>
                        )
                      })}
                    </Text>
                    {speechSupported && (
                      <IconButton
                        aria-label="朗读本段"
                        icon={<Text fontSize="md">🔊</Text>}
                        size="sm"
                        variant="ghost"
                        color={isSpeakingPara ? 'brand.primary' : 'gray.400'}
                        flexShrink={0}
                        onClick={(e) => { e.stopPropagation(); handleSpeakParagraph(i) }}
                      />
                    )}
                  </Flex>

                  {/* 段落译文（展开时显示） */}
                  {isExpanded && hasTranslation && (
                    <Box mt={3} pt={3} borderTop="1px dashed" borderColor="gray.200">
                      <Text fontSize="sm" lineHeight="1.8" color="gray.600" whiteSpace="pre-wrap">
                        {translationParagraphs[i]}
                      </Text>
                    </Box>
                  )}
                </Box>
              )
            })}
          </VStack>

          {/* 文化解读 */}
          {showNote && currentChapter.content.culturalNote && (
            <>
              <Divider mt={6} mb={4} />
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
