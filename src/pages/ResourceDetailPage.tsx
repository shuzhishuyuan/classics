import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Text, VStack, HStack, Flex, Breadcrumb, BreadcrumbItem,
  BreadcrumbLink, Button, Badge, SimpleGrid,
} from '@chakra-ui/react'
import VideoPlayer from '../components/VideoPlayer'
import DocumentPreview from '../components/DocumentPreview'
import ResourceCard from '../components/ResourceCard'
import { allResources, studentLearningData, parentChildReadingData } from '../data/resourceMockData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { ResourceItem } from '../types/resource'

/** 学生学习资源详情 */
function StudentResourceView({ resource, favorites, onToggleFavorite }: {
  resource: ResourceItem
  favorites: string[]
  onToggleFavorite: (id: string) => void
}) {
  return (
    <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
      {/* 主内容区 */}
      <Box flex={1} maxW="860px">
        {/* 资源封面 */}
        <Box
          h="280px"
          borderRadius="xl"
          bg="linear-gradient(135deg, #97724F 0%, #2C5F2D 100%)"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          mb={6}
          position="relative"
        >
          <Text fontSize="7xl" mb={4}>{resource.coverEmoji || '📄'}</Text>
          <Text fontSize="xl" fontWeight={700} color="white" fontFamily="heading" textAlign="center" px={8}>
            {resource.title}
          </Text>
          <Text fontSize="sm" color="whiteAlpha.700" mt={2}>
            {resource.type} · {resource.learningTime || resource.duration}
          </Text>
        </Box>

        {/* 资源详情 */}
        <Box bg="white" borderRadius="xl" border="1px solid" borderColor="blackAlpha.100" p={6} mb={6}>
          <Text fontSize="lg" fontWeight={700} fontFamily="heading" color="gray.800" mb={4}>
            📖 资源详情
          </Text>

          {/* 元信息 */}
          <HStack spacing={4} mb={4} flexWrap="wrap">
            <Badge colorScheme="blue" borderRadius="full" fontSize="sm" px={3} py={1}>
              {resource.type}
            </Badge>
            {(Array.isArray(resource.stage) ? resource.stage : [resource.stage]).map((s) => (
              <Badge key={s} colorScheme="green" variant="subtle" borderRadius="full" fontSize="sm" px={3} py={1}>
                {s}
              </Badge>
            ))}
            {resource.rating && (
              <Text fontSize="sm" color="brand.accent" fontWeight={600}>
                ⭐ {resource.rating} 分
              </Text>
            )}
          </HStack>

          <Text fontSize="sm" color="gray.600" lineHeight="1.8" mb={6}>
            {resource.description}
          </Text>

          {/* 标签 */}
          <HStack spacing={2} mb={4} flexWrap="wrap">
            {resource.tags.map((tag) => (
              <Badge key={tag} variant="subtle" colorScheme="gray" borderRadius="full" fontSize="xs">
                {tag}
              </Badge>
            ))}
          </HStack>

          {/* 学习操作按钮 */}
          <HStack spacing={3}>
            <Button
              colorScheme="green"
              bg="brand.primary"
              _hover={{ bg: 'brand.dark' }}
              borderRadius="full"
              leftIcon={<Text>▶</Text>}
              onClick={() => {}}
            >
              开始学习
            </Button>
            <Button
              variant="outline"
              colorScheme="green"
              borderRadius="full"
              onClick={() => onToggleFavorite(resource.id)}
            >
              {favorites.includes(resource.id) ? '❤️ 已收藏' : '🤍 收藏'}
            </Button>
          </HStack>
        </Box>
      </Box>

      {/* 右侧信息 */}
      <Box w={{ base: 'full', lg: '300px' }} flexShrink={0}>
        <Box bg="white" borderRadius="xl" border="1px solid" borderColor="blackAlpha.100" p={5}>
          <Text fontSize="md" fontWeight={700} fontFamily="heading" color="gray.800" mb={4}>
            资源信息
          </Text>
          <VStack spacing={3} align="stretch">
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.500">资源类型</Text>
              <Text fontSize="sm" fontWeight={600}>{resource.type}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.500">学习时长</Text>
              <Text fontSize="sm" fontWeight={600}>{resource.learningTime || resource.duration || '灵活安排'}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.500">适用学段</Text>
              <Text fontSize="sm" fontWeight={600}>
                {Array.isArray(resource.stage) ? resource.stage.join('、') : resource.stage}
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.500">更新时间</Text>
              <Text fontSize="sm" fontWeight={600}>{resource.updatedAt}</Text>
            </Flex>
          </VStack>
        </Box>
      </Box>
    </Flex>
  )
}

