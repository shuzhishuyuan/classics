import { useNavigate, useLocation } from 'react-router-dom'
import { Box, Text, VStack } from '@chakra-ui/react'

type TabKey = 'classics' | 'ai' | 'learning'

interface NavTab {
  key: TabKey
  label: string
  icon: string
  path: string
}

const navTabs: NavTab[] = [
  { key: 'classics', label: '典籍检索', icon: '📖', path: '/classics' },
  { key: 'ai', label: 'AI智能助学', icon: '🤖', path: '/ai' },
  { key: 'learning', label: '我的典籍学习', icon: '📚', path: '/learning' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const getActiveTab = (): TabKey => {
    if (location.pathname.startsWith('/classics')) return 'classics'
    if (location.pathname.startsWith('/ai')) return 'ai'
    if (location.pathname.startsWith('/learning')) return 'learning'
    return 'classics'
  }

  const activeTab = getActiveTab()

  return (
    <Box
      position="fixed"
      top="72px"
      left={0}
      w="220px"
      h="calc(100vh - 72px)"
      bg="white"
      borderRight="1px solid"
      borderColor="blackAlpha.100"
      overflowY="auto"
      zIndex={50}
      sx={{
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-thumb': { bg: '#C8A96E' },
      }}
    >
      <Box p={3} pt={5}>
        <VStack spacing={1} align="stretch">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <Box
                key={tab.key}
                px={4}
                py={3}
                borderRadius="lg"
                cursor="pointer"
                bg={isActive ? '#3a5a40' : 'transparent'}
                color={isActive ? 'white' : 'gray.600'}
                _hover={!isActive ? { bg: 'green.50', color: '#3a5a40' } : undefined}
                transition="all 0.2s"
                fontWeight={isActive ? 600 : 400}
                fontSize="sm"
                onClick={() => navigate(tab.path)}
              >
                <Text>
                  {tab.icon} {tab.label}
                </Text>
              </Box>
            )
          })}
        </VStack>
      </Box>
    </Box>
  )
}
