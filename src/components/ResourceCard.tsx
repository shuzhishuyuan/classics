import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Text, HStack, VStack, Badge, Button, IconButton,
  Tooltip, Flex, Tag, TagLabel, useToast,
} from '@chakra-ui/react'
import { HeartIcon, HeartOutlineIcon, StarIcon } from './Icons'
import type { ResourceItem } from '../types/resource'
import type { SchoolLevel } from '../types'

interface ResourceCardProps {
  resource: ResourceItem
  isFavorited: boolean
  onToggleFavorite: (id: string) => void
  /** 卡片变体：不同专题展示不同按钮组 */
  variant?: 'course' | 'prep' | 'student' | 'family'
}

/** 学段标签颜色映射 */
const stageColorMap: Record<SchoolLevel, string> = {
  '小学低段': 'green',
  '小学高段': 'teal',
  '初中': 'orange',
  '高中': 'purple',
}

export default function ResourceCard({
  resource,
  isFavorited,
  onToggleFavorite,
  variant = 'course',
}: ResourceCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/resources/${resource.id}`)
  }

  const showToast = (title: string, status: 'info' | 'success' | 'warning' = 'info') => {
    toast({
      title,
      status,
      duration: 2000,
      isClosable: true,
      position: 'top',
      containerStyle: { fontSize: 'sm' },
    })
  }

  const stages = Array.isArray(resource.stage) ? resource.stage : [resource.stage]

  // ---- 各专题专属按钮 ----
  const renderActions = () => {
    switch (variant) {
      case 'course':
        return (
          <Flex gap={2} flexWrap="wrap">
            <Button
              size="sm"
              colorScheme="green"
              bg="brand.primary"
              _hover={{ bg: 'brand.dark' }}
              borderRadius="full"
              fontSize="xs"
              px={4}
              leftIcon={<Text as="span" fontSize="sm">▶</Text>}
              onClick={(e) => { e.stopPropagation(); showToast('即将开始播放课程', 'info') }}
            >
              立即播放
            </Button>
            {resource.hasDownload && (
              <Button
                size="sm"
                variant="outline"
                colorScheme="green"
                borderRadius="full"
                fontSize="xs"
                px={3}
                onClick={(e) => { e.stopPropagation(); showToast('课件下载已开始', 'success') }}
              >
                下载课件
              </Button>
            )}
            {resource.hasExercise && (
              <Button
                size="sm"
                variant="ghost"
                color="gray.500"
                borderRadius="full"
                fontSize="xs"
                onClick={(e) => { e.stopPropagation(); showToast('已跳转至同步练习', 'info') }}
              >
                同步练习
              </Button>
            )}
          </Flex>
        )
      case 'prep':
        return (
          <Flex gap={2} flexWrap="wrap" align="center">
            <Button
              size="sm"
              colorScheme="green"
              bg="brand.secondary"
              _hover={{ bg: '#7A5C3A' }}
              borderRadius="full"
              fontSize="xs"
              px={4}
              onClick={(e) => { e.stopPropagation(); showToast('下载已开始', 'success') }}
            >
              一键下载
            </Button>
            <Text fontSize="xs" color="gray.400">
              下载后可二次改编使用
            </Text>
          </Flex>
        )
      case 'student':
        return (
          <Flex gap={2} flexWrap="wrap">
            <Button
              size="sm"
              colorScheme="green"
              bg="brand.primary"
              _hover={{ bg: 'brand.dark' }}
              borderRadius="full"
              fontSize="xs"
              px={4}
              onClick={(e) => { e.stopPropagation(); showToast('开始学习', 'info') }}
            >
              开始学习
            </Button>
            <IconButton
              aria-label={isFavorited ? '取消收藏' : '加入收藏'}
              icon={isFavorited ? <HeartIcon /> : <HeartOutlineIcon />}
              size="sm"
              variant="outline"
              borderRadius="full"
              color={isFavorited ? 'red.400' : 'gray.400'}
              borderColor={isFavorited ? 'red.300' : 'gray.300'}
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite(resource.id)
                showToast(isFavorited ? '已取消收藏' : '已加入收藏', 'success')
              }}
            />
          </Flex>
        )
      case 'family':
        return (
          <Flex gap={2} flexWrap="wrap">
            <Button
              size="sm"
              colorScheme="green"
              bg="brand.primary"
              _hover={{ bg: 'brand.dark' }}
              borderRadius="full"
              fontSize="xs"
              px={4}
              onClick={(e) => { e.stopPropagation(); showToast('即将开始共读', 'info') }}
            >
              开始共读
            </Button>
            <Button
              size="sm"
              variant="outline"
              colorScheme="orange"
              borderRadius="full"
              fontSize="xs"
              px={3}
              onClick={(e) => { e.stopPropagation(); showToast('打卡成功！今日已记录', 'success') }}
            >
              打卡记录
            </Button>
            <Button
              size="sm"
              variant="ghost"
              color="brand.accent"
              borderRadius="full"
              fontSize="xs"
              onClick={(e) => { e.stopPropagation(); showToast('成果上传页面开发中', 'warning') }}
            >
              上传成果
            </Button>
          </Flex>
        )
      default:
        return null
    }
  }

  // ---- 卡片元信息 ----
  const renderMeta = () => {
    switch (variant) {
      case 'course':
        return (
          <HStack spacing={2} flexWrap="wrap" mb={1.5}>
            {resource.teacher && (
              <Text fontSize="xs" color="brand.secondary" fontWeight={600}>
                👨‍🏫 {resource.teacher}
              </Text>
            )}
            {resource.duration && (
              <Badge variant="subtle" colorScheme="gray" fontSize="xs" borderRadius="full">
                ⏱ {resource.duration}
              </Badge>
            )}
            {stages.map((s) => (
              <Badge
                key={s}
                variant="subtle"
                colorScheme={stageColorMap[s] || 'gray'}
                fontSize="xs"
                borderRadius="full"
              >
                {s}
              </Badge>
            ))}
          </HStack>
        )
      case 'prep':
        return (
          <HStack spacing={2} flexWrap="wrap" mb={1.5}>
            {resource.subject && (
              <Badge variant="subtle" colorScheme="green" fontSize="xs" borderRadius="full">
                {resource.subject}
              </Badge>
            )}
            {stages.map((s) => (
              <Badge key={s} variant="subtle" colorScheme={stageColorMap[s] || 'gray'} fontSize="xs" borderRadius="full">
                {s}
              </Badge>
            ))}
            {resource.format && (
              <Badge variant="outline" colorScheme="gray" fontSize="xs" borderRadius="full">
                {resource.format}
              </Badge>
            )}
          </HStack>
        )
      case 'student':
        return (
          <HStack spacing={2} flexWrap="wrap" mb={1.5}>
            <Badge variant="subtle" colorScheme="blue" fontSize="xs" borderRadius="full">
              {resource.type}
            </Badge>
            {stages.map((s) => (
              <Badge key={s} variant="subtle" colorScheme={stageColorMap[s] || 'gray'} fontSize="xs" borderRadius="full">
                {s}
              </Badge>
            ))}
            {resource.learningTime && (
              <Text fontSize="xs" color="gray.500">⏱ {resource.learningTime}</Text>
            )}
          </HStack>
        )
      case 'family':
        return (
          <HStack spacing={2} flexWrap="wrap" mb={1.5}>
            {resource.familyScenario && (
              <Badge variant="subtle" colorScheme="orange" fontSize="xs" borderRadius="full">
                🏷 {resource.familyScenario}
              </Badge>
            )}
            {resource.readingMethod && (
              <Badge variant="subtle" colorScheme="purple" fontSize="xs" borderRadius="full">
                {resource.readingMethod}
              </Badge>
            )}
            {resource.duration && (
              <Text fontSize="xs" color="gray.500">⏱ {resource.duration}</Text>
            )}
          </HStack>
        )
      default:
        return null
    }
  }

  return (
    <Box
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor={isHovered ? 'brand.primary' : 'blackAlpha.100'}
      overflow="hidden"
      cursor="pointer"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transform={isHovered ? 'translateY(-4px)' : 'translateY(0)'}
      boxShadow={isHovered ? '0 8px 24px rgba(44,95,45,0.12)' : 'sm'}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      display="flex"
      flexDirection="column"
    >
      {/* 封面区域 */}
      <Box
        h="100px"
        bg={isHovered
          ? 'linear-gradient(135deg, #2C5F2D 0%, #1A3B1A 100%)'
          : 'linear-gradient(135deg, #97724F 0%, #5C3D2E 100%)'
        }
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="4xl"
        transition="background 0.3s"
        position="relative"
      >
        <Text>{resource.coverEmoji || '📄'}</Text>

        {/* 收藏按钮 (学生学习专题) */}
        {variant === 'student' && (
          <Tooltip label={isFavorited ? '取消收藏' : '加入收藏'}>
            <IconButton
              aria-label="收藏"
              icon={isFavorited ? <HeartIcon /> : <HeartOutlineIcon />}
              position="absolute"
              top={2}
              right={2}
              size="sm"
              variant="ghost"
              color={isFavorited ? 'red.300' : 'whiteAlpha.800'}
              bg="blackAlpha.300"
              backdropFilter="blur(4px)"
              _hover={{ bg: 'whiteAlpha.800', color: isFavorited ? 'red.400' : 'gray.700' }}
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite(resource.id)
                showToast(isFavorited ? '已取消收藏' : '已加入收藏', 'success')
              }}
            />
          </Tooltip>
        )}
      </Box>

      {/* 内容区域 */}
      <Box p={4} flex={1} display="flex" flexDirection="column">
        {/* 标签 */}
        <HStack spacing={1.5} flexWrap="wrap" mb={1.5}>
          {resource.tags.slice(0, 3).map((tag) => (
            <Tag key={tag} size="sm" variant="subtle" colorScheme="green" borderRadius="full">
              <TagLabel>{tag}</TagLabel>
            </Tag>
          ))}
        </HStack>

        {/* 标题 */}
        <Text
          fontSize="md"
          fontWeight={700}
          fontFamily="heading"
          color="gray.800"
          noOfLines={2}
          mb={1.5}
          lineHeight="1.4"
        >
          {resource.title}
        </Text>

        {/* 元信息 */}
        {renderMeta()}

        {/* 描述 */}
        <Text
          fontSize="sm"
          color="gray.500"
          noOfLines={2}
          lineHeight="1.5"
          mb={3}
          flex={1}
        >
          {resource.description}
        </Text>

        {/* 评分 & 下载 */}
        <HStack spacing={3} mb={3}>
          {resource.rating && (
            <HStack spacing={0.5}>
              <StarIcon w={3.5} h={3.5} color="brand.accent" />
              <Text fontSize="xs" fontWeight={600} color="gray.700">{resource.rating}</Text>
            </HStack>
          )}
          {resource.downloads !== undefined && (
            <Text fontSize="xs" color="gray.400">
              📥 {resource.downloads > 10000 ? `${(resource.downloads / 10000).toFixed(1)}万` : resource.downloads.toLocaleString()}次下载
            </Text>
          )}
          {resource.updatedAt && (
            <Text fontSize="xs" color="gray.400" ml="auto">
              {resource.updatedAt}
            </Text>
          )}
        </HStack>

        {/* 操作按钮 */}
        {renderActions()}
      </Box>
    </Box>
  )
}
