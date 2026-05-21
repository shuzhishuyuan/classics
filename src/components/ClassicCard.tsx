import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Text, HStack, VStack, Badge, IconButton, Tooltip, Flex, Button,
} from '@chakra-ui/react'
import { HeartIcon, HeartOutlineIcon, StarIcon, StarOutlineIcon } from './Icons'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Classic, Difficulty, GenreType } from '../types'

interface ClassicCardProps {
  classic: Classic
  viewMode?: 'grid' | 'list'
}

/** 体裁类型颜色映射 */
const genreColors: Record<GenreType, string> = {
  '学规': 'green',
  '语录': 'orange',
  '会讲记录': 'blue',
  '碑刻': 'purple',
  '文集': 'cyan',
}

/** 渲染难度星级 */
function DifficultyStars({ level }: { level: Difficulty }) {
  return (
    <HStack spacing={0.5}>
      {[1, 2, 3, 4, 5].map((star) => (
        star <= level
          ? <StarIcon key={star} w={3.5} h={3.5} color="brand.accent" />
          : <StarOutlineIcon key={star} w={3.5} h={3.5} color="gray.300" />
      ))}
    </HStack>
  )
}

export default function ClassicCard({ classic, viewMode = 'grid' }: ClassicCardProps) {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', [])
  const [learned, setLearned] = useLocalStorage<string[]>('learned', [])
  const isFavorited = favorites.includes(classic.id)
  const isLearning = learned.includes(classic.id)
  const [isHovered, setIsHovered] = useState(false)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites(prev =>
      prev.includes(classic.id)
        ? prev.filter(id => id !== classic.id)
        : [...prev, classic.id]
    )
  }

  const toggleLearning = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLearned(prev =>
      prev.includes(classic.id)
        ? prev.filter(id => id !== classic.id)
        : [...prev, classic.id]
    )
  }

  const totalChapters = classic.chapters.reduce((sum, vol) => sum + vol.chapters.length, 0)
  const schoolLevelStr = classic.schoolLevel.join('、')

  if (viewMode === 'list') {
    return (
      <Flex
        p={4}
        bg="white"
        borderRadius="lg"
        border="1px solid"
        borderColor="blackAlpha.100"
        cursor="pointer"
        onClick={() => navigate(`/classics/${classic.id}`)}
        _hover={{ borderColor: 'brand.primary', boxShadow: '0 2px 8px rgba(44,95,45,0.1)' }}
        transition="all 0.2s"
        gap={4}
        align="center"
      >
        <Box fontSize="4xl" flexShrink={0}>{classic.coverEmoji}</Box>
        <Box flex={1}>
          <HStack spacing={2} mb={1}>
            <Text fontSize="lg" fontWeight={700} fontFamily="heading" color="gray.800">
              {classic.name}
            </Text>
            <Badge colorScheme={genreColors[classic.genre] || 'gray'} fontSize="xs">
              {classic.genre}
            </Badge>
            <Badge colorScheme="teal" fontSize="xs">{classic.academySource}</Badge>
          </HStack>
          <Text fontSize="sm" color="gray.500" mb={1}>
            {classic.author} · {classic.dynasty} · {totalChapters}章 · 适配{schoolLevelStr}
          </Text>
          <Text fontSize="sm" color="gray.600" noOfLines={1}>{classic.description}</Text>
        </Box>
        <VStack spacing={1} align="center" flexShrink={0}>
          <DifficultyStars level={classic.difficulty} />
          <Text fontSize="xs" color="gray.400">{classic.studentCount}人学习</Text>
        </VStack>
        <IconButton
          aria-label="收藏"
          icon={isFavorited ? <HeartIcon /> : <HeartOutlineIcon />}
          size="sm"
          variant="ghost"
          color={isFavorited ? 'red.400' : 'gray.400'}
          onClick={toggleFavorite}
        />
      </Flex>
    )
  }

  // 网格模式
  return (
    <Box
      bg="white"
      borderRadius="lg"
      border="1px solid"
      borderColor={isHovered ? 'brand.primary' : 'blackAlpha.100'}
      overflow="hidden"
      cursor="pointer"
      onClick={() => navigate(`/classics/${classic.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transform={isHovered ? 'translateY(-4px)' : 'translateY(0)'}
      boxShadow={isHovered ? '0 8px 24px rgba(44,95,45,0.12)' : 'sm'}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      position="relative"
    >
      {/* 收藏按钮 */}
      <Tooltip label={isFavorited ? '取消收藏' : '收藏'}>
        <IconButton
          aria-label="收藏"
          icon={isFavorited ? <HeartIcon /> : <HeartOutlineIcon />}
          position="absolute"
          top={2}
          right={2}
          size="sm"
          variant="ghost"
          color={isFavorited ? 'red.400' : 'white'}
          bg={isFavorited ? 'whiteAlpha.800' : 'blackAlpha.300'}
          backdropFilter="blur(4px)"
          _hover={{ bg: 'whiteAlpha.900' }}
          zIndex={2}
          onClick={toggleFavorite}
        />
      </Tooltip>

      {/* 封面 */}
      <Box
        h="120px"
        bg={`linear-gradient(135deg, ${isFavorited ? '#2C5F2D' : '#97724F'}, #1A3B1A)`}
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="5xl"
      >
        {classic.coverEmoji}
      </Box>

      {/* 内容 */}
      <Box p={4}>
        <HStack spacing={2} mb={1}>
          <Text
            fontSize="md"
            fontWeight={700}
            fontFamily="heading"
            noOfLines={1}
            color="gray.800"
          >
            {classic.name}
          </Text>
        </HStack>
        <Text fontSize="xs" color="gray.500" mb={2}>
          {classic.author} · {classic.dynasty}
        </Text>
        <HStack spacing={2} mb={2}>
          <Badge colorScheme={genreColors[classic.genre] || 'gray'} fontSize="xs">
            {classic.genre}
          </Badge>
          <DifficultyStars level={classic.difficulty} />
        </HStack>
        <Text fontSize="xs" color="gray.500" mb={2}>
          👥 {classic.studentCount}人学习 · 适配{schoolLevelStr}
        </Text>
        <Text fontSize="sm" color="gray.600" noOfLines={2} lineHeight="1.4">
          {classic.description}
        </Text>
      </Box>

      {/* 加入学习按钮（右下角） */}
      <Box px={4} pb={3} display="flex" justifyContent="flex-end">
        <Button
          size="xs"
          borderRadius="full"
          variant={isLearning ? 'outline' : 'solid'}
          colorScheme={isLearning ? 'green' : 'green'}
          bg={isLearning ? 'white' : 'brand.primary'}
          color={isLearning ? 'brand.primary' : 'white'}
          borderColor="brand.primary"
          _hover={{
            bg: isLearning ? 'green.50' : 'brand.dark',
          }}
          onClick={toggleLearning}
          px={3}
          fontSize="xs"
        >
          {isLearning ? '已加入 ✔' : '+ 加入学习'}
        </Button>
      </Box>
    </Box>
  )
}
