import { useNavigate } from 'react-router-dom'
import {
  Box, Text, VStack, HStack, SimpleGrid, Flex,
  Badge, Button, Divider, Avatar, Stat, StatLabel, StatNumber, StatGroup,
} from '@chakra-ui/react'
import type { User } from '../hooks/useAuth'

interface UserDashboardProps {
  user: User
  onLogout: () => void
}

/** 各角色快捷入口 */
const quickActions: Record<string, { label: string; icon: string; path: string; color: string }[]> = {
  '学生': [
    { label: '经典研习', icon: '📖', path: '/classics', color: '#2C5F2D' },
    { label: 'AI智能助学', icon: '🤖', path: '/ai', color: '#97724F' },
    { label: '学习资源', icon: '📦', path: '/resources', color: '#6B5B4F' },
    { label: '我的学习', icon: '📚', path: '/learning', color: '#C8A96E' },
  ],
  '教师': [
    { label: '备课资源', icon: '📝', path: '/resources', color: '#2C5F2D' },
    { label: '经典研习', icon: '📖', path: '/classics', color: '#97724F' },
    { label: '名师微课', icon: '🎬', path: '/resources', color: '#6B5B4F' },
    { label: 'AI智能助学', icon: '🤖', path: '/ai', color: '#C8A96E' },
  ],
  '家长': [
    { label: '亲子共读', icon: '👨‍👩‍👧', path: '/resources', color: '#2C5F2D' },
    { label: '经典研习', icon: '📖', path: '/classics', color: '#97724F' },
    { label: '学习资源', icon: '📦', path: '/resources', color: '#6B5B4F' },
    { label: '成长记录', icon: '📊', path: '/learning', color: '#C8A96E' },
  ],
}

/** 各角色欢迎语和推荐 */
const roleGreeting: Record<string, { title: string; subtitle: string; tips: string[] }> = {
  '学生': {
    title: '今日学习之旅',
    subtitle: '在书院文化的熏陶中，开启新一天的学习探索',
    tips: ['完成今日经典诵读打卡任务', '预习《岳阳楼记》精读课程', '查看老师布置的学习任务单'],
  },
  '教师': {
    title: '今日教学概览',
    subtitle: '以书院智慧启迪课堂，用传统文化滋养学生心灵',
    tips: ['下载《白鹿洞书院揭示》精品教案', '查看班级学生学习进度', '准备本周主题班会内容'],
  },
  '家长': {
    title: '家庭共育时光',
    subtitle: '陪伴是最好的教育，与孩子一起感受书院文化之美',
    tips: ['完成今日亲子诵读打卡', '查看孩子本周学习报告', '预约周末亲子研学活动'],
  },
}

/** 各角色统计数据 */
const roleStats: Record<string, { label: string; value: string; icon: string }[]> = {
  '学生': [
    { label: '已学典籍', value: '12部', icon: '📖' },
    { label: '学习时长', value: '38小时', icon: '⏱️' },
    { label: '诵读打卡', value: '56次', icon: '🎯' },
    { label: '讨论参与', value: '23条', icon: '💬' },
  ],
  '教师': [
    { label: '已下载资源', value: '45份', icon: '📥' },
    { label: '授课班级', value: '3个', icon: '🏫' },
    { label: '课程收藏', value: '28节', icon: '⭐' },
    { label: '使用课件', value: '67次', icon: '📊' },
  ],
  '家长': [
    { label: '亲子共读', value: '32次', icon: '👨‍👩‍👧' },
    { label: '打卡记录', value: '89天', icon: '📅' },
    { label: '成果上传', value: '15份', icon: '📤' },
    { label: '研学参与', value: '6次', icon: '🗺️' },
  ],
}

