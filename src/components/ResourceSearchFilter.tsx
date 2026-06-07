import {
  Box, Flex, HStack, VStack, Text, Input, InputGroup, InputLeftElement,
  Select, IconButton, Tag, TagLabel, Wrap, WrapItem,
} from '@chakra-ui/react'
import { SearchIcon, CloseIcon } from './Icons'
import type { ResourceCategory } from '../types/resource'
import type { SchoolLevel } from '../types'

interface SearchFilterProps {
  category: ResourceCategory
  searchKeyword: string
  onSearchChange: (value: string) => void
  stageFilter: string
  onStageFilterChange: (value: string) => void
  typeFilter: string
  onTypeFilterChange: (value: string) => void
  subjectFilter: string
  onSubjectFilterChange: (value: string) => void
  topicFilter: string
  onTopicFilterChange: (value: string) => void
}

const stageOptions: { value: string; label: string }[] = [
  { value: '', label: '全部学段' },
  { value: '小学低段', label: '小学低段' },
  { value: '小学高段', label: '小学高段' },
  { value: '初中', label: '初中' },
  { value: '高中', label: '高中' },
]

const courseTypeOptions = [
  { value: '', label: '全部专题' },
  { value: '书院历史', label: '书院历史' },
  { value: '学规解读', label: '学规解读' },
  { value: '先贤精神', label: '先贤精神' },
  { value: '经典导读', label: '经典导读' },
]

const prepTypeOptions = [
  { value: '', label: '全部类型' },
  { value: '精品教案', label: '精品教案' },
  { value: '教学课件', label: '教学课件' },
  { value: '同步检测试题', label: '同步检测试题' },
  { value: '主题班会设计', label: '主题班会设计' },
  { value: '研学活动手册', label: '研学活动手册' },
]

const studentTypeOptions = [
  { value: '', label: '全部类型' },
  { value: '图文', label: '图文' },
  { value: '视频', label: '视频' },
  { value: '音频', label: '音频' },
  { value: '任务单', label: '任务单' },
]

const familyMethodOptions = [
  { value: '', label: '全部方式' },
  { value: '亲子共读', label: '亲子共读' },
  { value: '家长导读', label: '家长导读' },
  { value: '学生自读+家长点评', label: '自读+点评' },
  { value: '角色扮演', label: '角色扮演' },
]

const subjectOptions = [
  { value: '', label: '全部学科' },
  { value: '语文', label: '语文' },
  { value: '历史', label: '历史' },
  { value: '道德与法治', label: '道德与法治' },
  { value: '综合实践活动', label: '综合实践' },
  { value: '校本课程', label: '校本课程' },
]

export default function ResourceSearchFilter({
  category,
  searchKeyword,
  onSearchChange,
  stageFilter,
  onStageFilterChange,
  typeFilter,
  onTypeFilterChange,
  subjectFilter,
  onSubjectFilterChange,
  topicFilter,
  onTopicFilterChange,
}: SearchFilterProps) {
  return (
    <Box
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="blackAlpha.100"
      boxShadow="sm"
      p={{ base: 3, md: 4 }}
    >
      {/* 搜索框 + 学段筛选（始终可见） */}
      <Flex
        gap={{ base: 2, md: 3 }}
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'stretch', md: 'center' }}
      >
        <InputGroup size="md" maxW={{ md: '360px' }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`搜索${category}资源...`}
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="full"
            fontSize="sm"
            _focus={{ bg: 'white', borderColor: 'brand.primary', boxShadow: '0 0 0 1px #2C5F2D' }}
          />
          {searchKeyword && (
            <IconButton
              aria-label="清除搜索"
              icon={<CloseIcon />}
              size="xs"
              variant="ghost"
              position="absolute"
              right={2}
              top="50%"
              transform="translateY(-50%)"
              zIndex={2}
              onClick={() => onSearchChange('')}
            />
          )}
        </InputGroup>

        {/* 学段筛选 */}
        <Select
          size="md"
          maxW={{ md: '140px' }}
          value={stageFilter}
          onChange={(e) => onStageFilterChange(e.target.value)}
          bg="gray.50"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="full"
          fontSize="sm"
          _focus={{ bg: 'white', borderColor: 'brand.primary' }}
        >
          {stageOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Select>

        {/* 类型筛选 - 按专题不同 */}
        <Select
          size="md"
          maxW={{ md: '160px' }}
          value={typeFilter || topicFilter}
          onChange={(e) => {
            // 根据 category 判断是 typeFilter 还是 topicFilter
            if (category === '名师微课') onTopicFilterChange(e.target.value)
            else onTypeFilterChange(e.target.value)
          }}
          bg="gray.50"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="full"
          fontSize="sm"
          _focus={{ bg: 'white', borderColor: 'brand.primary' }}
        >
          {(category === '名师微课'
            ? courseTypeOptions
            : category === '教师备课'
              ? prepTypeOptions
              : category === '学生学习'
                ? studentTypeOptions
                : familyMethodOptions
          ).map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Select>

        {/* 学科筛选 - 仅在教师备课专题显示 */}
        {category === '教师备课' && (
          <Select
            size="md"
            maxW={{ md: '140px' }}
            value={subjectFilter}
            onChange={(e) => onSubjectFilterChange(e.target.value)}
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="full"
            fontSize="sm"
            _focus={{ bg: 'white', borderColor: 'brand.primary' }}
          >
            {subjectOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>
        )}
      </Flex>

      {/* 活跃筛选标签 */}
      {(stageFilter || typeFilter || topicFilter || subjectFilter) && (
        <Wrap spacing={2} mt={3}>
          {stageFilter && (
            <Tag size="sm" colorScheme="green" borderRadius="full" cursor="pointer" onClick={() => onStageFilterChange('')}>
              <TagLabel>{stageFilter} ✕</TagLabel>
            </Tag>
          )}
          {typeFilter && (
            <Tag size="sm" colorScheme="blue" borderRadius="full" cursor="pointer" onClick={() => onTypeFilterChange('')}>
              <TagLabel>{typeFilter} ✕</TagLabel>
            </Tag>
          )}
          {topicFilter && (
            <Tag size="sm" colorScheme="purple" borderRadius="full" cursor="pointer" onClick={() => onTopicFilterChange('')}>
              <TagLabel>{topicFilter} ✕</TagLabel>
            </Tag>
          )}
          {subjectFilter && (
            <Tag size="sm" colorScheme="orange" borderRadius="full" cursor="pointer" onClick={() => onSubjectFilterChange('')}>
              <TagLabel>{subjectFilter} ✕</TagLabel>
            </Tag>
          )}
        </Wrap>
      )}
    </Box>
  )
}
