import { Routes, Route } from 'react-router-dom'
import { Box, chakra, shouldForwardProp } from '@chakra-ui/react'
import { isValidMotionProp, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ClassicsPage from './pages/ClassicsPage'
import ClassicDetailPage from './pages/ClassicDetailPage'
import ReaderPage from './pages/ReaderPage'
import AIPage from './pages/AIPage'
import MyLearningPage from './pages/MyLearningPage'
import ResourceSharingPage from './pages/ResourceSharingPage'
import ResourceDetailPage from './pages/ResourceDetailPage'
import HomePage from './pages/HomePage'
import DiscussionPage from './pages/DiscussionPage'

const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
})

const pageMotion = {
  transition: { duration: 0.28, ease: 'easeOut' },
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
    </Box>
  )
}
