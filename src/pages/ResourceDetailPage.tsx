import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Text, VStack, HStack, Flex, Breadcrumb, BreadcrumbItem,
  BreadcrumbLink, Button, Badge, SimpleGrid, Spinner,
} from '@chakra-ui/react'
import VideoPlayer from '../components/VideoPlayer'
import DocumentPreview from '../components/DocumentPreview'
import { fetchResourceDetail } from '../api/resources'
import type { ResourceItem } from '../types/resource'

function StudentResourceView({ resource, favorites, onToggleFavorite }: { resource: ResourceItem; favorites: string[]; onToggleFavorite: (id: string) => void }) {
  return (
    <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
      <Box flex={1} maxW="860px">
        <Box h="280px" borderRadius="xl" bg="linear-gradient(135deg, #97724F 0%, #2C5F2D 100%)" display="flex" flexDirection="column" alignItems="center" justifyContent="center" mb={6}>
          <Text fontSize="7xl" mb={4}>{resource.coverEmoji || '📄'}</Text>
          <Text fontSize="xl" fontWeight={700} color="white" fontFamily="heading" textAlign="center" px={8}>{resource.title}</Text>
          <Text fontSize="sm" color="whiteAlpha.700" mt={2}>{resource.type} · {resource.learningTime || resource.duration}</Text>
        </Box>
        <Box bg="white" borderRadius="xl" border="1px solid" borderColor="blackAlpha.100" p={6} mb={6}>
          <Text fontSize="lg" fontWeight={700} fontFamily="heading" color="gray.800" mb={4}>📖 资源详情</Text>
          <HStack spacing={4} mb={4} flexWrap="wrap">
            <Badge colorScheme="blue" borderRadius="full" fontSize="sm" px={3} py={1}>{resource.type}</Badge>
            {(Array.isArray(resource.stage) ? resource.stage : [resource.stage]).map(s => <Badge key={s} colorScheme="green" variant="subtle" borderRadius="full" fontSize="sm" px={3} py={1}>{s}</Badge>)}
          </HStack>
          <Text fontSize="sm" color="gray.600" lineHeight="1.8" mb={6}>{resource.description}</Text>
          <HStack spacing={2} mb={4} flexWrap="wrap">{resource.tags.map(tag => <Badge key={tag} variant="subtle" colorScheme="gray" borderRadius="full" fontSize="xs">{tag}</Badge>)}</HStack>
          <HStack spacing={3}>
            <Button colorScheme="green" bg="brand.primary" _hover={{ bg: 'brand.dark' }} borderRadius="full" leftIcon={<Text>▶</Text>}>开始学习</Button>
            <Button variant="outline" colorScheme="green" borderRadius="full" onClick={() => onToggleFavorite(resource.id)}>{favorites.includes(resource.id) ? '❤️ 已收藏' : '🤍 收藏'}</Button>
          </HStack>
        </Box>
      </Box>
      <Box w={{ base: 'full', lg: '300px' }} flexShrink={0}>
        <Box bg="white" borderRadius="xl" border="1px solid" borderColor="blackAlpha.100" p={5}>
          <Text fontSize="md" fontWeight={700} fontFamily="heading" color="gray.800" mb={4}>资源信息</Text>
          <VStack spacing={3} align="stretch">
            <Flex justify="space-between"><Text fontSize="sm" color="gray.500">学习时长</Text><Text fontSize="sm" fontWeight={600}>{resource.learningTime || resource.duration || '灵活安排'}</Text></Flex>
            <Flex justify="space-between"><Text fontSize="sm" color="gray.500">适用学段</Text><Text fontSize="sm" fontWeight={600}>{Array.isArray(resource.stage) ? resource.stage.join('、') : resource.stage}</Text></Flex>
            <Flex justify="space-between"><Text fontSize="sm" color="gray.500">更新时间</Text><Text fontSize="sm" fontWeight={600}>{resource.updatedAt}</Text></Flex>
          </VStack>
        </Box>
      </Box>
    </Flex>
  )
}

function FamilyResourceView({ resource }: { resource: ResourceItem }) {
  return (
    <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
      <Box flex={1} maxW="860px">
        <Box h="280px" borderRadius="xl" bg="linear-gradient(135deg, #6B5B4F 0%, #2C5F2D 100%)" display="flex" flexDirection="column" alignItems="center" justifyContent="center" mb={6}>
          <Text fontSize="7xl" mb={4}>{resource.coverEmoji || '👨‍👩‍👧'}</Text>
          <Text fontSize="xl" fontWeight={700} color="white" fontFamily="heading" textAlign="center" px={8}>{resource.title}</Text>
        </Box>
        <Box bg="white" borderRadius="xl" border="1px solid" borderColor="blackAlpha.100" p={6} mb={6}>
          <Text fontSize="lg" fontWeight={700} fontFamily="heading" color="gray.800" mb={4}>👨‍👩‍👧 亲子共读指引</Text>
          <Text fontSize="sm" color="gray.600" lineHeight="1.8" mb={6}>{resource.description}</Text>
          <HStack spacing={3} flexWrap="wrap">
            <Button colorScheme="green" bg="brand.primary" _hover={{ bg: 'brand.dark' }} borderRadius="full" leftIcon={<Text>▶</Text>}>开始共读</Button>
            <Button variant="outline" colorScheme="orange" borderRadius="full" leftIcon={<Text>📋</Text>}>打卡记录</Button>
          </HStack>
        </Box>
      </Box>
    </Flex>
  )
}

export default function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [resource, setResource] = useState<ResourceItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchResourceDetail(id).then(res => {
      if (res.code === 200) setResource(res.data)
      setLoading(false)
    })
  }, [id])

  if (loading) return <Box textAlign="center" py={20}><Spinner color="brand.primary" size="lg" /></Box>
  if (!resource) return (
    <Box textAlign="center" py={20}><Text fontSize="6xl" mb={4}>🔍</Text><Text fontSize="lg" color="gray.500">未找到该资源</Text>
      <Button mt={4} colorScheme="green" bg="brand.primary" borderRadius="full" onClick={() => navigate('/resources')}>返回资源共享</Button></Box>
  )

  return (
    <Box maxW="1200px" mx="auto">
      <Breadcrumb mb={4} fontSize="sm" color="gray.500" separator="›">
        <BreadcrumbItem><BreadcrumbLink onClick={() => navigate('/resources')}>资源共享</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbItem><BreadcrumbLink onClick={() => navigate('/resources')}>{resource.category}</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbItem isCurrentPage><BreadcrumbLink color="brand.primary" fontWeight={600}>{resource.title.slice(0, 30)}</BreadcrumbLink></BreadcrumbItem>
      </Breadcrumb>
      {resource.category === '名师微课' ? <VideoPlayer resource={resource} /> :
       resource.category === '教师备课' ? <DocumentPreview resource={resource} /> :
       resource.category === '学生学习' ? <StudentResourceView resource={resource} favorites={[]} onToggleFavorite={() => {}} /> :
       resource.category === '亲子共读' ? <FamilyResourceView resource={resource} /> :
       <DocumentPreview resource={resource} />}
    </Box>
  )
}
