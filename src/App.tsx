import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box, chakra, shouldForwardProp } from '@chakra-ui/react'
import { isValidMotionProp, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import FloatingAiAssistant from './components/FloatingAiAssistant'
import { Spinner, VStack, Text } from '@chakra-ui/react'

const ClassicsPage = lazy(() => import('./pages/ClassicsPage'))
const ClassicDetailPage = lazy(() => import('./pages/ClassicDetailPage'))
const ReaderPage = lazy(() => import('./pages/ReaderPage'))
const AIPage = lazy(() => import('./pages/AIPage'))
const MyLearningPage = lazy(() => import('./pages/MyLearningPage'))
const ResourceSharingPage = lazy(() => import('./pages/ResourceSharingPage'))
const ResourceDetailPage = lazy(() => import('./pages/ResourceDetailPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const DiscussionPage = lazy(() => import('./pages/DiscussionPage'))
const Immersive3DPage = lazy(() => import('./pages/Immersive3D/Immersive3DPage'))
const YueluAcademyPage = lazy(() => import('./pages/Immersive3D/YueluAcademyPage'))
const AcademyExhibitionPage = lazy(() => import('./pages/Immersive3D/AcademyExhibitionPage'))

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

export default function App() {
  return (
    <Box minH="100vh">
      <Navbar />

      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={
    <PageLayout>
      <HomePage />
    </PageLayout>
  } />
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
          <Route path="/immersive3d" element={<Immersive3DPage />} />
          <Route path="/academy-3d" element={<YueluAcademyPage />} />
          <Route path="/academy-3d/:academyId" element={<AcademyExhibitionPage />} />
          <Route path="/academy/yuelu" element={<YueluAcademyPage />} />
          <Route path="/ai" element={
            <SidebarLayout>
              <AIPage />
            </SidebarLayout>
          } />
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
      <FloatingAiAssistant />
    </Box>
  )
}
