import { useState } from 'react'
import { Box, Text, HStack, Icon } from '@chakra-ui/react'
import { FiBookOpen, FiFilm, FiCpu, FiUsers, FiArchive } from 'react-icons/fi'
import { useAuth } from '../hooks/useAuth'
import LoginCard from '../components/LoginCard'
import RegisterCard from '../components/RegisterCard'
import UserDashboard from '../components/UserDashboard'
import './homePage.css'

type AuthView = 'login' | 'register'

const features = [
  { icon: FiBookOpen, label: '经典研习' },
  { icon: FiFilm, label: '名师微课' },
  { icon: FiCpu, label: 'AI助学' },
  { icon: FiUsers, label: '亲子共育' },
  { icon: FiArchive, label: '资源共享' },
]

function ReadingStudent() {
  return (
    <div className="reading-scene" aria-hidden="true">
      <div className="reading-scene__seal">学<br />思</div>
      <span className="reading-scene__leaf reading-scene__leaf--one" />
      <span className="reading-scene__leaf reading-scene__leaf--two" />
      <div className="reading-scene__person">
        <img src="/login-assets/reading-student.svg" alt="" />
      </div>
      <div className="reading-scene__desk">
        <span className="reading-scene__book" />
        <span className="reading-scene__inkstone" />
      </div>
    </div>
  )
}

export default function HomePage() {
  const { user, isLoggedIn, login, register, logout } = useAuth()
  const [view, setView] = useState<AuthView>('login')

  return (
    <Box w="100%" minH="calc(100svh - 80px)" bg="#F7F5EF">
      {!isLoggedIn && (
        <Box as="main" className="login-page">
          <section className="login-stage">
            <div className="login-stage__visual">
              <div className="login-stage__brand">
                <img src="/logo.png" alt="拾遗学舍" className="login-stage__logo" />
                <p className="login-stage__eyebrow">传统文化教育数智化平台</p>
                <h1>在经典里相遇，<br />在书院中成长</h1>
                <p className="login-stage__intro">
                  <span>承书院文脉，育时代新人</span>
                  <span className="login-stage__intro-detail">连接书院、班级与家庭，让学习自然发生。</span>
                </p>
              </div>
              <ReadingStudent />
              <blockquote className="login-stage__quote">
                <span>“</span>学而时习之，不亦说乎<span>”</span>
              </blockquote>
            </div>

            <div className="login-stage__auth">
              <div className="login-stage__auth-heading">
                <p>欢迎回来</p>
                <h2>{view === 'login' ? '登录拾遗学舍' : '创建学习账号'}</h2>
                <span>{view === 'login' ? '继续今天的经典研习' : '从这里开启书院之旅'}</span>
              </div>
              {view === 'login' ? (
                <LoginCard onLogin={login} onSwitchToRegister={() => setView('register')} />
              ) : (
                <RegisterCard onRegister={register} onSwitchToLogin={() => setView('login')} />
              )}
            </div>
          </section>

          <Box as="footer" className="login-page__footer">
            <HStack justify="center" spacing={{ base: 4, md: 8 }} flexWrap="wrap" rowGap={3}>
              {features.map((item) => (
                <HStack key={item.label} spacing={2} color="#64736D">
                  <Icon as={item.icon} boxSize={4} aria-hidden />
                  <Text fontSize="xs">{item.label}</Text>
                </HStack>
              ))}
            </HStack>
            <Text textAlign="center" fontSize="xs" color="#7A8581" lineHeight="1.8">
              本软件版权归属华中师范大学教育学院与人工智能教育学部“拾遗学舍”项目组所有
              <Box as="span" display={{ base: 'block', md: 'inline' }}> · 联系：wyw097@163.com</Box>
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
