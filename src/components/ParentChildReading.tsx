import { useMemo } from 'react'
import { Box, Text, SimpleGrid, HStack, Badge, Flex, VStack } from '@chakra-ui/react'
import ResourceCard from './ResourceCard'
import type { ResourceItem } from '../types/resource'

interface ParentChildReadingProps {
  data: ResourceItem[]
  searchKeyword: string
  stageFilter: string
  methodFilter: string
  favorites: string[]
  onToggleFavorite: (id: string) => void
}

const scenarioIcons: Record<string, string> = {
  '睡前共读': '🌙',
  '周末书房': '📚',
  '假期研学': '🗺️',
  '日常熏陶': '☀️',
  '节日专题': '🏮',
}

export default function ParentChildReading({
  data,
  searchKeyword,
  stageFilter,
  methodFilter,
  favorites,
  onToggleFavorite,
}: ParentChildReadingProps) {
  const filtered = useMemo(() => {
    let list = [...data]
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase()
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(kw) ||
          r.description.toLowerCase().includes(kw) ||
          r.tags.some((t) => t.toLowerCase().includes(kw))
      )
    }
    if (stageFilter) {
      list = list.filter(
        (r) =>
          (Array.isArray(r.stage) && r.stage.includes(stageFilter as any)) ||
          r.stage === stageFilter
      )
    }
    if (methodFilter) {
      list = list.filter((r) => r.readingMethod === methodFilter)
    }
    return list
  }, [data, searchKeyword, stageFilter, methodFilter])

  if (filtered.length === 0) {
    return (
      <Box textAlign="center" py={16}>
        <Text fontSize="5xl" mb={4}>👨‍👩‍👧</Text>
        <Text fontSize="lg" color="gray.500" fontWeight={600} fontFamily="heading">
          暂无匹配的亲子共读资源
        </Text>
        <Text fontSize="sm" color="gray.400" mt={2}>
          试试调整筛选条件或搜索其他关键词
        </Text>
      </Box>
    )
  }

  return (
    <Box>
      {/* 家校共育提示 */}
      <Flex
        mb={6}
        p={4}
        bg="white"
        borderRadius="xl"
        border="1px solid"
        borderColor="brand.light"
        borderLeft="4px solid"
        borderLeftColor="brand.secondary"
        direction={{ base: 'column', md: 'row' }}
        gap={4}
      >
        <HStack spacing={3} flexShrink={0}>
          <Text fontSize="2xl">🏫</Text>
          <VStack spacing={0} align="start">
            <Text fontSize="sm" fontWeight={700} color="brand.secondary">
              家校协同共育
            </Text>
            <Text fontSize="xs" color="gray.500">
              亲子共读 · 打卡记录 · 成果上传
            </Text>
          </VStack>
        </HStack>
        <Text fontSize="sm" color="gray.600" lineHeight="1.6">
          家庭教育是书院文化传承的重要场域。本专区通过"家长+学生"双角色设计，为每个资源提供家长导读指引和学生活动任务，帮助家庭在日常共读、假期研学、节日专题中自然融入传统文化教育。
        </Text>
      </Flex>

      {/* 按场景分组 */}
      {(() => {
        const grouped: Record<string, ResourceItem[]> = {}
        for (const item of filtered) {
          const scene = item.familyScenario || '其他'
          if (!grouped[scene]) grouped[scene] = []
          grouped[scene].push(item)
        }
        return Object.entries(grouped).map(([scene, items]) => (
          <Box key={scene} mb={8}>
            <HStack mb={4} spacing={2}>
              <Text fontSize="xl">{scenarioIcons[scene] || '📌'}</Text>
              <Text fontSize="lg" fontWeight={700} fontFamily="heading" color="gray.800">
                {scene}
              </Text>
              <Badge colorScheme="orange" fontSize="xs" borderRadius="full">
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
                  variant="family"
                />
              ))}
            </SimpleGrid>
          </Box>
        ))
      })()}
    </Box>
  )
}
