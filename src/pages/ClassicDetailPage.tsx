import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Text, HStack, VStack, Badge, Button, IconButton, Tooltip, Divider,
  Flex, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Collapse, Spinner,
} from '@chakra-ui/react'
import { ChevronLeftIcon, HeartIcon, HeartOutlineIcon, StarIcon, StarOutlineIcon, ChevronRightIcon } from '../components/Icons'
import { fetchClassicDetail } from '../api/classics'
import { toggleFavorite } from '../api/learning'
import type { Classic, Difficulty, EducateDimension, GenreType } from '../types'

function DifficultyStars({ level }: { level: Difficulty }) {
  return <HStack spacing={0.5}>{[1,2,3,4,5].map(s => s <= level ? <StarIcon key={s} w={4} h={4} color="brand.accent" /> : <StarOutlineIcon key={s} w={4} h={4} color="gray.300" />)}</HStack>
}

const dimensionColors: Record<EducateDimension, string> = {
  '价值引领': 'red', '知识建构': 'blue', '制度规约': 'purple', '空间叙事': 'teal', '实践养成': 'green',
}
const genreColors: Record<GenreType, string> = {
  '学规': 'green', '语录': 'orange', '会讲记录': 'blue', '碑刻': 'purple', '文集': 'cyan',
}

export default function ClassicDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [classic, setClassic] = useState<Classic | null>(null)
  const [isFav, setIsFav] = useState(false)
  const [expandedVolumes, setExpandedVolumes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchClassicDetail(id).then(res => {
      if (res.code === 200) { setClassic(res.data); setIsFav((res.data as any).isFavorited || false) }
      setLoading(false)
    })
  }, [id])

  const handleToggleFav = async () => {
    if (!id) return
    const res = await toggleFavorite(id)
    if (res.code === 200) setIsFav(res.data.favorited)
  }

  if (loading) return <Box textAlign="center" py={20}><Spinner color="brand.primary" size="lg" /></Box>
  if (!classic) return (
    <Box textAlign="center" py={20}>
      <Text fontSize="5xl" mb={4}>🔍</Text>
      <Text fontSize="lg" color="gray.500">未找到该典籍</Text>
      <Button mt={4} variant="ghost" colorScheme="green" onClick={() => navigate('/classics')}>返回典籍列表</Button>
    </Box>
  )

  const totalChapters = classic.chapters.reduce((s, v) => s + v.chapters.length, 0)
  const toggleVolume = (vid: string) => setExpandedVolumes(prev => prev.includes(vid) ? prev.filter(v => v !== vid) : [...prev, vid])

  return (
    <Box minH="100vh" bg="brand.bg">
      <Box maxW="1000px" mx="auto" px={6} py={8}>
        <Breadcrumb spacing={1} separator={<ChevronRightIcon w={3} h={3} color="gray.400" />} mb={6} fontSize="sm">
          <BreadcrumbItem><BreadcrumbLink onClick={() => navigate('/classics')} color="brand.primary">经典研习</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbItem isCurrentPage><BreadcrumbLink color="gray.500">{classic.name}</BreadcrumbLink></BreadcrumbItem>
        </Breadcrumb>

        <Flex bg="white" borderRadius="2xl" p={8} gap={8} boxShadow="sm" border="1px solid" borderColor="blackAlpha.100"
          direction={{ base: 'column', md: 'row' }} align={{ base: 'center', md: 'flex-start' }}>
          <Box w="160px" h="160px" bg="linear-gradient(135deg, #2C5F2D, #1A3B1A)" borderRadius="xl"
            display="flex" alignItems="center" justifyContent="center" fontSize="6xl" flexShrink={0}>
            {classic.coverEmoji}
          </Box>
          <Box flex={1}>
            <HStack spacing={3} mb={2}>
              <Text fontSize="3xl" fontWeight={900} fontFamily="heading" color="gray.800">{classic.name}</Text>
              <Tooltip label={isFav ? '取消收藏' : '收藏'}>
                <IconButton aria-label="收藏" icon={isFav ? <HeartIcon /> : <HeartOutlineIcon />} size="sm"
                  variant="ghost" color={isFav ? 'red.400' : 'gray.400'} onClick={handleToggleFav} />
              </Tooltip>
            </HStack>
            <HStack spacing={3} mb={2} flexWrap="wrap">
              <Text fontSize="sm" color="gray.500">{classic.author} · {classic.dynasty}</Text>
              <Badge colorScheme={genreColors[classic.genre]} fontSize="sm" px={3} py={0.5} borderRadius="full">{classic.genre}</Badge>
              <Badge colorScheme="teal" fontSize="sm" px={3} py={0.5} borderRadius="full">{classic.academySource}</Badge>
            </HStack>
            <HStack spacing={2} mb={3} flexWrap="wrap">
              {classic.dimensions.map(d => <Badge key={d} colorScheme={dimensionColors[d]} fontSize="xs" px={2} py={0.5} borderRadius="full">{d}</Badge>)}
              <Text fontSize="xs" color="gray.400">适配 {classic.schoolLevel.join('、')}</Text>
            </HStack>
            <HStack spacing={4} mb={4}><DifficultyStars level={classic.difficulty} /><Text fontSize="sm" color="gray.500">👥 {classic.studentCount}人学习 · {totalChapters}章</Text></HStack>
            <Text fontSize="sm" color="gray.600" lineHeight="1.8" mb={6} noOfLines={3}>{classic.description}</Text>
            <Button size="lg" colorScheme="green" bg="brand.primary" px={10} py={6} fontSize="md" fontWeight={600}
              borderRadius="full" _hover={{ bg: 'brand.dark' }} leftIcon={<Text fontSize="lg">📖</Text>}
              onClick={() => {
                const v = classic.chapters[0]; const ch = v?.chapters[0]
                if (ch) navigate(`/classics/${classic.id}/read/${v.id}/${ch.id}`)
              }}>开始阅读</Button>
          </Box>
        </Flex>

        <Box mt={8}>
          <Text fontSize="xl" fontWeight={700} fontFamily="heading" color="gray.800" mb={4}>目录</Text>
          <Box bg="white" borderRadius="xl" p={4} boxShadow="sm" border="1px solid" borderColor="blackAlpha.100">
            {classic.chapters.map(vol => {
              const isOpen = expandedVolumes.includes(vol.id)
              return (
                <Box key={vol.id}>
                  <Flex px={4} py={3} cursor="pointer" onClick={() => toggleVolume(vol.id)} _hover={{ bg: 'blackAlpha.50' }}
                    borderRadius="md" align="center" justify="space-between">
                    <HStack spacing={3}><Text fontSize="sm" color="brand.primary" fontWeight={600} fontFamily="heading">{vol.title}</Text>
                      <Badge colorScheme="gray" fontSize="xs" borderRadius="full">{vol.chapters.length}章</Badge></HStack>
                    <ChevronRightIcon w={4} h={4} color="gray.400" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                  </Flex>
                  <Collapse in={isOpen} animateOpacity>
                    <VStack spacing={0} align="stretch" ml={6} borderLeft="2px solid" borderColor="brand.light">
                      {vol.chapters.map(ch => (
                        <Flex key={ch.id} px={4} py={2.5} ml={-1} borderLeft="2px solid" borderColor="transparent"
                          cursor="pointer" _hover={{ bg: 'blackAlpha.50', borderColor: 'brand.primary' }} transition="all 0.15s"
                          onClick={() => navigate(`/classics/${classic.id}/read/${vol.id}/${ch.id}`)}>
                          <Text fontSize="sm" color="gray.600">{ch.title}</Text>
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
