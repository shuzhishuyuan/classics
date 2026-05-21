import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Text, HStack, VStack, SimpleGrid, Badge, Progress, Flex, Tag,
} from '@chakra-ui/react'
import { StarIcon, StarOutlineIcon } from '../components/Icons'
import { classicsData } from '../data/classics'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Difficulty, GenreType } from '../types'

/** 体裁颜色映射 */
const genreColors: Record<GenreType, string> = {
  '学规': 'green',
  '语录': 'orange',
  '会讲记录': 'blue',
  '碑刻': 'purple',
  '文集': 'cyan',
}

/** 难度星级 */
function DifficultyStars({ level }: { level: Difficulty }) {
  return (
    <HStack spacing={0.5}>
      {[1, 2, 3, 4, 5].map((star) => (
        star <= level
          ? <StarIcon key={star} w={3} h={3} color="brand.accent" />
          : <StarOutlineIcon key={star} w={3} h={3} color="gray.300" />
      ))}
    </HStack>
  )
}

export default function MyLearningPage() {
  const navigate = useNavigate()
  const [learned] = useLocalStorage<string[]>('learned', [])
  const [favorites] = useLocalStorage<string[]>('favorites', [])
  const [readingProgress] = useLocalStorage<Record<string, string>>('reading_progress', {})
  const [notes] = useLocalStorage<Record<string, string>>('user_notes', {})

  // 获取已加入学习的典籍
  const learnedClassics = useMemo(() => {
    return classicsData.filter(c => learned.includes(c.id))
  }, [learned])

  /** 计算学习进度 */
  const getProgress = (classicId: string): number => {
    const classic = classicsData.find(c => c.id === classicId)
    if (!classic) return 0
    const totalChapters = classic.chapters.reduce((sum, vol) => sum + vol.chapters.length, 0)
    if (totalChapters === 0) return 0

    // 从阅读进度估算
    const progressKey = readingProgress[classicId]
    if (!progressKey) return 0

    // 简单估算：如果开始读了算 10%，否则根据最后一个阅读的章节位置估算
    let chapterIndex = 0
    for (const vol of classic.chapters) {
      for (const ch of vol.chapters) {
        chapterIndex++
        if (progressKey.includes(ch.id)) {
          return Math.min(Math.round((chapterIndex / totalChapters) * 100), 95)
        }
      }
    }
    return 10
  }

  /** 获取笔记数量 */
  const getNoteCount = (classicId: string): number => {
    return Object.keys(notes).filter(k => k.startsWith(`${classicId}-`)).length
  }

  if (learnedClassics.length === 0) {
    return (
      <Box textAlign="center" py={20}>
        <Text fontSize="5xl" mb={4}>📚</Text>
        <Text fontSize="lg" color="gray.500" fontWeight={600} fontFamily="heading">
          还没有加入任何典籍
        </Text>
        <Text fontSize="sm" color="gray.400" mt={2}>
          在典籍检索页点击「加入学习」即可开始
        </Text>
      </Box>
    )
  }

  return (
    <Box maxW="1200px">
      <Text fontSize="2xl" fontWeight={700} fontFamily="heading" color="gray.800" mb={6}>
        📚 我的典籍学习
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
        {learnedClassics.map((classic) => {
          const progress = getProgress(classic.id)
          const noteCount = getNoteCount(classic.id)
          const totalChapters = classic.chapters.reduce((sum, vol) => sum + vol.chapters.length, 0)
          const isFav = favorites.includes(classic.id)

          return (
            <Box
              key={classic.id}
              bg="white"
              borderRadius="xl"
              border="1px solid"
              borderColor="blackAlpha.100"
              overflow="hidden"
              cursor="pointer"
              _hover={{ borderColor: 'brand.primary', boxShadow: '0 4px 16px rgba(44,95,45,0.1)' }}
              transition="all 0.2s"
              onClick={() => navigate(`/classics/${classic.id}`)}
            >
              {/* 封面 */}
              <Box
                h="100px"
                bg={`linear-gradient(135deg, ${isFav ? '#2C5F2D' : '#97724F'}, #1A3B1A)`}
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="4xl"
                position="relative"
              >
                {classic.coverEmoji}
                {isFav && (
                  <Box
                    position="absolute"
                    top={2}
                    right={2}
                    bg="whiteAlpha.800"
                    borderRadius="full"
                    px={2}
                    py={0.5}
                    fontSize="xs"
                    color="red.400"
                    fontWeight={600}
                  >
                    ♥ 已收藏
                  </Box>
                )}
              </Box>

              {/* 内容 */}
              <Box p={4}>
                <Text fontSize="md" fontWeight={700} fontFamily="heading" color="gray.800" mb={1}>
                  {classic.name}
                </Text>
                <Text fontSize="xs" color="gray.500" mb={2}>
                  {classic.author} · {classic.dynasty}
                </Text>

                <HStack spacing={2} mb={2}>
                  <Badge colorScheme={genreColors[classic.genre] || 'gray'} fontSize="xs">
                    {classic.genre}
                  </Badge>
                  <DifficultyStars level={classic.difficulty} />
                </HStack>

                {/* 学习进度条 */}
                <Box mb={2}>
                  <Flex justify="space-between" mb={0.5}>
                    <Text fontSize="xs" color="gray.500">学习进度</Text>
                    <Text fontSize="xs" color="brand.primary" fontWeight={600}>{progress}%</Text>
                  </Flex>
                  <Progress
                    value={progress}
                    size="sm"
                    borderRadius="full"
                    colorScheme="green"
                    bg="blackAlpha.100"
                  />
                </Box>

                {/* 统计信息 */}
                <HStack spacing={3} fontSize="xs" color="gray.500">
                  <Text>📖 {totalChapters}章</Text>
                  <Text>📝 {noteCount}条笔记</Text>
                  <Text>👥 {classic.studentCount}人</Text>
                </HStack>
              </Box>
            </Box>
          )
        })}
      </SimpleGrid>
    </Box>
  )
}
