import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ClassicsPage from './pages/ClassicsPage'
import ClassicDetailPage from './pages/ClassicDetailPage'
import ReaderPage from './pages/ReaderPage'
import AIPage from './pages/AIPage'
import MyLearningPage from './pages/MyLearningPage'

/** 带侧边栏的布局 */
function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box display="flex" pt="72px">
      <Sidebar />
      <Box flex="1" ml={{ base: 0, lg: '220px' }} p={6}>
        {children}
      </Box>
    </Box>
  )
}

export default function App() {
  return (
    <Box minH="100vh">
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/classics" replace />} />
        <Route path="/classics" element={
          <SidebarLayout>
            <ClassicsPage />
          </SidebarLayout>
        } />
        <Route path="/classics/:id" element={<ClassicDetailPage />} />
        <Route path="/classics/:id/read/:volumeId/:chapterId" element={<ReaderPage />} />
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
      </Routes>
    </Box>
  )
}