/** 亲子共读资源详情 */
function FamilyResourceView({ resource }: { resource: ResourceItem }) {
  return (
    <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
      <Box flex={1} maxW="860px">
        {/* 封面 */}
        <Box
          h="280px"
          borderRadius="xl"
          bg="linear-gradient(135deg, #6B5B4F 0%, #2C5F2D 100%)"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          mb={6}
        >
          <Text fontSize="7xl" mb={4}>{resource.coverEmoji || '👨‍👩‍👧'}</Text>
          <Text fontSize="xl" fontWeight={700} color="white" fontFamily="heading" textAlign="center" px={8}>
            {resource.title}
          </Text>
          <Text fontSize="sm" color="whiteAlpha.700" mt={2}>
            {resource.familyScenario} · {resource.readingMethod}
          </Text>
        </Box>

        {/* 详情区 */}
        <Box bg="white" borderRadius="xl" border="1px solid" borderColor="blackAlpha.100" p={6} mb={6}>
          <Text fontSize="lg" fontWeight={700} fontFamily="heading" color="gray.800" mb={4}>
            👨‍👩‍👧 亲子共读指引
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
            <Box p={4} bg="orange.50" borderRadius="lg" border="1px solid" borderColor="orange.100">
              <Text fontSize="sm" fontWeight={700} color="orange.700" mb={2}>👩‍🏫 家长导读提示</Text>
              <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                请家长提前阅读资源内容，了解本次共读的核心要点。在共读过程中，引导孩子关注{resource.tags.slice(0, 2).join('、')}等主题，鼓励孩子表达自己的理解和感受。
              </Text>
            </Box>
            <Box p={4} bg="green.50" borderRadius="lg" border="1px solid" borderColor="green.100">
              <Text fontSize="sm" fontWeight={700} color="green.700" mb={2}>👧 学生活动任务</Text>
              <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                认真聆听/阅读资源内容，完成以下任务：① 用自己的话复述主要内容；② 找出你最喜欢的部分并说明理由；③ 与家长讨论资源中提出的讨论话题。
              </Text>
            </Box>
          </SimpleGrid>

          <Text fontSize="sm" color="gray.600" lineHeight="1.8" mb={6}>
            {resource.description}
          </Text>

          <HStack spacing={3} flexWrap="wrap">
            <Button colorScheme="green" bg="brand.primary" _hover={{ bg: 'brand.dark' }} borderRadius="full" leftIcon={<Text>▶</Text>}>
              开始共读
            </Button>
            <Button variant="outline" colorScheme="orange" borderRadius="full" leftIcon={<Text>📋</Text>}>
              打卡记录
            </Button>
            <Button variant="ghost" color="brand.accent" borderRadius="full" leftIcon={<Text>📤</Text>}>
              上传成果
            </Button>
          </HStack>
        </Box>
      </Box>

      <Box w={{ base: 'full', lg: '300px' }} flexShrink={0}>
        <Box bg="white" borderRadius="xl" border="1px solid" borderColor="blackAlpha.100" p={5}>
          <Text fontSize="md" fontWeight={700} fontFamily="heading" color="gray.800" mb={4}>资源信息</Text>
          <VStack spacing={3} align="stretch">
            <Flex justify="space-between"><Text fontSize="sm" color="gray.500">适用场景</Text><Text fontSize="sm" fontWeight={600}>{resource.familyScenario}</Text></Flex>
            <Flex justify="space-between"><Text fontSize="sm" color="gray.500">共读方式</Text><Text fontSize="sm" fontWeight={600}>{resource.readingMethod}</Text></Flex>
            <Flex justify="space-between"><Text fontSize="sm" color="gray.500">预计时长</Text><Text fontSize="sm" fontWeight={600}>{resource.duration}</Text></Flex>
            <Flex justify="space-between"><Text fontSize="sm" color="gray.500">适用学段</Text><Text fontSize="sm" fontWeight={600}>{Array.isArray(resource.stage) ? resource.stage.join('、') : resource.stage}</Text></Flex>
          </VStack>
        </Box>
      </Box>
    </Flex>
  )
}

export default function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [favorites, setFavorites] = useLocalStorage<string[]>('resource_favorites', [])

  const resource = allResources.find((r) => r.id === id)

  const handleToggleFavorite = (rid: string) => {
    setFavorites((prev) =>
      prev.includes(rid) ? prev.filter((fid) => fid !== rid) : [...prev, rid]
    )
  }

  // 未找到资源
  if (!resource) {
    return (
      <Box textAlign="center" py={20}>
        <Text fontSize="6xl" mb={4}>🔍</Text>
        <Text fontSize="lg" color="gray.500" fontWeight={600} fontFamily="heading">
          未找到该资源
        </Text>
        <Text fontSize="sm" color="gray.400" mt={2} mb={6}>
          资源可能已被移除或链接无效
        </Text>
        <Button
          colorScheme="green"
          bg="brand.primary"
          borderRadius="full"
          onClick={() => navigate('/resources')}
        >
          返回资源共享
        </Button>
      </Box>
    )
  }

  /** 根据资源类型渲染不同预览 */
  const renderContent = () => {
    switch (resource.category) {
      case '名师微课':
        return <VideoPlayer resource={resource} />
      case '教师备课':
        return <DocumentPreview resource={resource} />
      case '学生学习':
        return (
          <StudentResourceView
            resource={resource}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )
      case '亲子共读':
        return <FamilyResourceView resource={resource} />
      default:
        return <DocumentPreview resource={resource} />
    }
  }

  return (
    <Box maxW="1200px" mx="auto">
      {/* 面包屑导航 */}
      <Breadcrumb mb={4} fontSize="sm" color="gray.500" separator="›">
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => navigate('/resources')} _hover={{ color: 'brand.primary' }}>
            资源共享
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => navigate('/resources')} _hover={{ color: 'brand.primary' }}>
            {resource.category}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink color="brand.primary" fontWeight={600}>
            {resource.title.length > 30 ? resource.title.slice(0, 30) + '...' : resource.title}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* 内容区 */}
      {renderContent()}
    </Box>
  )
}
