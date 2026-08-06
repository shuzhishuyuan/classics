import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Text, HStack, VStack, Button, IconButton, Tooltip, Flex,
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, Divider, Spinner,
} from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '../components/Icons'
import { fetchChapter } from '../api/classics'
import { saveProgress } from '../api/learning'
import type { Classic, Volume, Chapter } from '../types'

export default function ReaderPage() {
  const { id, volumeId, chapterId } = useParams<{ id: string; volumeId: string; chapterId: string }>()
  const navigate = useNavigate()
  const [classic, setClassic] = useState<Classic | null>(null)
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null)
  const [showTranslation, setShowTranslation] = useState(false)
  const [showNote, setShowNote] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id || !chapterId) return
    setLoading(true)
    fetchChapter(id, chapterId).then(res => {
      if (res.code === 200) {
        setClassic(res.data.classic)
        setCurrentChapter(res.data.chapter)
        // 上报阅读进度
        saveProgress(id, chapterId).catch(() => {})
      }
      setLoading(false)
    })
  }, [id, chapterId])

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

        <HStack spacing={3} mb={4} justify="center">
          <Button size="sm" variant={showTranslation ? 'solid' : 'outline'} colorScheme="green" borderRadius="full"
            onClick={() => setShowTranslation(!showTranslation)}>{showTranslation ? '隐藏译文' : '显示译文'}</Button>
          <Button size="sm" variant={showNote ? 'solid' : 'outline'} colorScheme="orange" borderRadius="full"
            onClick={() => setShowNote(!showNote)}>{showNote ? '隐藏解读' : '文化解读'}</Button>
        </HStack>

        <Box bg="white" borderRadius="2xl" p={10} boxShadow="sm" border="1px solid" borderColor="blackAlpha.100">
          <Box mb={showTranslation || showNote ? 6 : 0}>
            <Text fontSize={{ base: 'md', md: 'lg' }} lineHeight="2.2" color="gray.800" letterSpacing={1}
              fontFamily="heading" whiteSpace="pre-wrap"
              sx={{ '&::first-letter': { fontSize: '1.8em', color: 'brand.primary', fontWeight: 700, float: 'left', mr: 1 } }}>
              {currentChapter.content.original}
            </Text>
          </Box>

          {showTranslation && currentChapter.content.translation && (
            <>
              <Divider mb={4} />
              <Box><Text fontSize="sm" fontWeight={700} color="brand.primary" fontFamily="heading" mb={2}>📝 白话译文</Text>
                <Text fontSize="sm" lineHeight="1.8" color="gray.600" whiteSpace="pre-wrap">{currentChapter.content.translation}</Text></Box>
            </>
          )}
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
