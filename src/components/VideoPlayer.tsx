import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Box, Text, VStack, HStack, Flex, Badge, Button, IconButton,
  Slider, SliderTrack, SliderFilledTrack, SliderThumb,
  Tooltip, Divider, SimpleGrid, useToast,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import type { ResourceItem } from '../types/resource'
import { featuredCoursesData } from '../data/resourceMockData'

interface VideoPlayerProps {
  resource: ResourceItem
}

/** 模拟视频内容文案 */
const mockVideoContent: Record<string, { sections: { time: string; title: string }[]; transcript: string }> = {
  'course-01': {
    sections: [
      { time: '00:00', title: '课程导入：白鹿洞书院的历史背景' },
      { time: '05:30', title: '五教之目——伦理教育的根基' },
      { time: '12:15', title: '为学之序——从博学到笃行' },
      { time: '19:40', title: '修身之要——内外兼修的功夫' },
      { time: '24:50', title: '课程总结与教学启示' },
    ],
    transcript: '本课程系统解读《白鹿洞书院揭示》的五大纲领。朱熹在南宋淳熙六年重建白鹿洞书院时，亲定这份揭示作为书院教育的总纲...',
  },
  default: {
    sections: [
      { time: '00:00', title: '课程导入' },
      { time: '06:00', title: '核心内容讲解' },
      { time: '15:00', title: '案例分析' },
      { time: '22:00', title: '互动讨论' },
      { time: '28:00', title: '课程总结' },
    ],
    transcript: '本课程围绕书院文化教育主题展开，结合历史文献与现代教育理念，深入浅出地讲解相关知识...',
  },
}

