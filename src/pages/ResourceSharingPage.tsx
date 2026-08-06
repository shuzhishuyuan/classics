import { useState, useEffect } from 'react'
import {
  Box, Text, VStack, HStack, Flex, Divider, Spinner,
} from '@chakra-ui/react'
import ResourceCategoryNav from '../components/ResourceCategoryNav'
import ResourceSearchFilter from '../components/ResourceSearchFilter'
import FeaturedCourses from '../components/FeaturedCourses'
import TeacherPreparationResources from '../components/TeacherPreparationResources'
import StudentLearningResources from '../components/StudentLearningResources'
import ParentChildReading from '../components/ParentChildReading'
import SharedResourceSection from '../components/SharedResourceSection'
import { fetchResources } from '../api/resources'
import type { ResourceCategory, ResourceItem } from '../types/resource'

type PageCategory = ResourceCategory | '用户投稿'

function PageHeader() {
  return (
    <Box textAlign="center" py={{ base: 8, md: 12 }} px={4} bg="linear-gradient(180deg, rgba(44,95,45,0.04) 0%, transparent 100%)" borderRadius="2xl" mb={8}>
      <Text fontSize={{ base: '3xl', md: '4xl' }} fontWeight={900} fontFamily="heading" color="brand.primary" mb={3} letterSpacing="wide">
        <Text as="span" mr={3}>📦</Text>资源共享
      </Text>
      <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.500" maxW="680px" mx="auto" lineHeight="1.7">
        搭建书院文化教育资源库，联通书院、班级与家庭，服务教师教学、学生学习与亲子共育。
      </Text>
      <HStack spacing={{ base: 3, md: 6 }} justify="center" mt={6} flexWrap="wrap">
        {[
          { icon: '🏫', label: '教师教学支持', color: 'brand.primary' },
          { icon: '✏️', label: '学生自主学习', color: 'brand.secondary' },
          { icon: '👨‍👩‍👧', label: '家庭亲子共育', color: '#6B5B4F' },
          { icon: '📤', label: '社区资源贡献', color: 'brand.accent' },
        ].map(item => (
          <HStack key={item.label} spacing={1.5}><Text fontSize="lg">{item.icon}</Text><Text fontSize="sm" fontWeight={600} color={item.color}>{item.label}</Text></HStack>
        ))}
      </HStack>
    </Box>
  )
}

export default function ResourceSharingPage() {
  const [activeCategory, setActiveCategory] = useState<PageCategory>('名师微课')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [topicFilter, setTopicFilter] = useState('')
  const [data, setData] = useState<ResourceItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (activeCategory === '用户投稿') { setLoading(false); return }
    setLoading(true)
    fetchResources({ category: activeCategory, pageSize: '50' }).then(res => {
      if (res.code === 200) setData(res.data.list)
      setLoading(false)
    })
  }, [activeCategory])

  const handleCategoryChange = (cat: PageCategory) => {
    setActiveCategory(cat)
    setSearchKeyword(''); setStageFilter(''); setTypeFilter(''); setSubjectFilter(''); setTopicFilter('')
  }

  // 用户投稿页面
  if (activeCategory === '用户投稿') {
    return (
      <Box maxW="1200px" mx="auto">
        <PageHeader />
        <Box mb={6}><ResourceCategoryNav activeCategory={activeCategory} onCategoryChange={handleCategoryChange} /></Box>
        <Divider borderColor="blackAlpha.100" mb={6} />
        <SharedResourceSection />
      </Box>
    )
  }

  if (loading) return <Box textAlign="center" py={20}><Spinner color="brand.primary" /></Box>

  let filtered = [...data]
  if (searchKeyword) {
    const kw = searchKeyword.toLowerCase()
    filtered = filtered.filter(r => r.title.includes(kw) || r.description.includes(kw) || r.tags.some(t => t.includes(kw)))
  }
  if (stageFilter) filtered = filtered.filter(r => { const s = Array.isArray(r.stage) ? r.stage : [r.stage]; return (s as string[]).includes(stageFilter) })
  if (typeFilter) filtered = filtered.filter(r => r.type === typeFilter)
  if (subjectFilter) filtered = filtered.filter(r => r.subject === subjectFilter)
  if (topicFilter) filtered = filtered.filter(r => (r as any).courseTopic === topicFilter)

  const Component = {
    '名师微课': FeaturedCourses,
    '教师备课': TeacherPreparationResources,
    '学生学习': StudentLearningResources,
    '亲子共读': ParentChildReading,
  }[activeCategory]

  return (
    <Box maxW="1200px" mx="auto">
      <PageHeader />
      <Box mb={6}><ResourceCategoryNav activeCategory={activeCategory} onCategoryChange={handleCategoryChange} /></Box>
      <Divider borderColor="blackAlpha.100" mb={6} />
      <Box mb={6}>
        <ResourceSearchFilter category={activeCategory as ResourceCategory} searchKeyword={searchKeyword} onSearchChange={setSearchKeyword}
          stageFilter={stageFilter} onStageFilterChange={setStageFilter} typeFilter={typeFilter} onTypeFilterChange={setTypeFilter}
          subjectFilter={subjectFilter} onSubjectFilterChange={setSubjectFilter} topicFilter={topicFilter} onTopicFilterChange={setTopicFilter} />
      </Box>
      <Box minH="400px">
        {Component ? <Component data={filtered} searchKeyword="" stageFilter="" typeFilter=""
          topicFilter="" subjectFilter="" methodFilter="" favorites={[]} onToggleFavorite={() => {}} /> : null}
      </Box>
    </Box>
  )
}
