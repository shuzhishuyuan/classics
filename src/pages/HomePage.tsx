import { useState } from 'react'
import { Box, Text, VStack, HStack, Icon } from '@chakra-ui/react'
import { FiBookOpen, FiFilm, FiCpu, FiUsers, FiArchive } from 'react-icons/fi'
import { useAuth } from '../hooks/useAuth'
import LoginCard from '../components/LoginCard'
import RegisterCard from '../components/RegisterCard'
import UserDashboard from '../components/UserDashboard'
import './homePage.css'

type AuthView = 'login' | 'register'

function AcademyCompanion({ side }: { side: 'left' | 'right' }) {
  const isLeft = side === 'left'

  return (
    <aside className={`academy-companion academy-companion--${side}`} aria-hidden="true">
      <div className="academy-companion__portrait">
        <img
          className="academy-companion__student"
          src={`/login-assets/student-${isLeft ? 'boy' : 'girl'}.png`}
          width="256"
          height="256"
          alt=""
          draggable={false}
        />
        <img
          className="academy-companion__object"
          src={`/login-assets/${isLeft ? 'books' : 'scroll'}.png`}
          width="256"
          height="256"
          alt=""
          draggable={false}
        />
      </div>
      <div className="academy-companion__quote">
        <p>{isLeft ? '学而时习之' : '有朋自远方来'}</p>
        <span>{isLeft ? '不亦说乎' : '不亦乐乎'}</span>
      </div>
    </aside>
  )
}

export default function HomePage() {
  const { user, isLoggedIn, login, register, logout } = useAuth()
  const [view, setView] = useState<AuthView>('login')

  return (
    <Box w="100%" minH="calc(100svh - 80px)" bg="white">
      {!isLoggedIn && (
        <Box as="main" className="login-cover">
          <VStack as="header" spacing={2} textAlign="center" className="login-cover__heading">
            <Box as="h1" m={0}>
              <Box
                as="img"
                src="/logo.png"
                alt="拾遗学舍"
                w={{ base: '280px', md: '440px' }}
                maxW="100%"
                h="auto"
                objectFit="contain"
              />
            </Box>
            <Text fontFamily="heading" fontSize={{ base: 'md', md: 'lg' }} color="#274D45">
              承书院文脉，育时代新人
            </Text>
            <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500" lineHeight="1.8" maxW="540px">
              搭建书院—班级—家庭协同育人的传统文化教育数智化平台
            </Text>
          </VStack>

          <div className="login-cover__entrance">
            <AcademyCompanion side="left" />
            <div className="login-cover__form">
              {view === 'login' ? (
                <LoginCard onLogin={login} onSwitchToRegister={() => setView('register')} />
              ) : (
                <RegisterCard onRegister={register} onSwitchToLogin={() => setView('login')} />
              )}
            </div>
            <AcademyCompanion side="right" />
          </div>

          <Box as="footer" className="login-cover__footer">
            <HStack justify="center" spacing={{ base: 4, md: 8 }} flexWrap="wrap" rowGap={3} mb={5}>
              {[
                { icon: FiBookOpen, label: '经典研习' },
                { icon: FiFilm, label: '名师微课' },
                { icon: FiCpu, label: 'AI助学' },
                { icon: FiUsers, label: '亲子共育' },
                { icon: FiArchive, label: '资源共享' },
              ].map((item) => (
                <HStack key={item.label} spacing={2} color="gray.500">
                  <Icon as={item.icon} boxSize={4} aria-hidden />
                  <Text fontSize="xs">{item.label}</Text>
                </HStack>
              ))}
            </HStack>
            <Text textAlign="center" fontSize="xs" color="gray.500" lineHeight="1.9">
              本软件版权归属华中师范大学教育学院与人工智能教育学部“拾遗学舍”项目组所有
              <Box as="span" display={{ base: 'block', md: 'inline' }}> · 相关问题联系：wyw097@163.com</Box>
            </Text>
          </Box>
        </Box>
      )}

      {isLoggedIn && user && (
        <Box maxW="1200px" mx="auto" pt={{ base: '96px', md: '112px' }} pb={{ base: 8, md: 12 }} px={{ base: 4, md: 0 }}>
          <UserDashboard user={user} onLogout={logout} />
        </Box>
      )}
    </Box>
  )
}