export default function VideoPlayer({ resource }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const toast = useToast()
  const navigate = useNavigate()

  const totalDuration = resource.duration || '30分钟'
  const totalSeconds = parseInt(totalDuration) * 60 || 1800

  const content = mockVideoContent[resource.id] || mockVideoContent.default

  // 模拟播放进度
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalSeconds) {
            setIsPlaying(false)
            return totalSeconds
          }
          return prev + 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, totalSeconds])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => setIsPlaying(!isPlaying)
  const handleSeek = (val: number) => setCurrentTime(Math.floor(val * totalSeconds / 100))

  const handleSpeedChange = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2]
    const idx = speeds.indexOf(playbackRate)
    const next = speeds[(idx + 1) % speeds.length]
    setPlaybackRate(next)
    toast({ title: `倍速切换至 ${next}x`, status: 'info', duration: 1500, position: 'top' })
  }

  const handleVolumeToggle = () => setIsMuted(!isMuted)

  // 相关课程推荐
  const relatedCourses = featuredCoursesData
    .filter((c) => c.id !== resource.id)
    .slice(0, 4)

  return (
    <HStack spacing={0} align="stretch" h="100%">
      {/* ========== 左侧：视频播放区 ========== */}
      <Box flex={1} maxW="860px">
        {/* 视频画面 */}
        <Box
          bg="gray.900"
          borderRadius="xl"
          overflow="hidden"
          position="relative"
          boxShadow="0 8px 32px rgba(0,0,0,0.2)"
          cursor={isPlaying ? 'default' : 'pointer'}
          onClick={handlePlayPause}
        >
          {/* 模拟视频画面 */}
          <Box
            h="420px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
            position="relative"
          >
            {!isPlaying ? (
              <VStack spacing={4}>
                <Text fontSize="7xl" opacity={0.9}>{resource.coverEmoji || '🎬'}</Text>
                <Text fontSize="2xl" fontWeight={700} fontFamily="heading" color="whiteAlpha.900" textAlign="center" px={8}>
                  {resource.title}
                </Text>
                <Text fontSize="md" color="whiteAlpha.600">
                  {resource.teacher} · {resource.duration}
                </Text>
                <Box
                  w="72px"
                  h="72px"
                  borderRadius="full"
                  bg="whiteAlpha.200"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  _hover={{ bg: 'whiteAlpha.300', transform: 'scale(1.05)' }}
                  transition="all 0.2s"
                  cursor="pointer"
                >
                  <Text fontSize="3xl" ml="4px">▶</Text>
                </Box>
              </VStack>
            ) : (
              <VStack spacing={3}>
                <Text fontSize="6xl" opacity={0.7}>{resource.coverEmoji || '🎬'}</Text>
                <Text fontSize="sm" color="whiteAlpha.600">课程播放中...</Text>
              </VStack>
            )}

            {/* 水印 */}
            <Text
              position="absolute"
              bottom={4}
              right={6}
              fontSize="xs"
              color="whiteAlpha.400"
              fontFamily="heading"
            >
              书院文化教育平台
            </Text>
          </Box>

          {/* 进度条 */}
          <Box px={0} bg="gray.800">
            <Slider
              value={totalSeconds > 0 ? (currentTime / totalSeconds) * 100 : 0}
              onChange={handleSeek}
              focusThumbOnChange={false}
            >
              <SliderTrack bg="whiteAlpha.300" h="4px" borderRadius="full">
                <SliderFilledTrack bg="brand.primary" />
              </SliderTrack>
              <SliderThumb w="14px" h="14px" bg="brand.primary" />
            </Slider>
          </Box>

          {/* 控制栏 */}
          <Flex
            bg="gray.800"
            px={5}
            py={3}
            align="center"
            justify="space-between"
            gap={4}
          >
            <HStack spacing={3}>
              {/* 播放/暂停 */}
              <IconButton
                aria-label={isPlaying ? '暂停' : '播放'}
                icon={<Text fontSize="lg">{isPlaying ? '⏸' : '▶'}</Text>}
                size="sm"
                variant="ghost"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
                onClick={(e) => { e.stopPropagation(); handlePlayPause() }}
              />

              {/* 时间 */}
              <Text fontSize="sm" color="whiteAlpha.800" fontFamily="mono" minW="100px">
                {formatTime(currentTime)} / {formatTime(totalSeconds)}
              </Text>

              {/* 音量 */}
              <Tooltip label={isMuted ? '取消静音' : '静音'}>
                <IconButton
                  aria-label="音量"
                  icon={<Text fontSize="md">{isMuted ? '🔇' : '🔊'}</Text>}
                  size="sm"
                  variant="ghost"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  onClick={(e) => { e.stopPropagation(); handleVolumeToggle() }}
                />
              </Tooltip>
            </HStack>

            <HStack spacing={3}>
              {/* 倍速 */}
              <Button
                size="xs"
                variant="outline"
                color="whiteAlpha.800"
                borderColor="whiteAlpha.400"
                _hover={{ bg: 'whiteAlpha.200' }}
                borderRadius="full"
                onClick={(e) => { e.stopPropagation(); handleSpeedChange() }}
              >
                倍速 {playbackRate}x
              </Button>

              {/* 全屏 */}
              <IconButton
                aria-label="全屏"
                icon={<Text fontSize="md">⛶</Text>}
                size="sm"
                variant="ghost"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
                onClick={(e) => { e.stopPropagation(); toast({ title: '全屏模式', status: 'info', duration: 1500, position: 'top' }) }}
              />
            </HStack>
          </Flex>
        </Box>

        {/* 视频下方：课程信息标签页 */}
        <Box mt={6} bg="white" borderRadius="xl" border="1px solid" borderColor="blackAlpha.100" p={6}>
          {/* 标签 */}
          <HStack spacing={2} mb={4} flexWrap="wrap">
            {resource.tags.map((tag) => (
              <Badge key={tag} colorScheme="green" variant="subtle" borderRadius="full" px={3} py={1} fontSize="xs">
                {tag}
              </Badge>
            ))}
            <Badge colorScheme="purple" variant="subtle" borderRadius="full" px={3} py={1} fontSize="xs">
              {resource.duration}
            </Badge>
          </HStack>

          {/* 章节列表 */}
          <Text fontSize="md" fontWeight={700} fontFamily="heading" color="gray.800" mb={3}>
            📑 课程章节
          </Text>
          <VStack spacing={1} align="stretch" mb={6}>
            {content.sections.map((section, idx) => {
              const [m, s] = section.time.split(':').map(Number)
              const secTime = m * 60 + s
              const isCurrent = currentTime >= secTime
              return (
                <HStack
                  key={idx}
                  p={3}
                  borderRadius="md"
                  bg={isCurrent ? 'green.50' : 'transparent'}
                  cursor="pointer"
                  _hover={{ bg: 'green.50' }}
                  transition="all 0.15s"
                  onClick={() => setCurrentTime(secTime)}
                >
                  <Text
                    fontSize="sm"
                    fontFamily="mono"
                    color={isCurrent ? 'brand.primary' : 'gray.500'}
                    fontWeight={600}
                    minW="48px"
                  >
                    {section.time}
                  </Text>
                  <Text
                    fontSize="sm"
                    color={isCurrent ? 'brand.primary' : 'gray.700'}
                    fontWeight={isCurrent ? 600 : 400}
                  >
                    {section.title}
                  </Text>
                  {isCurrent && <Text fontSize="xs" color="brand.primary" ml="auto">▶ 当前</Text>}
                </HStack>
              )
            })}
          </VStack>

          <Divider mb={4} borderColor="blackAlpha.100" />

          {/* 课程简介 */}
          <Text fontSize="md" fontWeight={700} fontFamily="heading" color="gray.800" mb={2}>
            📖 课程简介
          </Text>
          <Text fontSize="sm" color="gray.600" lineHeight="1.7">
            {content.transcript}
          </Text>
        </Box>
      </Box>

      {/* ========== 右侧：课程信息 & 推荐 ========== */}
      <Box
        w="300px"
        flexShrink={0}
        ml={6}
        display={{ base: 'none', lg: 'block' }}
      >
        {/* 课程信息卡片 */}
        <Box bg="white" borderRadius="xl" border="1px solid" borderColor="blackAlpha.100" p={5} mb={4}>
          <Text fontSize="md" fontWeight={700} fontFamily="heading" color="gray.800" mb={4}>
            课程信息
          </Text>
          <VStack spacing={3} align="stretch">
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.500">主讲教师</Text>
              <Text fontSize="sm" fontWeight={600} color="gray.800">{resource.teacher}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.500">课程时长</Text>
              <Text fontSize="sm" fontWeight={600} color="gray.800">{resource.duration}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.500">适用学段</Text>
              <Text fontSize="sm" fontWeight={600} color="gray.800">
                {Array.isArray(resource.stage) ? resource.stage.join('、') : resource.stage}
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.500">课程专题</Text>
              <Text fontSize="sm" fontWeight={600} color="gray.800">{resource.courseTopic}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.500">评分</Text>
              <Text fontSize="sm" fontWeight={600} color="brand.accent">⭐ {resource.rating}</Text>
            </Flex>
          </VStack>

          <Divider my={4} borderColor="blackAlpha.100" />

          {/* 操作按钮 */}
          <VStack spacing={2} align="stretch">
            <Button
              colorScheme="green"
              bg="brand.primary"
              _hover={{ bg: 'brand.dark' }}
              borderRadius="full"
              size="sm"
              leftIcon={<Text>📥</Text>}
              onClick={() => toast({ title: '课件下载已开始', status: 'success', duration: 2000, position: 'top' })}
            >
              下载配套课件
            </Button>
            <Button
              variant="outline"
              colorScheme="green"
              borderRadius="full"
              size="sm"
              leftIcon={<Text>📝</Text>}
              onClick={() => toast({ title: '已跳转至同步练习', status: 'info', duration: 2000, position: 'top' })}
            >
              同步练习
            </Button>
          </VStack>
        </Box>

        {/* 相关课程推荐 */}
        <Box bg="white" borderRadius="xl" border="1px solid" borderColor="blackAlpha.100" p={5}>
          <Text fontSize="md" fontWeight={700} fontFamily="heading" color="gray.800" mb={4}>
            相关课程
          </Text>
          <VStack spacing={3} align="stretch">
            {relatedCourses.map((course) => (
              <HStack
                key={course.id}
                p={2}
                borderRadius="md"
                cursor="pointer"
                _hover={{ bg: 'gray.50' }}
                onClick={() => navigate(`/resources/${course.id}`)}
                spacing={3}
                transition="all 0.15s"
              >
                <Text fontSize="2xl" flexShrink={0}>{course.coverEmoji}</Text>
                <Box flex={1} minW={0}>
                  <Text fontSize="sm" fontWeight={600} color="gray.800" noOfLines={1}>
                    {course.title}
                  </Text>
                  <Text fontSize="xs" color="gray.500">{course.teacher} · {course.duration}</Text>
                </Box>
              </HStack>
            ))}
          </VStack>
        </Box>
      </Box>
    </HStack>
  )
}
