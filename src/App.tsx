import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box, chakra, shouldForwardProp } from '@chakra-ui/react'
import { isValidMotionProp, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Spinner, VStack, Text } from '@chakra-ui/react'

const ClassicsPage = lazy(() => import('./pages/ClassicsPage'))
const ClassicDetailPage = lazy(() => import('./pages/ClassicDetailPage'))
const ReaderPage = lazy(() => import('./pages/ReaderPage'))
const MyLearningPage = lazy(() => import('./pages/MyLearningPage'))
const ResourceSharingPage = lazy(() => import('./pages/ResourceSharingPage'))
const ResourceDetailPage = lazy(() => import('./pages/ResourceDetailPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const DiscussionPage = lazy(() => import('./pages/DiscussionPage'))
const InteractiveAcademyHallPage = lazy(() => import('./pages/Interactive2D/AcademyHallPage'))

const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
})

const pageMotion = {
  transition: { duration: 0.28, ease: 'easeOut' },
}

function PageFallback() {
  return (
    <VStack py={24} spacing={4}>
      <Spinner color="brand.primary" size="lg" thickness="3px" />
      <Text fontSize="sm" color="gray.500">加载中</Text>
    </VStack>
  )
}

/** 典籍页面专用：带侧边栏的布局 */
function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box display="flex" pt="72px">
      <Sidebar />
      <MotionBox
        flex="1"
        ml={{ base: 0, lg: '220px' }}
        p={{ base: 4, md: 6 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        {...(pageMotion as any)}
      >
        {children}
      </MotionBox>
    </Box>
  )
}

/** 通用页面布局（无侧边栏） */
function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box pt="80px" px={6} pb={6}>
      {children}
    </Box>
  )
}

function InteractiveHallLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box className="interactive-hall-shell" display="flex" pt="72px">
      <Sidebar />
      <MotionBox
        flex="1"
        minW={0}
        ml={{ base: 0, lg: '220px' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        {...(pageMotion as any)}
      >
        {children}
      </MotionBox>
    </Box>
  )
}

export default function App() {
  return (
    <Box minH="100vh">
      <Navbar />

      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/classics" element={
            <SidebarLayout>
              <ClassicsPage />
            </SidebarLayout>
          } />
          <Route path="/classics/:id" element={
            <SidebarLayout>
              <ClassicDetailPage />
            </SidebarLayout>
          } />
          <Route path="/classics/:id/read/:volumeId/:chapterId" element={
            <SidebarLayout>
              <ReaderPage />
            </SidebarLayout>
          } />
          <Route path="/discussion" element={
            <SidebarLayout>
              <DiscussionPage />
            </SidebarLayout>
          } />
          <Route path="/immersive3d" element={<InteractiveHallLayout><InteractiveAcademyHallPage /></InteractiveHallLayout>} />
          <Route path="/academy-hall" element={<InteractiveHallLayout><InteractiveAcademyHallPage /></InteractiveHallLayout>} />
          <Route path="/academy-hall/:academyId" element={<InteractiveHallLayout><InteractiveAcademyHallPage /></InteractiveHallLayout>} />
          <Route path="/academy-3d" element={<InteractiveHallLayout><InteractiveAcademyHallPage /></InteractiveHallLayout>} />
          <Route path="/academy-3d/:academyId" element={<InteractiveHallLayout><InteractiveAcademyHallPage /></InteractiveHallLayout>} />
          <Route path="/academy/yuelu" element={<InteractiveHallLayout><InteractiveAcademyHallPage /></InteractiveHallLayout>} />
          <Route path="/learning" element={
            <SidebarLayout>
              <MyLearningPage />
            </SidebarLayout>
          } />
          <Route path="/resources" element={
            <PageLayout>
              <ResourceSharingPage />
            </PageLayout>
          } />
          <Route path="/resources/:id" element={
            <PageLayout>
              <ResourceDetailPage />
            </PageLayout>
          } />
        </Routes>
      </Suspense>
    </Box>
  )
}
