import { useState, useMemo } from 'react'
import {
  Box, Text, SimpleGrid, HStack, VStack, Badge, Flex, Divider,
  Tag, TagLabel, Collapse, IconButton,
} from '@chakra-ui/react'
import { academyCultureData } from '../data/resourceMockData'
import type { AcademySource } from '../types'

interface CulturalExpansionProps {
  searchKeyword: string
}

const academyColors: Record<string, string> = {
  '岳麓书院': '#2C5F2D',
  '白鹿洞书院': '#97724F',
  '嵩阳书院': '#6B5B4F',
  '应天书院': '#8B4513',
  '石鼓书院': '#4A7C59',
}

const techTypeColors: Record<string, string> = {
  'VR/AR': 'purple',
  '3D建模': 'blue',
  '互动H5': 'orange',
  '数字展厅': 'teal',
  'AI导览': 'green',
}

const resourceTypeConfig: Record<string, { icon: string; color: string }> = {
  '地域历史': { icon: '📜', color: 'orange' },
  '民俗风情': { icon: '🎭', color: 'purple' },
  '非遗传承': { icon: '🧵', color: 'green' },
  '数智化案例': { icon: '💻', color: 'blue' },
}

export default function CulturalExpansion({ searchKeyword }: CulturalExpansionProps) {
  const [expandedAcademy, setExpandedAcademy] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!searchKeyword.trim()) return academyCultureData
    const kw = searchKeyword.toLowerCase()
    return academyCultureData.filter(
      (a) =>
        a.academyName.toLowerCase().includes(kw) ||
        a.location.toLowerCase().includes(kw) ||
        a.history.toLowerCase().includes(kw) ||
        a.folkCustoms.some((f) => f.toLowerCase().includes(kw)) ||
        a.intangibleHeritage.some((h) => h.toLowerCase().includes(kw)) ||
        a.localResources.some((r) => r.title.toLowerCase().includes(kw) || r.description.toLowerCase().includes(kw))
    )
  }, [searchKeyword])

  if (filtered.length === 0) return null

  return (
    <Box>
      {/* 标题 */}
      <Box mb={6}>
        <HStack spacing={3} mb={2}>
          <Text fontSize="2xl">🗺️</Text>
          <Text fontSize="xl" fontWeight={700} fontFamily="heading" color="gray.800">
            文化拓展——五大书院地域文化
          </Text>
        </HStack>
        <Text fontSize="sm" color="gray.500" ml="44px">
          以五大书院为核心基点，延伸至书院所在地域的历史文化、民俗风情、非遗项目及书院文化数字化转化案例
        </Text>
      </Box>

      {/* 五大书院卡片 */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
        {filtered.map((academy) => {
          const isExpanded = expandedAcademy === academy.id
          const accentColor = academyColors[academy.academyName] || '#2C5F2D'

          return (
            <Box
              key={academy.id}
              bg="white"
              borderRadius="xl"
              border="1px solid"
              borderColor={isExpanded ? accentColor : 'blackAlpha.100'}
              boxShadow={isExpanded ? '0 8px 24px rgba(0,0,0,0.1)' : 'sm'}
              overflow="hidden"
              transition="all 0.3s"
              _hover={{ boxShadow: 'md', borderColor: accentColor }}
              onClick={() => setExpandedAcademy(isExpanded ? null : academy.id)}
              cursor="pointer"
            >
              {/* 书院名称头部 */}
              <Box
                bg={`linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`}
                color="white"
                p={4}
              >
                <Text fontSize="lg" fontWeight={700} fontFamily="heading" mb={1}>
                  {academy.academyName}
                </Text>
                <Text fontSize="xs" opacity={0.85}>
                  📍 {academy.location}
                </Text>
              </Box>

              {/* 简介 */}
              <Box p={4}>
                <Text fontSize="sm" color="gray.600" noOfLines={isExpanded ? undefined : 3} lineHeight="1.6">
                  {academy.history}
                </Text>
              </Box>

              {/* 展开详情 */}
              <Collapse in={isExpanded} animateOpacity>
                <Box px={4} pb={4}>
                  <Divider mb={4} borderColor="blackAlpha.100" />

                  {/* 民俗风情 */}
                  <Box mb={4}>
                    <Text fontSize="sm" fontWeight={700} color="gray.700" mb={2}>
                      🎭 民俗风情
                    </Text>
                    <Flex gap={1.5} flexWrap="wrap">
                      {academy.folkCustoms.map((item) => (
                        <Tag key={item} size="sm" variant="subtle" colorScheme="purple" borderRadius="full">
                          <TagLabel>{item}</TagLabel>
                        </Tag>
                      ))}
                    </Flex>
                  </Box>

                  {/* 非遗文化 */}
                  <Box mb={4}>
                    <Text fontSize="sm" fontWeight={700} color="gray.700" mb={2}>
                      🧵 非遗传承
                    </Text>
                    <Flex gap={1.5} flexWrap="wrap">
                      {academy.intangibleHeritage.map((item) => (
                        <Tag key={item} size="sm" variant="subtle" colorScheme="green" borderRadius="full">
                          <TagLabel>{item}</TagLabel>
                        </Tag>
                      ))}
                    </Flex>
                  </Box>

                  {/* 数字化案例 */}
                  {academy.digitalCases.length > 0 && (
                    <Box mb={4}>
                      <Text fontSize="sm" fontWeight={700} color="gray.700" mb={2}>
                        💻 数字化转化案例
                      </Text>
                      <VStack spacing={2} align="stretch">
                        {academy.digitalCases.map((dc) => (
                          <Box
                            key={dc.title}
                            p={3}
                            bg="gray.50"
                            borderRadius="md"
                            border="1px solid"
                            borderColor="blackAlpha.50"
                          >
                            <HStack spacing={2} mb={1}>
                              <Text fontSize="sm" fontWeight={600} color="gray.800">
                                {dc.title}
                              </Text>
                              <Badge colorScheme={techTypeColors[dc.techType] || 'gray'} fontSize="xs" borderRadius="full">
                                {dc.techType}
                              </Badge>
                            </HStack>
                            <Text fontSize="xs" color="gray.500" lineHeight="1.5">
                              {dc.description}
                            </Text>
                          </Box>
                        ))}
                      </VStack>
                    </Box>
                  )}

                  {/* 拓展资源链接 */}
                  <Box>
                    <Text fontSize="sm" fontWeight={700} color="gray.700" mb={2}>
                      🔗 相关拓展资源
                    </Text>
                    <VStack spacing={2} align="stretch">
                      {academy.localResources.map((lr) => {
                        const cfg = resourceTypeConfig[lr.type] || { icon: '📄', color: 'gray' }
                        return (
                          <HStack
                            key={lr.title}
                            p={2.5}
                            bg="gray.50"
                            borderRadius="md"
                            border="1px solid"
                            borderColor="blackAlpha.50"
                            spacing={3}
                            _hover={{ bg: 'brand.light', borderColor: 'brand.accent' }}
                            transition="all 0.2s"
                          >
                            <Text fontSize="xl" flexShrink={0}>{lr.coverEmoji}</Text>
                            <Box flex={1}>
                              <HStack spacing={2} mb={0.5}>
                                <Text fontSize="sm" fontWeight={600} color="gray.800">
                                  {lr.title}
                                </Text>
                                <Badge colorScheme={cfg.color} fontSize="xs" borderRadius="full">
                                  {lr.type}
                                </Badge>
                              </HStack>
                              <Text fontSize="xs" color="gray.500" noOfLines={2}>
                                {lr.description}
                              </Text>
                            </Box>
                            <Text fontSize="xs" color="brand.primary" fontWeight={600} flexShrink={0}>
                              查看 →
                            </Text>
                          </HStack>
                        )
                      })}
                    </VStack>
                  </Box>
                </Box>
              </Collapse>

              {/* 底部展开提示 */}
              <Box
                px={4}
                py={2.5}
                bg="gray.50"
                borderTop="1px solid"
                borderColor="blackAlpha.50"
                textAlign="center"
              >
                <Text fontSize="xs" color="brand.secondary" fontWeight={600}>
                  {isExpanded ? '收起详情 ▲' : '展开查看地域文化详情 ▼'}
                </Text>
              </Box>
            </Box>
          )
        })}
      </SimpleGrid>
    </Box>
  )
}
