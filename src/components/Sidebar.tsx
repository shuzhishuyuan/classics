import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Collapse, HStack, Icon, IconButton, Text, Tooltip, VStack } from '@chakra-ui/react'
import { FaBookOpen, FaBuilding, FaChevronDown, FaChevronLeft, FaChevronRight, FaLandmark, FaRobot, FaUserGraduate } from 'react-icons/fa'
import { discussionMenu } from '../data/discussion'

type ModuleKey = 'classics' | 'discussion' | 'learning' | 'hall'

interface NavTab {
  key: ModuleKey
  label: string
  icon: React.ElementType
  path: string
}

const moduleMenus: Record<ModuleKey, NavTab[]> = {
  classics: [
    { key: 'classics', label: '典籍检索', icon: FaBookOpen, path: '/classics' },
    { key: 'learning', label: '我的典籍学习', icon: FaUserGraduate, path: '/learning' },
  ],
  discussion: discussionMenu.map((item) => ({
    key: 'discussion' as const,
    label: item.label,
    icon: item.icon,
    path: `/discussion#${item.id}`,
  })),
  learning: [
    { key: 'learning', label: '学习档案', icon: FaUserGraduate, path: '/learning' },
    { key: 'classics', label: '继续研习', icon: FaBookOpen, path: '/classics' },
  ],
  hall: [
    { key: 'hall', label: '互动大厅', icon: FaLandmark, path: '/academy-hall' },
    { key: 'hall', label: '展馆智导', icon: FaRobot, path: '/academy-hall/ai' },
  ],
}

const academyTabs: NavTab[] = [
  { key: 'hall', label: '白鹿洞书院', icon: FaBuilding, path: '/academy-hall/bailudong' },
  { key: 'hall', label: '石鼓书院', icon: FaBuilding, path: '/academy-hall/shigu' },
  { key: 'hall', label: '岳麓书院', icon: FaBuilding, path: '/academy-hall/yuelu' },
  { key: 'hall', label: '嵩阳书院', icon: FaBuilding, path: '/academy-hall/songyang' },
  { key: 'hall', label: '应天书院', icon: FaBuilding, path: '/academy-hall/yingtian' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const academyRoomActive = academyTabs.some((tab) => location.pathname === tab.path || location.pathname.startsWith(`${tab.path}/`))
  const [academiesOpen, setAcademiesOpen] = useState(academyRoomActive)

  useEffect(() => {
    if (academyRoomActive) setAcademiesOpen(true)
  }, [academyRoomActive])

  const getModule = (): ModuleKey => {
    if (location.pathname.startsWith('/discussion')) return 'discussion'
    if (location.pathname.startsWith('/classics')) return 'classics'
    if (location.pathname.startsWith('/learning')) return 'learning'
    if (
      location.pathname.startsWith('/academy-hall') ||
      location.pathname.startsWith('/academy-3d') ||
      location.pathname.startsWith('/immersive3d') ||
      location.pathname.startsWith('/academy/')
    ) return 'hall'
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
            const isActive = tab.path.includes('#') && location.hash
              ? tab.path.endsWith(location.hash)
              : location.pathname === tab.path ||
                (tab.path !== '/academy-hall' && location.pathname.startsWith(`${tab.path}/`))
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
          {activeModule === 'hall' && (
            <>
              <Tooltip label="书院展厅" placement="right" isDisabled={!collapsed}>
                <Box
                  as="button"
                  type="button"
                  w="100%"
                  px={collapsed ? 0 : 4}
                  py={3}
                  borderRadius="md"
                  cursor="pointer"
                  border="0"
                  bg={academyRoomActive ? 'green.50' : 'transparent'}
                  color={academyRoomActive ? '#31583d' : 'gray.600'}
                  _hover={{ bg: 'green.50', color: '#3a5a40' }}
                  transition="all 0.2s"
                  fontWeight={academyRoomActive ? 700 : 500}
                  fontSize="sm"
                  aria-expanded={academiesOpen}
                  onClick={() => setAcademiesOpen((value) => !value)}
                >
                  <HStack justify={collapsed ? 'center' : 'space-between'} spacing={3}>
                    <HStack justify={collapsed ? 'center' : 'flex-start'} spacing={3}>
                      <Icon as={FaBuilding} boxSize={4} flexShrink={0} />
                      {!collapsed && <Text noOfLines={1}>书院展厅</Text>}
                    </HStack>
                    {!collapsed && <Icon as={FaChevronDown} boxSize={3} transform={academiesOpen ? 'rotate(180deg)' : undefined} transition="transform 0.2s" />}
                  </HStack>
                </Box>
              </Tooltip>
              <Collapse in={academiesOpen && !collapsed} animateOpacity>
                <VStack spacing={1} align="stretch" pl={3} pt={1} pb={1}>
                  {academyTabs.map((tab) => {
                    const isActive = location.pathname === tab.path || location.pathname.startsWith(`${tab.path}/`)
                    return (
                      <Box
                        as="button"
                        type="button"
                        key={tab.path}
                        w="100%"
                        px={3}
                        py={2.5}
                        borderRadius="md"
                        cursor="pointer"
                        border="0"
                        bg={isActive ? '#3a5a40' : 'transparent'}
                        color={isActive ? 'white' : 'gray.600'}
                        _hover={!isActive ? { bg: 'green.50', color: '#3a5a40' } : undefined}
                        transition="all 0.2s"
                        fontWeight={isActive ? 700 : 500}
                        fontSize="sm"
                        textAlign="left"
                        onClick={() => handleNavigate(tab.path)}
                      >
                        <HStack spacing={3}>
                          <Icon as={tab.icon} boxSize={3.5} flexShrink={0} />
                          <Text noOfLines={1}>{tab.label}</Text>
                        </HStack>
                      </Box>
                    )
                  })}
                </VStack>
              </Collapse>
            </>
          )}
        </VStack>
      </Box>
    </Box>
  )
}
