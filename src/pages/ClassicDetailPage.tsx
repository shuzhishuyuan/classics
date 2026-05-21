import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Text, HStack, VStack, Badge, Button, IconButton, Tooltip, Divider,
  Flex, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Collapse,
} from '@chakra-ui/react'
import { ChevronLeftIcon, HeartIcon, HeartOutlineIcon, StarIcon, StarOutlineIcon, ChevronRightIcon } from '../components/Icons'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { classicsData } from '../data/classics'
import type { Difficulty, EducateDimension, GenreType } from '../types'
import { useState } from 'react'

/** 难度星级 */
function DifficultyStars({ level }: { level: Difficulty }) {
  return (
    <HStack spacing={0.5}>
      {[1, 2, 3, 4, 5].map((star) => (
        star <= level
          ? <StarIcon key={star} w={4} h={4} color="brand.accent" />
          : <StarOutlineIcon key={star} w={4} h={4} color="gray.300" />
      ))}
    </HStack>
  )
}

/** 维度颜色映射 */
const dimensionColors: Record<EducateDimension, string> = {
  '价值引领': 'red',
  '知识建构': 'blue',
  '制度规约': 'purple',
  '空间叙事': 'teal',
  '实践养成': 'green',
}

/** 体裁颜色映射 */
const genreColors: Record<GenreType, string> = {
  '学规': 'green',
  '语录': 'orange',
  '会讲记录': 'blue',
  '碑刻': 'purple',
  '文集': 'cyan',
}