export default function UserDashboard({ user, onLogout }: UserDashboardProps) {
  const navigate = useNavigate()
  const actions = quickActions[user.role] || quickActions['学生']
  const greeting = roleGreeting[user.role] || roleGreeting['学生']
  const stats = roleStats[user.role] || roleStats['学生']
  const roleColor = user.role === '学生' ? '#2C5F2D' : user.role === '教师' ? '#97724F' : '#6B5B4F'

  return (
    <Box maxW="1000px" mx="auto">
      {/* ========== 用户信息头部 ========== */}
      <Flex
        bg="white"
        borderRadius="2xl"
        border="1px solid"
        borderColor="blackAlpha.100"
        boxShadow="sm"
        p={6}
        mb={6}
        align="center"
        justify="space-between"
        direction={{ base: 'column', md: 'row' }}
        gap={4}
      >
        <HStack spacing={4}>
          <Avatar
            size="lg"
            bg={roleColor}
            icon={<Text fontSize="3xl">{user.avatar}</Text>}
          />
          <Box>
            <HStack spacing={2} mb={1}>
              <Text fontSize="xl" fontWeight={700} fontFamily="heading" color="gray.800">
                {user.name}
              </Text>
              <Badge colorScheme={user.role === '学生' ? 'green' : user.role === '教师' ? 'orange' : 'purple'} borderRadius="full" fontSize="xs">
                {user.role}
              </Badge>
            </HStack>
            <Text fontSize="sm" color="gray.500">
              {user.school}
              {user.role === '教师' && user.subject && ` · ${user.subject}教师`}
              {user.role === '学生' && ` · ${user.grade}`}
              {user.role === '家长' && user.studentName && ` · 学生：${user.studentName}（${user.studentGrade}）`}
            </Text>
          </Box>
        </HStack>
        <Button
          variant="outline"
          size="sm"
          borderRadius="full"
          color="gray.500"
          borderColor="gray.300"
          onClick={onLogout}
        >
          切换账号
        </Button>
      </Flex>

      {/* ========== 统计数据 ========== */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
        {stats.map((s) => (
          <Box
            key={s.label}
            bg="white"
            borderRadius="xl"
            border="1px solid"
            borderColor="blackAlpha.100"
            p={4}
            textAlign="center"
            _hover={{ boxShadow: 'sm', borderColor: 'brand.light' }}
            transition="all 0.2s"
          >
            <Text fontSize="2xl" mb={1}>{s.icon}</Text>
            <Text fontSize="2xl" fontWeight={800} color="brand.primary" fontFamily="heading">
              {s.value}
            </Text>
            <Text fontSize="xs" color="gray.500">{s.label}</Text>
          </Box>
        ))}
      </SimpleGrid>

      {/* ========== 快捷入口 + 今日推荐 ========== */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {/* 快捷入口 */}
        <Box bg="white" borderRadius="xl" border="1px solid" borderColor="blackAlpha.100" p={6}>
          <Text fontSize="lg" fontWeight={700} fontFamily="heading" color="gray.800" mb={4}>
            ⚡ 快捷入口
          </Text>
          <SimpleGrid columns={2} spacing={3}>
            {actions.map((action) => (
              <Flex
                key={action.label}
                direction="column"
                align="center"
                p={4}
                bg="gray.50"
                borderRadius="lg"
                cursor="pointer"
                border="2px solid"
                borderColor="transparent"
                _hover={{ borderColor: action.color, bg: 'white', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                onClick={() => navigate(action.path)}
              >
                <Text fontSize="3xl" mb={2}>{action.icon}</Text>
                <Text fontSize="sm" fontWeight={600} color="gray.700">{action.label}</Text>
              </Flex>
            ))}
          </SimpleGrid>
        </Box>

        {/* 今日推荐 */}
        <Box bg="white" borderRadius="xl" border="1px solid" borderColor="blackAlpha.100" p={6}>
          <Text fontSize="lg" fontWeight={700} fontFamily="heading" color="gray.800" mb={1}>
            📌 {greeting.title}
          </Text>
          <Text fontSize="sm" color="gray.500" mb={4}>
            {greeting.subtitle}
          </Text>
          <Divider mb={4} borderColor="blackAlpha.100" />
          <VStack spacing={3} align="stretch">
            {greeting.tips.map((tip, idx) => (
              <HStack
                key={idx}
                p={3}
                bg="gray.50"
                borderRadius="md"
                spacing={3}
                _hover={{ bg: 'brand.light' }}
                transition="all 0.15s"
              >
                <Text fontSize="lg">📋</Text>
                <Text fontSize="sm" color="gray.700">{tip}</Text>
              </HStack>
            ))}
          </VStack>
          <Button
            mt={4}
            size="sm"
            variant="ghost"
            color="brand.primary"
            borderRadius="full"
            width="full"
            onClick={() => navigate(user.role === '教师' ? '/resources' : '/classics')}
          >
            查看全部 →
          </Button>
        </Box>
      </SimpleGrid>
    </Box>
  )
}
