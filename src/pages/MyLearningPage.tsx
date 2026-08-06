import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Text, HStack, VStack, SimpleGrid, Badge, Progress, Flex, Spinner,
} from '@chakra-ui/react'
import { StarIcon, StarOutlineIcon } from '../components/Icons'
import { fetchEnrolled, fetchStats } from '../api/learning'
import type { Classic, Difficulty, GenreType } from '../types'

const genreColors: Record<GenreType, string> = {
  '学规': 'green', '语录': 'orange', '会讲记录': 'blue', '碑刻': 'purple', '文集': 'cyan',
}

function DifficultyStars({ level }: { level: Difficulty }) {
  return <HStack spacing={0.5}>{[1,2,3,4,5].map(s => s <= level ? <StarIcon key={s} w={3} h={3} color="brand.accent" /> : <StarOutlineIcon key={s} w={3} h={3} color="gray.300" />)}</HStack>
}

export default function MyLearningPage() {
  const navigate = useNavigate()
  const [enrolled, setEnrolled] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchEnrolled(), fetchStats()]).then(([eRes, sRes]) => {
      if (eRes.code === 200) setEnrolled(eRes.data)
      if (sRes.code === 200) setStats(sRes.data)
      setLoading(false)
    })
  }, [])

  if (loading) return <Box textAlign="center" py={20}><Spinner color="brand.primary" size="lg" /></Box>

  if (enrolled.length === 0) return (
    <Box textAlign="center" py={20}>
      <Text fontSize="5xl" mb={4}>📚</Text>
      <Text fontSize="lg" color="gray.500" fontWeight={600} fontFamily="heading">还没有加入任何典籍</Text>
      <Text fontSize="sm" color="gray.400" mt={2}>在典籍检索页点击「加入学习」即可开始</Text>
    </Box>
  )

  return (
    <Box maxW="1200px">
      <Text fontSize="2xl" fontWeight={700} fontFamily="heading" color="gray.800" mb={6}>📚 我的典籍学习</Text>

      {stats && (
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
          {[
            { label: '已学典籍', value: `${stats.enrolledClassics}部`, icon: '📖' },
            { label: '已完成', value: `${stats.completedClassics}部`, icon: '✅' },
            { label: '笔记', value: `${stats.noteCount}条`, icon: '📝' },
            { label: '诵读', value: `${stats.recitationCount}次`, icon: '🎙️' },
          ].map(s => (
            <Box key={s.label} bg="white" borderRadius="xl" border="1px solid" borderColor="blackAlpha.100" p={4} textAlign="center">
              <Text fontSize="2xl" mb={1}>{s.icon}</Text>
              <Text fontSize="2xl" fontWeight={800} color="brand.primary" fontFamily="heading">{s.value}</Text>
              <Text fontSize="xs" color="gray.500">{s.label}</Text>
            </Box>
          ))}
        </SimpleGrid>
      )}

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
        {enrolled.map((item: any) => (
          <Box key={item.id} bg="white" borderRadius="xl" border="1px solid" borderColor="blackAlpha.100" overflow="hidden"
            cursor="pointer" _hover={{ borderColor: 'brand.primary', boxShadow: '0 4px 16px rgba(44,95,45,0.1)' }} transition="all 0.2s"
            onClick={() => navigate(`/classics/${item.id}`)}>
            <Box h="100px" bg="linear-gradient(135deg, #97724F, #1A3B1A)" display="flex" alignItems="center" justifyContent="center" fontSize="4xl">
              {item.coverEmoji}
            </Box>
            <Box p={4}>
              <Text fontSize="md" fontWeight={700} fontFamily="heading" color="gray.800" mb={1}>{item.name}</Text>
              <Text fontSize="xs" color="gray.500" mb={2}>{item.author} · {item.dynasty}</Text>
              <HStack spacing={2} mb={2}>
                <Badge colorScheme={(genreColors as any)[item.genre] || 'gray'} fontSize="xs">{item.genre}</Badge>
                <DifficultyStars level={item.difficulty} />
              </HStack>
              <Box>
                <Flex justify="space-between" mb={0.5}><Text fontSize="xs" color="gray.500">学习进度</Text><Text fontSize="xs" color="brand.primary" fontWeight={600}>{item.progress || 0}%</Text></Flex>
                <Progress value={item.progress || 0} size="sm" borderRadius="full" colorScheme="green" bg="blackAlpha.100" />
              </Box>
              <HStack spacing={3} fontSize="xs" color="gray.500" mt={2}>
                <Text>📖 {item.totalChapters || 0}章</Text>
                <Text>👥 {item.studentCount}人</Text>
              </HStack>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  )
}
