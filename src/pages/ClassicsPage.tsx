import { useState, useRef, useEffect, useMemo } from 'react'
import {
  Box, Text, HStack, SimpleGrid, VStack, Button, Flex, Tag, TagLabel,
  Input, InputGroup, InputLeftElement, InputRightElement,
  IconButton, Divider, Collapse, Badge,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { SearchIcon, CloseIcon, ViewGridIcon, ViewListIcon } from '../components/Icons'
import ClassicCard from '../components/ClassicCard'
import { classicsData } from '../data/classics'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Fuse from 'fuse.js'
import type { SearchResult, SearchHistoryItem, EducateDimension, AcademySource, GenreType } from '../types'

type QuickTag = '全部' | '已收藏'

type FilterCategory =
  | { type: 'dimension'; value: EducateDimension; icon: string }
  | { type: 'academy'; value: AcademySource; icon: string }
  | { type: 'genre'; value: GenreType; icon: string }

const filterOptions: FilterCategory[] = [
  // 育人维度
  { type: 'dimension', value: '价值引领', icon: '🎯' },
  { type: 'dimension', value: '知识建构', icon: '📚' },
  { type: 'dimension', value: '制度规约', icon: '📋' },
  { type: 'dimension', value: '空间叙事', icon: '🏛️' },
  { type: 'dimension', value: '实践养成', icon: '🌱' },
  // 书院来源
  { type: 'academy', value: '白鹿洞书院', icon: '🏔️' },
  { type: 'academy', value: '岳麓书院', icon: '🌄' },
  { type: 'academy', value: '石鼓书院', icon: '🥁' },
  { type: 'academy', value: '嵩阳书院', icon: '⛩️' },
  { type: 'academy', value: '应天书院', icon: '🏯' },
  // 体裁类型
  { type: 'genre', value: '学规', icon: '📜' },
  { type: 'genre', value: '语录', icon: '💬' },
  { type: 'genre', value: '会讲记录', icon: '🗣️' },
  { type: 'genre', value: '碑刻', icon: '⛰️' },
  { type: 'genre', value: '文集', icon: '📖' },
]

/** 筛选标签颜色映射 */
const filterColorSchemes: Record<string, string> = {
  dimension: 'green',
  academy: 'orange',
  genre: 'purple',
}

/** 将所有典籍章节扁平化，便于搜索 */
function flattenForSearch(): SearchResult[] {
  const results: SearchResult[] = []
  for (const classic of classicsData) {
    results.push({
      type: 'classic',
      classicId: classic.id,
      classicName: classic.name,
      matchContent: classic.description.slice(0, 40),
    })
    for (const volume of classic.chapters) {
      for (const chapter of volume.chapters) {
        results.push({
          type: 'chapter',
          classicId: classic.id,
          classicName: classic.name,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          matchContent: chapter.content.original.slice(0, 50),
        })
      }
    }
  }
  return results
}

const flatData = flattenForSearch()

const fuse = new Fuse(flatData, {
  keys: [
    { name: 'classicName', weight: 3 },
    { name: 'chapterTitle', weight: 2 },
    { name: 'matchContent', weight: 1 },
  ],
  threshold: 0.4,
  includeScore: true,
})

export default function ClassicsPage() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedTag, setSelectedTag] = useState<QuickTag>('全部')
  const [selectedFilters, setSelectedFilters] = useState<FilterCategory[]>([])

  // 搜索相关
  const [searchValue, setSearchValue] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchHistory, setSearchHistory] = useLocalStorage<SearchHistoryItem[]>('search_history', [])
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭下拉
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearch = (value: string) => {
    setSearchValue(value)
    if (value.trim()) {
      const results = fuse.search(value).map(r => r.item)
      setSearchResults(results.slice(0, 8))
      setShowDropdown(true)
    } else {
      setSearchResults([])
      setShowDropdown(false)
    }
  }

  const handleSelect = (result: SearchResult) => {
    const newHistory = [
      { keyword: searchValue, timestamp: Date.now() },
      ...searchHistory.filter(h => h.keyword !== searchValue),
    ].slice(0, 5)
    setSearchHistory(newHistory)
    setShowDropdown(false)
    setSearchValue('')

    if (result.type === 'classic') {
      navigate(`/classics/${result.classicId}`)
    } else if (result.type === 'chapter' && result.chapterId) {
      const classic = classicsData.find(c => c.id === result.classicId)
      if (classic) {
        for (const vol of classic.chapters) {
          if (vol.chapters.some(ch => ch.id === result.chapterId)) {
            navigate(`/classics/${result.classicId}/read/${vol.id}/${result.chapterId}`)
            break
          }
        }
      }
    }
  }

  const clearHistory = () => setSearchHistory([])

  /** 高亮搜索关键词 */
  const highlightKeyword = (text: string, keyword: string) => {
    if (!keyword.trim()) return text
    const parts = text.split(new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase()
        ? `<mark style="background:#FFD54F;color:#333;padding:0 2px;border-radius:2px">${part}</mark>`
        : part
    ).join('')
  }

  /** 切换筛选 */
  const toggleFilter = (filter: FilterCategory) => {
    setSelectedFilters(prev =>
      prev.some(f => f.type === filter.type && f.value === filter.value)
        ? prev.filter(f => !(f.type === filter.type && f.value === filter.value))
        : [...prev, filter]
    )
  }

  // 从 localStorage 获取收藏列表
  const favorites: string[] = JSON.parse(localStorage.getItem('favorites') || '[]')

  /** 过滤后的典籍列表 */
  const filteredClassics = useMemo(() => {
    let list = [...classicsData]

    // 按育人维度过滤
    const dimFilters = selectedFilters.filter(f => f.type === 'dimension').map(f => f.value) as EducateDimension[]
    if (dimFilters.length > 0) {
      list = list.filter(c => dimFilters.some(dim => c.dimensions.includes(dim)))
    }

    // 按书院来源过滤
    const acaFilters = selectedFilters.filter(f => f.type === 'academy').map(f => f.value) as AcademySource[]
    if (acaFilters.length > 0) {
      list = list.filter(c => acaFilters.includes(c.academySource))
    }

    // 按体裁类型过滤
    const genFilters = selectedFilters.filter(f => f.type === 'genre').map(f => f.value) as GenreType[]
    if (genFilters.length > 0) {
      list = list.filter(c => genFilters.includes(c.genre))
    }

    // 按快速标签过滤
    if (selectedTag === '已收藏') {
      list = list.filter(c => favorites.includes(c.id))
    }

    // 默认按热度排序
    list.sort((a, b) => b.popularity - a.popularity)

    return list
  }, [selectedFilters, selectedTag, favorites])

  return (
    <Box maxW="1200px">
      {/* 顶栏：搜索框（左）+ 视图切换（右） */}
      <Flex justify="space-between" align="center" mb={4} gap={4}>
        {/* 搜索框 */}
        <Box position="relative" maxW="420px" flex={1} ref={dropdownRef}>
          <InputGroup size="md">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              ref={inputRef}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchValue.trim() && setShowDropdown(true)}
              placeholder="搜索典籍、作者、章节..."
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              _focus={{ bg: 'white', borderColor: 'brand.primary', boxShadow: '0 0 0 1px #2C5F2D' }}
              borderRadius="full"
              fontSize="sm"
            />
            {searchValue && (
              <InputRightElement>
                <IconButton
                  aria-label="清除"
                  icon={<CloseIcon />}
                  size="xs"
                  variant="ghost"
                  onClick={() => { setSearchValue(''); setShowDropdown(false) }}
                />
              </InputRightElement>
            )}
          </InputGroup>

          {/* 搜索下拉 */}
          <Collapse in={showDropdown} animateOpacity>
            <Box
              position="absolute"
              top="100%"
              left={0}
              right={0}
              mt={2}
              bg="white"
              borderRadius="lg"
              boxShadow="lg"
              border="1px solid"
              borderColor="gray.100"
              maxH="400px"
              overflowY="auto"
              zIndex={100}
            >
              {searchResults.length > 0 ? (
                <VStack spacing={0} align="stretch">
                  <Text px={4} pt={3} pb={1} fontSize="xs" color="gray.500" fontWeight={600}>
                    搜索结果
                  </Text>
                  {searchResults.map((result, idx) => (
                    <Box
                      key={`${result.classicId}-${result.chapterId || 'classic'}-${idx}`}
                      px={4}
                      py={2.5}
                      cursor="pointer"
                      _hover={{ bg: 'blackAlpha.50' }}
                      onClick={() => handleSelect(result)}
                    >
                      <HStack spacing={2}>
                        <Badge
                          colorScheme={result.type === 'classic' ? 'green' : 'orange'}
                          fontSize="xs"
                          px={2}
                          borderRadius="full"
                        >
                          {result.type === 'classic' ? '典籍' : '章节'}
                        </Badge>
                        <Text fontSize="sm" fontWeight={600} noOfLines={1}>
                          <span dangerouslySetInnerHTML={{
                            __html: highlightKeyword(
                              result.type === 'classic' ? (result.classicName || '') : `${result.classicName || ''} · ${result.chapterTitle || ''}`,
                              searchValue
                            )
                          }} />
                        </Text>
                      </HStack>
                      <Text
                        fontSize="xs"
                        color="gray.500"
                        mt={0.5}
                        ml="60px"
                        noOfLines={1}
                        dangerouslySetInnerHTML={{ __html: highlightKeyword(result.matchContent, searchValue) }}
                      />
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Box p={4} textAlign="center">
                  <Text color="gray.400" fontSize="sm" mb={2}>未找到相关内容</Text>
                  <Text color="gray.500" fontSize="xs" fontWeight={600}>推荐阅读</Text>
                  <HStack spacing={2} justify="center" mt={1}>
                    {classicsData.slice(0, 3).map(c => (
                      <Text key={c.id} fontSize="xs" color="brand.primary" cursor="pointer" onClick={() => handleSelect({
                        type: 'classic', classicId: c.id, classicName: c.name, matchContent: c.description,
                      })}>
                        《{c.name}》
                      </Text>
                    ))}
                  </HStack>
                </Box>
              )}

              {searchHistory.length > 0 && (
                <>
                  <Divider />
                  <Box px={4} py={2}>
                    <Flex justify="space-between" align="center" mb={1}>
                      <Text fontSize="xs" color="gray.500" fontWeight={600}>最近搜索</Text>
                      <Text fontSize="xs" color="gray.400" cursor="pointer" onClick={clearHistory} _hover={{ color: 'red.500' }}>
                        清除
                      </Text>
                    </Flex>
                    <HStack spacing={2} flexWrap="wrap">
                      {searchHistory.map((h) => (
                        <Box
                          key={h.timestamp}
                          px={2}
                          py={0.5}
                          bg="gray.100"
                          borderRadius="full"
                          fontSize="xs"
                          color="gray.600"
                          cursor="pointer"
                          onClick={() => { setSearchValue(h.keyword); handleSearch(h.keyword) }}
                        >
                          {h.keyword}
                        </Box>
                      ))}
                    </HStack>
                  </Box>
                </>
              )}
            </Box>
          </Collapse>
        </Box>

        {/* 视图切换按钮 */}
        <HStack spacing={1} flexShrink={0}>
          <IconButton
            aria-label="网格视图"
            icon={<ViewGridIcon />}
            size="sm"
            variant={viewMode === 'grid' ? 'solid' : 'ghost'}
            colorScheme={viewMode === 'grid' ? 'green' : 'gray'}
            onClick={() => setViewMode('grid')}
          />
          <IconButton
            aria-label="列表视图"
            icon={<ViewListIcon />}
            size="sm"
            variant={viewMode === 'list' ? 'solid' : 'ghost'}
            colorScheme={viewMode === 'list' ? 'green' : 'gray'}
            onClick={() => setViewMode('list')}
          />
        </HStack>
      </Flex>

      {/* 搜索框下方：筛选列表（育人维度 + 书院来源 + 体裁类型）- 典雅卡片 */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        {/* 育人维度 */}
        <Box
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="blackAlpha.100"
          boxShadow="sm"
          p={4}
          _hover={{ boxShadow: 'md', borderColor: 'brand.light' }}
          transition="all 0.2s"
        >
          <Text fontSize="sm" fontWeight={700} color="brand.primary" fontFamily="heading" mb={3}>
            🌟 育人维度
          </Text>
          <Flex gap={2.5} flexWrap="wrap">
            {filterOptions.filter(f => f.type === 'dimension').map((f) => {
              const isActive = selectedFilters.some(s => s.value === f.value)
              return (
                <Box
                  key={f.value}
                  px={3.5}
                  py={2}
                  borderRadius="lg"
                  cursor="pointer"
                  bg={isActive ? 'brand.primary' : 'blackAlpha.50'}
                  color={isActive ? 'white' : 'gray.700'}
                  _hover={{
                    bg: isActive ? 'brand.primary' : 'blackAlpha.100',
                    transform: 'translateY(-1px)',
                  }}
                  transition="all 0.2s"
                  fontSize="sm"
                  fontWeight={isActive ? 600 : 400}
                  onClick={() => toggleFilter(f)}
                  userSelect="none"
                >
                  {f.value}
                </Box>
              )
            })}
          </Flex>
        </Box>

        {/* 书院来源 */}
        <Box
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="blackAlpha.100"
          boxShadow="sm"
          p={4}
          _hover={{ boxShadow: 'md', borderColor: 'brand.light' }}
          transition="all 0.2s"
        >
          <Text fontSize="sm" fontWeight={700} color="brand.secondary" fontFamily="heading" mb={3}>
            🏫 书院来源
          </Text>
          <Flex gap={2.5} flexWrap="wrap">
            {filterOptions.filter(f => f.type === 'academy').map((f) => {
              const isActive = selectedFilters.some(s => s.value === f.value)
              return (
                <Box
                  key={f.value}
                  px={3.5}
                  py={2}
                  borderRadius="lg"
                  cursor="pointer"
                  bg={isActive ? 'brand.secondary' : 'blackAlpha.50'}
                  color={isActive ? 'white' : 'gray.700'}
                  _hover={{
                    bg: isActive ? 'brand.secondary' : 'blackAlpha.100',
                    transform: 'translateY(-1px)',
                  }}
                  transition="all 0.2s"
                  fontSize="sm"
                  fontWeight={isActive ? 600 : 400}
                  onClick={() => toggleFilter(f)}
                  userSelect="none"
                >
                  {f.value}
                </Box>
              )
            })}
          </Flex>
        </Box>

        {/* 体裁类型 */}
        <Box
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="blackAlpha.100"
          boxShadow="sm"
          p={4}
          _hover={{ boxShadow: 'md', borderColor: 'brand.light' }}
          transition="all 0.2s"
        >
          <Text fontSize="sm" fontWeight={700} color="brand.primary" fontFamily="heading" mb={3}>
            📄 体裁类型
          </Text>
          <Flex gap={2.5} flexWrap="wrap">
            {filterOptions.filter(f => f.type === 'genre').map((f) => {
              const isActive = selectedFilters.some(s => s.value === f.value)
              return (
                <Box
                  key={f.value}
                  px={3.5}
                  py={2}
                  borderRadius="lg"
                  cursor="pointer"
                  bg={isActive ? 'brand.primary' : 'blackAlpha.50'}
                  color={isActive ? 'white' : 'gray.700'}
                  _hover={{
                    bg: isActive ? 'brand.primary' : 'blackAlpha.100',
                    transform: 'translateY(-1px)',
                  }}
                  transition="all 0.2s"
                  fontSize="sm"
                  fontWeight={isActive ? 600 : 400}
                  onClick={() => toggleFilter(f)}
                  userSelect="none"
                >
                  {f.value}
                </Box>
              )
            })}
          </Flex>
        </Box>
      </SimpleGrid>

      {/* 标签栏：仅保留 "全部" + "已收藏" */}
      <HStack spacing={2} mb={4}>
        {(['全部', '已收藏'] as QuickTag[]).map((tag) => (
          <Button
            key={tag}
            size="sm"
            variant={selectedTag === tag ? 'solid' : 'ghost'}
            colorScheme={selectedTag === tag ? 'green' : 'gray'}
            borderRadius="full"
            px={4}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </Button>
        ))}
      </HStack>

      {/* 显示当前已选的筛选标签（作为 Tags 展示在列表上方） */}
      {selectedFilters.length > 0 && (
        <HStack spacing={2} mb={4} flexWrap="wrap">
          {selectedFilters.map((f) => (
            <Tag
              key={`${f.type}-${f.value}`}
              size="sm"
              colorScheme={filterColorSchemes[f.type]}
              borderRadius="full"
              cursor="pointer"
              onClick={() => toggleFilter(f)}
            >
              <TagLabel>{f.value} ✕</TagLabel>
            </Tag>
          ))}
        </HStack>
      )}

      {/* 典籍列表 */}
      {filteredClassics.length > 0 ? (
        viewMode === 'grid' ? (
          <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={5}>
            {filteredClassics.map((classic) => (
              <ClassicCard key={classic.id} classic={classic} viewMode="grid" />
            ))}
          </SimpleGrid>
        ) : (
          <VStack spacing={3} align="stretch">
            {filteredClassics.map((classic) => (
              <ClassicCard key={classic.id} classic={classic} viewMode="list" />
            ))}
          </VStack>
        )
      ) : (
        <Box textAlign="center" py={20}>
          <Text fontSize="5xl" mb={4}>📚</Text>
          <Text fontSize="lg" color="gray.500" fontWeight={600} fontFamily="heading">
            没有找到匹配的典籍
          </Text>
          <Text fontSize="sm" color="gray.400" mt={2}>
            试试调整筛选条件或搜索其他关键词
          </Text>
        </Box>
      )}
    </Box>
  )
}