export default function ClassicDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', [])
  const [expandedVolumes, setExpandedVolumes] = useState<string[]>([])

  const classic = classicsData.find(c => c.id === id)

  if (!classic) {
    return (
      <Box pt="72px" textAlign="center" py={20}>
        <Text fontSize="5xl" mb={4}>🔍</Text>
        <Text fontSize="lg" color="gray.500">未找到该典籍</Text>
        <Button mt={4} variant="ghost" colorScheme="green" onClick={() => navigate('/classics')}>
          返回典籍列表
        </Button>
      </Box>
    )
  }

  const isFavorited = favorites.includes(classic.id)
  const totalChapters = classic.chapters.reduce((sum, vol) => sum + vol.chapters.length, 0)

  const toggleFavorite = () => {
    setFavorites(prev =>
      prev.includes(classic.id)
        ? prev.filter(fid => fid !== classic.id)
        : [...prev, classic.id]
    )
  }

  const toggleVolume = (volId: string) => {
    setExpandedVolumes(prev =>
      prev.includes(volId) ? prev.filter(v => v !== volId) : [...prev, volId]
    )
  }

  return (
    <Box pt="72px" minH="100vh" bg="brand.bg">
      <Box maxW="1000px" mx="auto" px={6} py={8}>
        {/* 面包屑导航 */}
        <Breadcrumb
          spacing={1}
          separator={<ChevronRightIcon w={3} h={3} color="gray.400" />}
          mb={6}
          fontSize="sm"
        >
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/classics')} color="brand.primary">
              经典研习
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink color="gray.500">{classic.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* 顶部信息区 */}
        <Flex
          bg="white"
          borderRadius="2xl"
          p={8}
          gap={8}
          boxShadow="sm"
          border="1px solid"
          borderColor="blackAlpha.100"
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'center', md: 'flex-start' }}
        >
          {/* 封面 */}
          <Box
            w={{ base: '120px', md: '160px' }}
            h={{ base: '120px', md: '160px' }}
            bg={`linear-gradient(135deg, #2C5F2D, #1A3B1A)`}
            borderRadius="xl"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="6xl"
            flexShrink={0}
          >
            {classic.coverEmoji}
          </Box>

          {/* 信息 */}
          <Box flex={1} textAlign={{ base: 'center', md: 'left' }}>
            <HStack spacing={3} mb={2} justify={{ base: 'center', md: 'flex-start' }}>
              <Text fontSize="3xl" fontWeight={900} fontFamily="heading" color="gray.800">
                {classic.name}
              </Text>
              <Tooltip label={isFavorited ? '取消收藏' : '收藏'}>
                <IconButton
                  aria-label="收藏"
                  icon={isFavorited ? <HeartIcon /> : <HeartOutlineIcon />}
                  size="sm"
                  variant="ghost"
                  color={isFavorited ? 'red.400' : 'gray.400'}
                  onClick={toggleFavorite}
                />
              </Tooltip>
            </HStack>

            <HStack spacing={3} mb={2} justify={{ base: 'center', md: 'flex-start' }} flexWrap="wrap">
              <Text fontSize="sm" color="gray.500">{classic.author}</Text>
              <Text fontSize="sm" color="gray.400">·</Text>
              <Text fontSize="sm" color="gray.500">{classic.dynasty}</Text>
              <Badge colorScheme={genreColors[classic.genre] || 'gray'} fontSize="sm" px={3} py={0.5} borderRadius="full">
                {classic.genre}
              </Badge>
              <Badge colorScheme="teal" fontSize="sm" px={3} py={0.5} borderRadius="full">
                {classic.academySource}
              </Badge>
            </HStack>

            {/* 育人维度标签 */}
            <HStack spacing={2} mb={3} justify={{ base: 'center', md: 'flex-start' }} flexWrap="wrap">
              {classic.dimensions.map(dim => (
                <Badge key={dim} colorScheme={dimensionColors[dim]} fontSize="xs" px={2} py={0.5} borderRadius="full">
                  {dim}
                </Badge>
              ))}
              <Text fontSize="xs" color="gray.400">·</Text>
              <Text fontSize="xs" color="gray.500">适配 {classic.schoolLevel.join('、')}</Text>
            </HStack>

            <HStack spacing={4} mb={4} justify={{ base: 'center', md: 'flex-start' }}>
              <DifficultyStars level={classic.difficulty} />
              <Text fontSize="sm" color="gray.500">
                👥 {classic.studentCount}人学习 · {totalChapters}章
              </Text>
            </HStack>

            <Text fontSize="sm" color="gray.600" lineHeight="1.8" mb={6} noOfLines={3}>
              {classic.description}
            </Text>

            {/* 开始阅读按钮 */}
            <Button
              size="lg"
              colorScheme="green"
              bg="brand.primary"
              px={10}
              py={6}
              fontSize="md"
              fontWeight={600}
              borderRadius="full"
              _hover={{ bg: 'brand.dark' }}
              leftIcon={<Text fontSize="lg">📖</Text>}
              onClick={() => {
                const firstVol = classic.chapters[0]
                const firstCh = firstVol?.chapters[0]
                if (firstCh) {
                  navigate(`/classics/${classic.id}/read/${firstVol.id}/${firstCh.id}`)
                }
              }}
            >
              开始阅读
            </Button>
          </Box>
        </Flex>

        {/* 目录树 */}
        <Box mt={8}>
          <Text fontSize="xl" fontWeight={700} fontFamily="heading" color="gray.800" mb={4}>
            目录
          </Text>
          <Box
            bg="white"
            borderRadius="xl"
            p={4}
            boxShadow="sm"
            border="1px solid"
            borderColor="blackAlpha.100"
          >
            {classic.chapters.map((volume) => {
              const isExpanded = expandedVolumes.includes(volume.id)
              return (
                <Box key={volume.id}>
                  {/* 卷/篇标题 */}
                  <Flex
                    px={4}
                    py={3}
                    cursor="pointer"
                    onClick={() => toggleVolume(volume.id)}
                    _hover={{ bg: 'blackAlpha.50' }}
                    borderRadius="md"
                    align="center"
                    justify="space-between"
                  >
                    <HStack spacing={3}>
                      <Text
                        fontSize="sm"
                        color="brand.primary"
                        fontWeight={600}
                        fontFamily="heading"
                      >
                        {volume.title}
                      </Text>
                      <Badge colorScheme="gray" fontSize="xs" borderRadius="full">
                        {volume.chapters.length}章
                      </Badge>
                    </HStack>
                    <ChevronRightIcon
                      w={4}
                      h={4}
                      color="gray.400"
                      style={{
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    />
                  </Flex>

                  {/* 章节列表 */}
                  <Collapse in={isExpanded} animateOpacity>
                    <VStack spacing={0} align="stretch" ml={6} borderLeft="2px solid" borderColor="brand.light">
                      {volume.chapters.map((ch) => (
                        <Flex
                          key={ch.id}
                          px={4}
                          py={2.5}
                          ml={-1}
                          borderLeft="2px solid"
                          borderColor="transparent"
                          cursor="pointer"
                          _hover={{ bg: 'blackAlpha.50', borderColor: 'brand.primary' }}
                          transition="all 0.15s"
                          onClick={() => navigate(`/classics/${classic.id}/read/${volume.id}/${ch.id}`)}
                        >
                          <Text fontSize="sm" color="gray.600">
                            {ch.title}
                          </Text>
                        </Flex>
                      ))}
                    </VStack>
                  </Collapse>
                  <Divider borderColor="gray.100" />
                </Box>
              )
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
