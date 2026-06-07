import { useMemo } from 'react'
import { Box, Text, SimpleGrid, HStack, Badge } from '@chakra-ui/react'
import ResourceCard from './ResourceCard'
import CulturalExpansion from './CulturalExpansion'
import type { ResourceItem } from '../types/resource'

interface StudentLearningProps {
  data: ResourceItem[]
  searchKeyword: string
  stageFilter: string
  typeFilter: string
  favorites: string[]
  onToggleFavorite: (id: string) => void
}

const typeLabels: Record<string, { icon: string; label: string }> = {
  '图文': { icon: '🖼️', label: '图文资源' },
  '视频': { icon: '🎬', label: '视频资源' },
  '音频': { icon: '🎵', label: '音频资源' },
  '任务单': { icon: '✏️', label: '学习任务单' },
}

export default function StudentLearningResources({
  data,
  searchKeyword,
  stageFilter,
  typeFilter,
  favorites,
  onToggleFavorite,
}: StudentLearningProps) {
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
    if (typeFilter) {
      list = list.filter((r) => r.type === typeFilter)
    }
    return list
  }, [data, searchKeyword, stageFilter, typeFilter])

  return (
    <Box>
      {/* 学习资源本身 */}
      {filtered.length > 0 ? (
        <>
          {/* 按资源类型分组 */}
          {(() => {
            const grouped: Record<string, ResourceItem[]> = {}
            for (const item of filtered) {
              const t = item.type || '其他'
              if (!grouped[t]) grouped[t] = []
              grouped[t].push(item)
            }
            return Object.entries(grouped).map(([type, items]) => (
              <Box key={type} mb={8}>
                <HStack mb={4} spacing={2}>
                  <Text fontSize="xl">{typeLabels[type]?.icon || '📄'}</Text>
                  <Text fontSize="lg" fontWeight={700} fontFamily="heading" color="gray.800">
                    {typeLabels[type]?.label || type}
                  </Text>
                  <Badge colorScheme="blue" fontSize="xs" borderRadius="full">
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
                      variant="student"
                    />
                  ))}
                </SimpleGrid>
              </Box>
            ))
          })()}
        </>
      ) : (
        <Box textAlign="center" py={12}>
          <Text fontSize="5xl" mb={4}>✏️</Text>
          <Text fontSize="lg" color="gray.500" fontWeight={600} fontFamily="heading">
            暂无匹配的学习资源
          </Text>
          <Text fontSize="sm" color="gray.400" mt={2}>
            试试调整筛选条件或搜索其他关键词
          </Text>
        </Box>
      )}

      {/* 文化拓展——五大书院地域文化（独立板块） */}
      <Box mt={10}>
        <CulturalExpansion searchKeyword={searchKeyword} />
      </Box>
    </Box>
  )
}
