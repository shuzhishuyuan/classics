import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Collapse, HStack, Icon, IconButton, Text, Tooltip, VStack } from '@chakra-ui/react'
import { FaBookOpen, FaChevronLeft, FaChevronRight, FaRobot, FaUserGraduate } from 'react-icons/fa'
import { discussionMenu } from '../data/discussion'

type ModuleKey = 'classics' | 'discussion' | 'ai' | 'learning'

interface NavTab {
  key: ModuleKey
  label: string
  icon: React.ElementType
  path: string
}

const moduleMenus: Record<ModuleKey, NavTab[]> = {
  classics: [
    { key: 'classics', label: '典籍检索', icon: FaBookOpen, path: '/classics' },
    { key: 'ai', label: '书院智问', icon: FaRobot, path: '/ai' },
    { key: 'learning', label: '我的典籍学习', icon: FaUserGraduate, path: '/learning' },
  ],
  discussion: discussionMenu.map((item) => ({
    key: 'discussion' as const,
    label: item.label,
    icon: item.icon,
    path: `/discussion#${item.id}`,
  })),
  ai: [
    { key: 'ai', label: '书院智问', icon: FaRobot, path: '/ai' },
    { key: 'classics', label: '返回经典研习', icon: FaBookOpen, path: '/classics' },
  ],
  learning: [
    { key: 'learning', label: '学习档案', icon: FaUserGraduate, path: '/learning' },
    { key: 'classics', label: '继续研习', icon: FaBookOpen, path: '/classics' },
  ],
}

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const getModule = (): ModuleKey => {
    if (location.pathname.startsWith('/discussion')) return 'discussion'
    if (location.pathname.startsWith('/classics')) return 'classics'
    if (location.pathname.startsWith('/ai')) return 'ai'
    if (location.pathname.startsWith('/learning')) return 'learning'
    return 'classics'
  }

  const activeModule = getModule()
  const navTabs = moduleMenus[activeModule]

  const handleNavigate = (path: string) => {
    if (path.includes('#')) {
      const [route, hash] = path.split('#')

      if (location.pathname !== route) {
        navigate(path)
        window.setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }), 80)
        return
      }

      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
      window.history.replaceState(null, '', path)
      return
    }

    navigate(path)
  }

  return (
    <Box
      position="fixed"
      top="72px"
      left={0}
      w={collapsed ? '64px' : '220px'}
      h="calc(100vh - 72px)"
      bg="white"
      borderRight="1px solid"
      borderColor="blackAlpha.100"
      overflowY="auto"
      zIndex={50}
      transition="width 0.2s ease"
      display={{ base: 'none', lg: 'block' }}
      sx={{
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-thumb': { bg: '#C8A96E' },
      }}
    >
      <Box p={3} pt={5}>
        <HStack justify={collapsed ? 'center' : 'space-between'} mb={3}>
          <Collapse in={!collapsed} animateOpacity>
            <Text fontSize="xs" fontWeight={800} color="gray.500" letterSpacing={0}>
              当前模块
            </Text>
          </Collapse>
          <IconButton
            aria-label={collapsed ? '展开侧边栏' : '折叠侧边栏'}
            icon={collapsed ? <FaChevronRight /> : <FaChevronLeft />}
            size="sm"
            variant="ghost"
            onClick={() => setCollapsed((value) => !value)}
          />
        </HStack>

        <VStack spacing={1} align="stretch">
          {navTabs.map((tab) => {
            const isActive =
              tab.path.includes('#') && location.hash
                ? tab.path.endsWith(location.hash)
                : location.pathname === tab.path || location.pathname.startsWith(`${tab.path}/`)
            const item = (
              <Box
                px={collapsed ? 0 : 4}
                py={3}
                borderRadius="md"
                cursor="pointer"
                bg={isActive ? '#3a5a40' : 'transparent'}
                color={isActive ? 'white' : 'gray.600'}
                _hover={!isActive ? { bg: 'green.50', color: '#3a5a40' } : undefined}
                transition="all 0.2s"
                fontWeight={isActive ? 700 : 500}
                fontSize="sm"
                onClick={() => handleNavigate(tab.path)}
              >
                <HStack justify={collapsed ? 'center' : 'flex-start'} spacing={3}>
                  <Icon as={tab.icon} boxSize={4} flexShrink={0} />
                  {!collapsed && <Text noOfLines={1}>{tab.label}</Text>}
                </HStack>
              </Box>
            )

            return (
              <Tooltip key={`${tab.path}-${tab.label}`} label={tab.label} placement="right" isDisabled={!collapsed}>
                {item}
              </Tooltip>
            )
          })}
        </VStack>
      </Box>
    </Box>
  )
}
