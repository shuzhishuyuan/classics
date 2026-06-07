import { Box, Text, VStack, HStack, Flex } from '@chakra-ui/react'
import { useAuth } from '../hooks/useAuth'
import LoginCard from '../components/LoginCard'
import UserDashboard from '../components/UserDashboard'

export default function HomePage() {
  const {
    user,
    isLoggedIn,
    selectedRole,
    showUserList,
    availableUsers,
    selectRole,
    login,
    switchRole,
    logout,
  } = useAuth()

  return (
    <Box maxW="1200px" mx="auto">
      {/* ========== 未登录：登录/注册区 ========== */}
      {!isLoggedIn && (
        <Box py={{ base: 8, md: 16 }}>
          {/* 平台标题 */}
          <VStack spacing={3} mb={12} textAlign="center">
            <Text
              fontSize={{ base: '4xl', md: '5xl' }}
              fontWeight={900}
              fontFamily="heading"
              color="brand.primary"
              letterSpacing="wide"
            >
              <Text as="span" mr={3}>🏛️</Text>
              数智书院
            </Text>
            <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.500" maxW="600px" lineHeight="1.7">
              承书院文脉，育时代新人 · 搭建书院—班级—家庭协同育人的
              传统文化教育数智化平台
            </Text>
          </VStack>

          {/* 三端登录 */}
          <LoginCard
            selectedRole={selectedRole}
            showUserList={showUserList}
            availableUsers={availableUsers}
            onSelectRole={selectRole}
            onLogin={login}
            onSwitchRole={switchRole}
          />

          {/* 底部特性说明 */}
          <HStack
            justify="center"
            spacing={{ base: 4, md: 10 }}
            mt={16}
            flexWrap="wrap"
          >
            {[
              { icon: '📖', label: '经典研习' },
              { icon: '🎬', label: '名师微课' },
              { icon: '🤖', label: 'AI助学' },
              { icon: '👨‍👩‍👧', label: '亲子共育' },
              { icon: '📦', label: '资源共享' },
            ].map((item) => (
              <HStack key={item.label} spacing={1.5} opacity={0.6}>
                <Text fontSize="lg">{item.icon}</Text>
                <Text fontSize="sm" color="gray.600">{item.label}</Text>
              </HStack>
            ))}
          </HStack>
        </Box>
      )}

      {/* ========== 已登录：用户仪表盘 ========== */}
      {isLoggedIn && user && (
        <Box py={{ base: 4, md: 8 }}>
          <UserDashboard user={user} onLogout={logout} />
        </Box>
      )}
    </Box>
  )
}
