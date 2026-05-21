import { useState, useRef, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Text, HStack, VStack, Button, IconButton, Tooltip, Flex, Slider,
  SliderTrack, SliderFilledTrack, SliderThumb, Select, Breadcrumb,
  BreadcrumbItem, BreadcrumbLink, Divider,
} from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon } from '../components/Icons'
import { classicsData } from '../data/classics'
import { useLocalStorage } from '../hooks/useLocalStorage'
import ReactPlayer from 'react-player'

export default function ReaderPage() {
  const { id, volumeId, chapterId } = useParams<{ id: string; volumeId: string; chapterId: string }>()
  const navigate = useNavigate()
  const playerRef = useRef<ReactPlayer>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [played, setPlayed] = useState(0)
  const [showAudioBar, setShowAudioBar] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const [showNote, setShowNote] = useState(false)

  // 阅读进度持久化
  const [readingProgress, setReadingProgress] = useLocalStorage<Record<string, string>>('reading_progress', {})

  const classic = classicsData.find(c => c.id === id)

  // 获取当前卷和章节
  const currentVolume = classic?.chapters.find(v => v.id === volumeId)
  const currentChapter = currentVolume?.chapters.find(ch => ch.id === chapterId)

  // 获取所有章节的平铺列表（用于上下章跳转）
  const allChapters = useMemo(() => {
    if (!classic) return []
    const result: { volumeId: string; chapterId: string; title: string }[] = []
    for (const vol of classic.chapters) {
      for (const ch of vol.chapters) {
        result.push({ volumeId: vol.id, chapterId: ch.id, title: `${vol.title} · ${ch.title}` })
      }
    }
    return result
  }, [classic])

  const currentIndex = allChapters.findIndex(c => c.chapterId === chapterId)
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null
  const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null

  if (!classic || !currentVolume || !currentChapter) {
    return (
      <Box pt="72px" textAlign="center" py={20}>
        <Text fontSize="5xl" mb={4}>📖</Text>
        <Text fontSize="lg" color="gray.500">未找到该章节</Text>
        <Button mt={4} variant="ghost" colorScheme="green" onClick={() => navigate('/classics')}>
          返回典籍列表
        </Button>
      </Box>
    )
  }

  // 记录阅读进度
  const currentPath = `/classics/${id}/read/${volumeId}/${chapterId}`
  if (readingProgress[id || ''] !== currentPath) {
    setReadingProgress(prev => ({ ...prev, [id || '']: currentPath }))
  }

  const handlePrev = () => {
    if (prevChapter) {
      navigate(`/classics/${id}/read/${prevChapter.volumeId}/${prevChapter.chapterId}`)
    }
  }

  const handleNext = () => {
    if (nextChapter) {
      navigate(`/classics/${id}/read/${nextChapter.volumeId}/${nextChapter.chapterId}`)
    }
  }

  return (
    <Box minH="100vh" bg="brand.bg">
      {/* 阅读内容区 */}
      <Box maxW="900px" mx="auto" px={6} pt="100px" pb={showAudioBar ? '100px' : '40px'}>
        {/* 面包屑 */}
        <Breadcrumb spacing={1} separator="›" mb={6} fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/classics')} color="brand.primary">
              经典研习
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate(`/classics/${id}`)} color="brand.primary">
              {classic.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink color="gray.500">{currentChapter.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* 章标题 */}
        <Text
          fontSize="2xl"
          fontWeight={700}
          fontFamily="heading"
          color="gray.800"
          textAlign="center"
          mb={8}
          letterSpacing={2}
        >
          {currentChapter.title}
        </Text>

        {/* 功能切换按钮 */}
        <HStack spacing={3} mb={4} justify="center">
          <Button
            size="sm"
            variant={showTranslation ? 'solid' : 'outline'}
            colorScheme="green"
            borderRadius="full"
            onClick={() => setShowTranslation(!showTranslation)}
          >
            {showTranslation ? '隐藏译文' : '显示译文'}
          </Button>
          <Button
            size="sm"
            variant={showNote ? 'solid' : 'outline'}
            colorScheme="orange"
            borderRadius="full"
            onClick={() => setShowNote(!showNote)}
          >
            {showNote ? '隐藏解读' : '文化解读'}
          </Button>
        </HStack>

        {/* 原文 + 译文 + 解读 */}
        <Box
          bg="white"
          borderRadius="2xl"
          p={10}
          boxShadow="sm"
          border="1px solid"
          borderColor="blackAlpha.100"
        >
          {/* 原文 */}
          <Box mb={showTranslation || showNote ? 6 : 0}>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              lineHeight="2.2"
              color="gray.800"
              letterSpacing={1}
              fontFamily="heading"
              whiteSpace="pre-wrap"
              sx={{
                '&::first-letter': {
                  fontSize: '1.8em',
                  color: 'brand.primary',
                  fontWeight: 700,
                  float: 'left',
                  mr: 1,
                },
              }}
            >
              {currentChapter.content.original}
            </Text>
          </Box>

          {/* 译文 */}
          {showTranslation && currentChapter.content.translation && (
            <>
              <Divider mb={4} />
              <Box>
                <Text fontSize="sm" fontWeight={700} color="brand.primary" fontFamily="heading" mb={2}>
                  📝 白话译文
                </Text>
                <Text
                  fontSize="sm"
                  lineHeight="1.8"
                  color="gray.600"
                  whiteSpace="pre-wrap"
                >
                  {currentChapter.content.translation}
                </Text>
              </Box>
            </>
          )}

          {/* 文化解读 */}
          {showNote && currentChapter.content.culturalNote && (
            <>
              <Divider mb={4} />
              <Box>
                <Text fontSize="sm" fontWeight={700} color="brand.secondary" fontFamily="heading" mb={2}>
                  📖 文化解读
                </Text>
                <Text
                  fontSize="sm"
                  lineHeight="1.8"
                  color="gray.600"
                  whiteSpace="pre-wrap"
                >
                  {currentChapter.content.culturalNote}
                </Text>
              </Box>
            </>
          )}

          {/* 核心概念标签 */}
          {currentChapter.keyConcepts && currentChapter.keyConcepts.length > 0 && (
            <>
              <Divider mt={4} mb={3} />
              <HStack spacing={2} flexWrap="wrap">
                <Text fontSize="xs" color="gray.500" fontWeight={600}>核心概念：</Text>
                {currentChapter.keyConcepts.map((concept) => (
                  <Box
                    key={concept}
                    px={2}
                    py={0.5}
                    bg="brand.bg"
                    borderRadius="full"
                    fontSize="xs"
                    color="brand.primary"
                    fontWeight={500}
                  >
                    {concept}
                  </Box>
                ))}
              </HStack>
            </>
          )}
        </Box>

        {/* 会讲讨论题 */}
        {currentChapter.discussionQuestions && currentChapter.discussionQuestions.length > 0 && (
          <Box
            mt={6}
            bg="white"
            borderRadius="xl"
            p={6}
            boxShadow="sm"
            border="1px solid"
            borderColor="brand.light"
          >
            <Text fontSize="md" fontWeight={700} fontFamily="heading" color="brand.primary" mb={3}>
              💬 会讲讨论
            </Text>
            <VStack spacing={3} align="stretch">
              {currentChapter.discussionQuestions.map((q, idx) => (
                <Flex key={idx} gap={3} align="flex-start">
                  <Text
                    fontSize="xs"
                    fontWeight={700}
                    color="brand.secondary"
                    bg="brand.bg"
                    px={2}
                    py={0.5}
                    borderRadius="full"
                    flexShrink={0}
                  >
                    Q{idx + 1}
                  </Text>
                  <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                    {q}
                  </Text>
                </Flex>
              ))}
            </VStack>
          </Box>
        )}

        {/* 上下章导航 */}
        <Flex justify="space-between" mt={8} gap={4}>
          <Button
            variant="ghost"
            colorScheme="green"
            leftIcon={<ChevronLeftIcon />}
            isDisabled={!prevChapter}
            onClick={handlePrev}
            size="lg"
          >
            {prevChapter ? prevChapter.title : '已是第一章'}
          </Button>
          <Button
            variant="ghost"
            colorScheme="green"
            rightIcon={<ChevronRightIcon />}
            isDisabled={!nextChapter}
            onClick={handleNext}
            size="lg"
          >
            {nextChapter ? nextChapter.title : '已是最后一章'}
          </Button>
        </Flex>
      </Box>

      {/* 底部音频播放条 */}
      {showAudioBar && currentChapter.audioUrl && (
        <Box
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          bg="white"
          borderTop="1px solid"
          borderColor="gray.200"
          boxShadow="0 -4px 12px rgba(0,0,0,0.08)"
          zIndex={100}
          px={6}
          py={3}
        >
          <Flex maxW="800px" mx="auto" align="center" gap={4}>
            <IconButton
              aria-label={isPlaying ? '暂停' : '播放'}
              icon={isPlaying ? <PauseIcon /> : <PlayIcon />}
              colorScheme="green"
              variant="solid"
              borderRadius="full"
              onClick={() => setIsPlaying(!isPlaying)}
            />
            <Box flex={1}>
              <Slider
                value={played * 100}
                onChange={(v) => {
                  setPlayed(v / 100)
                  playerRef.current?.seekTo(v / 100)
                }}
                colorScheme="green"
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Box>
            <Select
              size="sm"
              value={playbackRate}
              onChange={(e) => setPlaybackRate(Number(e.target.value))}
              w="80px"
              borderRadius="md"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </Select>
          </Flex>
          {/* 隐藏的 ReactPlayer */}
          <Box display="none">
            <ReactPlayer
              ref={playerRef}
              url={currentChapter.audioUrl}
              playing={isPlaying}
              playbackRate={playbackRate}
              onProgress={(state) => setPlayed(state.played)}
              onEnded={() => setIsPlaying(false)}
              width={0}
              height={0}
            />
          </Box>
        </Box>
      )}

      {/* 浮动音频按钮 */}
      {!showAudioBar && currentChapter.audioUrl && (
        <Tooltip label="播放音频">
          <IconButton
            aria-label="播放音频"
            icon={<PlayIcon />}
            position="fixed"
            bottom={6}
            right={6}
            size="lg"
            colorScheme="green"
            borderRadius="full"
            boxShadow="lg"
            onClick={() => setShowAudioBar(true)}
            zIndex={100}
          />
        </Tooltip>
      )}
    </Box>
  )
}
