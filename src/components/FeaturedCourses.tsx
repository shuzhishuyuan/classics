import { useMemo } from 'react'
import { Box, Text, SimpleGrid, VStack, HStack, Badge } from '@chakra-ui/react'
import ResourceCard from './ResourceCard'
import type { ResourceItem, CourseTopic } from '../types/resource'

interface FeaturedCoursesProps {
  data: ResourceItem[]
  searchKeyword: string
  stageFilter: string
  topicFilter: string
  favorites: string[]
  onToggleFavorite: (id: string) => void
}

const topicColors: Record<CourseTopic, string> = {
  '书院历史': 'blue',
  '学规解读': 'green',
  '先贤精神': 'orange',
  '经典导读': 'purple',
}

const topicLabels: Record<CourseTopic, string> = '书院历史-学规解读-先贤精神-经典导读'.split('-').reduce((acc, t, i) => {
  acc[t as CourseTopic] = ['🏛️ 书院历史', '📋 学规解读', '🌟 先贤精神', '📖 经典导读'][i]
  return acc
}, {} as Record<CourseTopic, string>)

export default function FeaturedCourses({
  data,
  searchKeyword,
  stageFilter,
  topicFilter,
  favorites,
  onToggleFavorite,
}: FeaturedCoursesProps) {
  const filtered = useMemo(() => {
    let list = [...data]
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase()
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(kw) ||
          r.description.toLowerCase().includes(kw) ||
          r.tags.some((t) => t.toLowerCase().includes(kw)) ||
          (r.teacher && r.teacher.toLowerCase().includes(kw))
      )
    }
    if (stageFilter) {
      list = list.filter(
        (r) =>
          (Array.isArray(r.stage) && r.stage.includes(stageFilter as any)) ||
          r.stage === stageFilter
      )
    }
    if (topicFilter) {
      list = list.filter((r) => r.courseTopic === topicFilter)
    }
    return list
  }, [data, searchKeyword, stageFilter, topicFilter])

  // 按专题分组展示
  const grouped: Record<string, ResourceItem[]> = {}
  for (const course of filtered) {
    const topic = course.courseTopic || '其他'
    if (!grouped[topic]) grouped[topic] = []
    grouped[topic].push(course)
  }

  if (filtered.length === 0) {
    return (
      <Box textAlign="center" py={16}>
        <Text fontSize="5xl" mb={4}>🎬</Text>
        <Text fontSize="lg" color="gray.500" fontWeight={600} fontFamily="heading">
          暂无匹配的微课资源
        </Text>
        <Text fontSize="sm" color="gray.400" mt={2}>
          试试调整筛选条件或搜索其他关键词
        </Text>
      </Box>
    )
  }

  return (
    <Box>
      {/* 功能提示：倍速播放、课件下载、同步练习 */}
      <HStack
        spacing={{ base: 2, md: 4 }}
        mb={6}
        p={4}
        bg="white"
        borderRadius="xl"
        border="1px solid"
        borderColor="blackAlpha.100"
        flexWrap="wrap"
      >
        <HStack spacing={2}>
          <Text fontSize="sm">⚡</Text>
          <Text fontSize="sm" color="gray.600">全部课程支持<Badge variant="subtle" colorScheme="blue" fontSize="xs" mx={1}>倍速播放</Badge></Text>
        </HStack>
        <HStack spacing={2}>
          <Text fontSize="sm">📥</Text>
          <Text fontSize="sm" color="gray.600">配套<Badge variant="subtle" colorScheme="green" fontSize="xs" mx={1}>课件下载</Badge></Text>
        </HStack>
        <HStack spacing={2}>
          <Text fontSize="sm">📝</Text>
          <Text fontSize="sm" color="gray.600">附<Badge variant="subtle" colorScheme="orange" fontSize="xs" mx={1}>同步练习</Badge></Text>
        </HStack>
      </HStack>

      {/* 按专题分组 */}
      {Object.entries(grouped).map(([topic, courses]) => (
        <Box key={topic} mb={8}>
          <HStack mb={4} spacing={2}>
            <Text fontSize="lg" fontWeight={700} fontFamily="heading" color="gray.800">
              {topicLabels[topic as CourseTopic] || topic}
            </Text>
            <Badge colorScheme={topicColors[topic as CourseTopic] || 'gray'} fontSize="xs" borderRadius="full">
              {courses.length}个课程
            </Badge>
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {courses.map((course) => (
              <ResourceCard
                key={course.id}
                resource={course}
                isFavorited={favorites.includes(course.id)}
                onToggleFavorite={onToggleFavorite}
                variant="course"
              />
            ))}
          </SimpleGrid>
        </Box>
      ))}
    </Box>
  )
}
