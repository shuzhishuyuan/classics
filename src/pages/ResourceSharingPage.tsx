import { useState, useMemo } from 'react'
import {
  Box, Text, VStack, HStack, Flex, Divider, useToast,
} from '@chakra-ui/react'
import ResourceCategoryNav from '../components/ResourceCategoryNav'
import ResourceSearchFilter from '../components/ResourceSearchFilter'
import FeaturedCourses from '../components/FeaturedCourses'
import TeacherPreparationResources from '../components/TeacherPreparationResources'
import StudentLearningResources from '../components/StudentLearningResources'
import ParentChildReading from '../components/ParentChildReading'
import { useLocalStorage } from '../hooks/useLocalStorage'
import {
  featuredCoursesData,
  teacherPrepData,
  studentLearningData,
  parentChildReadingData,
} from '../data/resourceMockData'
import type { ResourceCategory } from '../types/resource'

/** 各专题对应的资源数据 */
const categoryDataMap: Record<ResourceCategory, typeof featuredCoursesData> = {
  '名师微课': featuredCoursesData,
  '教师备课': teacherPrepData,
  '学生学习': studentLearningData,
  '亲子共读': parentChildReadingData,
}

/** 页面标题区 */
function PageHeader() {
  return (
    <Box
      textAlign="center"
      py={{ base: 8, md: 12 }}
      px={4}
      bg="linear-gradient(180deg, rgba(44,95,45,0.04) 0%, transparent 100%)"
      borderRadius="2xl"
      mb={8}
    >
      <Text
        fontSize={{ base: '3xl', md: '4xl' }}
        fontWeight={900}
        fontFamily="heading"
        color="brand.primary"
        mb={3}
        letterSpacing="wide"
      >
        <Text as="span" mr={3}>📦</Text>
        资源共享
      </Text>
      <Text
        fontSize={{ base: 'sm', md: 'md' }}
        color="gray.500"
        maxW="680px"
        mx="auto"
        lineHeight="1.7"
      >
        搭建书院文化教育资源库，联通书院、班级与家庭，
        服务教师教学、学生学习与亲子共育，构建体系化、普惠化的传统文化教育资源平台。
      </Text>

      {/* 四维定位指示 */}
      <HStack
        spacing={{ base: 3, md: 6 }}
        justify="center"
        mt={6}
        flexWrap="wrap"
      >
        {[
          { icon: '🏫', label: '教师教学支持', color: 'brand.primary' },
          { icon: '✏️', label: '学生自主学习', color: 'brand.secondary' },
          { icon: '👨‍👩‍👧', label: '家庭亲子共育', color: '#6B5B4F' },
          { icon: '🗺️', label: '地方文化拓展', color: 'brand.accent' },
        ].map((item) => (
          <HStack key={item.label} spacing={1.5}>
            <Text fontSize="lg">{item.icon}</Text>
            <Text fontSize="sm" fontWeight={600} color={item.color}>
              {item.label}
            </Text>
          </HStack>
        ))}
      </HStack>
    </Box>
  )
}

export default function ResourceSharingPage() {
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>('名师微课')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [topicFilter, setTopicFilter] = useState('')
  const [methodFilter, setMethodFilter] = useState('')
  const [favorites, setFavorites] = useLocalStorage<string[]>('resource_favorites', [])

  const toast = useToast()

  /** 切换专题时重置所有筛选条件 */
  const handleCategoryChange = (category: ResourceCategory) => {
    setActiveCategory(category)
    setSearchKeyword('')
    setStageFilter('')
    setTypeFilter('')
    setSubjectFilter('')
    setTopicFilter('')
    setMethodFilter('')
  }

  /** 收藏切换 */
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    )
  }

  /** 根据当前专题渲染对应内容 */
  const renderContent = () => {
    const data = categoryDataMap[activeCategory]

    switch (activeCategory) {
      case '名师微课':
        return (
          <FeaturedCourses
            data={data}
            searchKeyword={searchKeyword}
            stageFilter={stageFilter}
            topicFilter={topicFilter}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )
      case '教师备课':
        return (
          <TeacherPreparationResources
            data={data}
            searchKeyword={searchKeyword}
            stageFilter={stageFilter}
            typeFilter={typeFilter}
            subjectFilter={subjectFilter}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )
      case '学生学习':
        return (
          <StudentLearningResources
            data={data}
            searchKeyword={searchKeyword}
            stageFilter={stageFilter}
            typeFilter={typeFilter}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )
      case '亲子共读':
        return (
          <ParentChildReading
            data={data}
            searchKeyword={searchKeyword}
            stageFilter={stageFilter}
            methodFilter={methodFilter}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )
      default:
        return null
    }
  }

  return (
    <Box maxW="1200px" mx="auto">
      {/* 页面标题 */}
      <PageHeader />

      {/* 分类导航标签 */}
      <Box mb={6}>
        <ResourceCategoryNav
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      </Box>

      <Divider borderColor="blackAlpha.100" mb={6} />

      {/* 搜索筛选栏 */}
      <Box mb={6}>
        <ResourceSearchFilter
          category={activeCategory}
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
          stageFilter={stageFilter}
          onStageFilterChange={setStageFilter}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          subjectFilter={subjectFilter}
          onSubjectFilterChange={setSubjectFilter}
          topicFilter={topicFilter}
          onTopicFilterChange={setTopicFilter}
        />
      </Box>

      {/* 专题内容区域 */}
      <Box minH="400px">
        {renderContent()}
      </Box>
    </Box>
  )
}
