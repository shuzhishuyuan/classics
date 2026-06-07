import { useMemo } from 'react'
import { Box, Text, SimpleGrid, HStack, Badge, Flex } from '@chakra-ui/react'
import ResourceCard from './ResourceCard'
import type { ResourceItem } from '../types/resource'

interface TeacherPrepProps {
  data: ResourceItem[]
  searchKeyword: string
  stageFilter: string
  typeFilter: string
  subjectFilter: string
  favorites: string[]
  onToggleFavorite: (id: string) => void
}

const typeIcons: Record<string, string> = {
  '精品教案': '📝',
  '教学课件': '🎬',
  '同步检测试题': '📋',
  '主题班会设计': '🎯',
  '研学活动手册': '🗺️',
}

export default function TeacherPreparationResources({
  data,
  searchKeyword,
  stageFilter,
  typeFilter,
  subjectFilter,
  favorites,
  onToggleFavorite,
}: TeacherPrepProps) {
  const filtered = useMemo(() => {
    let list = [...data]
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase()
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(kw) ||
          r.description.toLowerCase().includes(kw) ||
          r.tags.some((t) => t.toLowerCase().includes(kw)) ||
          (r.subject && r.subject.toLowerCase().includes(kw))
      )
    }
    if (stageFilter) {
      list = list.filter(
        (r) =>
          (Array.isArray(r.stage) && r.stage.includes(stageFilter as any)) ||
          r.stage === stageFilter
      )
    }
    if (typeFilter) {
      list = list.filter((r) => r.subCategory === typeFilter)
    }
    if (subjectFilter) {
      list = list.filter((r) => r.subject === subjectFilter)
    }
    return list
  }, [data, searchKeyword, stageFilter, typeFilter, subjectFilter])

  if (filtered.length === 0) {
    return (
      <Box textAlign="center" py={16}>
        <Text fontSize="5xl" mb={4}>📚</Text>
        <Text fontSize="lg" color="gray.500" fontWeight={600} fontFamily="heading">
          暂无匹配的备课资源
        </Text>
        <Text fontSize="sm" color="gray.400" mt={2}>
          试试调整筛选条件或搜索其他关键词
        </Text>
      </Box>
    )
  }

  // 按资源类型分组
  const grouped: Record<string, ResourceItem[]> = {}
  for (const item of filtered) {
    const sub = item.subCategory || '其他'
    if (!grouped[sub]) grouped[sub] = []
    grouped[sub].push(item)
  }

  return (
    <Box>
      {/* 课标对标提示 */}
      <Flex
        mb={6}
        p={4}
        bg="white"
        borderRadius="xl"
        border="1px solid"
        borderColor="brand.light"
        borderLeft="4px solid"
        borderLeftColor="brand.primary"
        align="center"
        gap={3}
        flexWrap="wrap"
      >
        <Text fontSize="sm" fontWeight={600} color="brand.primary">
          📐 课标对标
        </Text>
        <Text fontSize="sm" color="gray.600">
          本专区所有资源均对标《义务教育语文课程标准》《义务教育历史课程标准》《义务教育道德与法治课程标准》及普通高中相关课程标准，确保教学内容科学规范。
        </Text>
      </Flex>

      {/* 按类型分组 */}
      {Object.entries(grouped).map(([subCategory, items]) => (
        <Box key={subCategory} mb={8}>
          <HStack mb={4} spacing={2}>
            <Text fontSize="xl">{typeIcons[subCategory] || '📄'}</Text>
            <Text fontSize="lg" fontWeight={700} fontFamily="heading" color="gray.800">
              {subCategory}
            </Text>
            <Badge colorScheme="green" fontSize="xs" borderRadius="full">
              {items.length}个资源
            </Badge>
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {items.map((item) => (
              <ResourceCard
                key={item.id}
                resource={item}
                isFavorited={favorites.includes(item.id)}
                onToggleFavorite={onToggleFavorite}
                variant="prep"
              />
            ))}
          </SimpleGrid>
        </Box>
      ))}
    </Box>
  )
}
