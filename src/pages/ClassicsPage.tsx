import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  Box, Text, HStack, SimpleGrid, VStack, Button, Flex, Tag, TagLabel,
  Input, InputGroup, InputLeftElement, InputRightElement,
  IconButton, Divider, Collapse, Badge, Spinner,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { SearchIcon, CloseIcon, ViewGridIcon, ViewListIcon } from '../components/Icons'
import ClassicCard from '../components/ClassicCard'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { fetchClassics, searchClassics } from '../api/classics'
import { toggleFavorite, fetchFavorites, toggleEnroll, fetchEnrolled } from '../api/learning'
import type { Classic, EducateDimension, AcademySource, GenreType } from '../types'

type QuickTag = '全部' | '已收藏'

type FilterCategory =
  | { type: 'dimension'; value: EducateDimension }
  | { type: 'academy'; value: AcademySource }
  | { type: 'genre'; value: GenreType }

const filterOptions: FilterCategory[] = [
  { type: 'dimension', value: '价值引领' },
  { type: 'dimension', value: '知识建构' },
  { type: 'dimension', value: '制度规约' },
  { type: 'dimension', value: '空间叙事' },
  { type: 'dimension', value: '实践养成' },
  { type: 'academy', value: '白鹿洞书院' },
  { type: 'academy', value: '岳麓书院' },
  { type: 'academy', value: '石鼓书院' },
  { type: 'academy', value: '嵩阳书院' },
  { type: 'academy', value: '应天书院' },
  { type: 'genre', value: '学规' },
  { type: 'genre', value: '语录' },
  { type: 'genre', value: '会讲记录' },
  { type: 'genre', value: '碑刻' },
  { type: 'genre', value: '文集' },
]

const filterColorSchemes: Record<string, string> = {
  dimension: 'green', academy: 'orange', genre: 'purple',
}

export default function ClassicsPage() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedTag, setSelectedTag] = useState<QuickTag>('全部')
  const [selectedFilters, setSelectedFilters] = useState<FilterCategory[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchHistory, setSearchHistory] = useLocalStorage<{ keyword: string; timestamp: number }[]>('search_history', [])
  const [favorites, setFavorites] = useState<string[]>([])
  const [enrolled, setEnrolled] = useState<string[]>([])
  const [classics, setClassics] = useState<Classic[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  // 加载典籍列表 + 收藏列表
  const loadClassics = useCallback(async (filters: FilterCategory[]) => {
    setLoading(true)
    const params: Record<string, string> = {}
    const dims = filters.filter(f => f.type === 'dimension').map(f => f.value).join(',')
    const acas = filters.filter(f => f.type === 'academy').map(f => f.value).join(',')
    const gens = filters.filter(f => f.type === 'genre').map(f => f.value).join(',')
    if (dims) params.dimension = dims
    if (acas) params.academy = acas
    if (gens) params.genre = gens

    const [cRes, fRes, eRes] = await Promise.all([
      fetchClassics(params),
      fetchFavorites(),
      fetchEnrolled(),
    ])

    if (cRes.code === 200) {
      setClassics(cRes.data.list)
      setTotal(cRes.data.total)
    }
    if (fRes.code === 200) {
      setFavorites(fRes.data.map((c: any) => c.id))
    }
    if (eRes.code === 200) {
      setEnrolled(eRes.data.map((c: any) => c.id))
    }
    setLoading(false)
  }, [])

  useEffect(() => { loadClassics(selectedFilters) }, [selectedFilters, loadClassics])

  // 搜索
  const handleSearch = async (value: string) => {
    setSearchValue(value)
    if (value.trim()) {
      const res = await searchClassics(value.trim())
      if (res.code === 200) setSearchResults(res.data.slice(0, 8))
      setShowDropdown(true)
    } else {
      setSearchResults([])
      setShowDropdown(false)
    }
  }

  const handleSelect = (result: any) => {
    const newHistory = [{ keyword: searchValue, timestamp: Date.now() }, ...searchHistory.filter(h => h.keyword !== searchValue)].slice(0, 5)
    setSearchHistory(newHistory)
    setShowDropdown(false)
    setSearchValue('')
    if (result.type === 'classic' || result.type === 'chapter') {
      if (result.chapterId) {
        navigate(`/classics/${result.classicId}/read/${result.classicId === 'bailu-dong' ? 'bl-whole' : 'yl-xuegui'}/${result.chapterId}`)
      } else {
        navigate(`/classics/${result.classicId}`)
      }
    }
  }

  const handleToggleFavorite = async (classicId: string) => {
    const res = await toggleFavorite(classicId)
    if (res.code === 200) {
      if (res.data.favorited) setFavorites(prev => [...prev, classicId])
      else setFavorites(prev => prev.filter(id => id !== classicId))
    }
  }

  const handleToggleLearning = async (classicId: string) => {
    const res = await toggleEnroll(classicId)
    if (res.code === 200) {
      if (res.data.enrolled) setEnrolled(prev => [...prev, classicId])
      else setEnrolled(prev => prev.filter(id => id !== classicId))
    }
  }

  const toggleFilter = (filter: FilterCategory) => {
    setSelectedFilters(prev =>
      prev.some(f => f.type === filter.type && f.value === filter.value)
        ? prev.filter(f => !(f.type === filter.type && f.value === filter.value))
        : [...prev, filter]
    )
  }

  const highlightKeyword = (text: string, keyword: string) => {
    if (!keyword.trim()) return text
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase()
        ? `<mark style="background:#FFD54F;color:#333;padding:0 2px;border-radius:2px">${part}</mark>`
        : part
    ).join('')
  }

  const displayClassics = useMemo(() => {
    if (selectedTag === '已收藏') return classics.filter(c => favorites.includes(c.id))
    return classics
  }, [classics, favorites, selectedTag])

  return (
    <Box maxW="1200px">
      {/* 搜索 + 视图切换 */}
      <Flex justify="space-between" align="center" mb={4} gap={4}>
        <Box position="relative" maxW="420px" flex={1}>
          <InputGroup size="md">
            <InputLeftElement pointerEvents="none"><SearchIcon color="gray.400" /></InputLeftElement>
            <Input
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchValue.trim() && setShowDropdown(true)}
              placeholder="搜索典籍、作者、章节..."
              bg="white" border="1px solid" borderColor="gray.200" borderRadius="full" fontSize="sm"
              _focus={{ bg: 'white', borderColor: 'brand.primary', boxShadow: '0 0 0 1px #2C5F2D' }}
            />
            {searchValue && (
              <InputRightElement>
                <IconButton aria-label="清除" icon={<CloseIcon />} size="xs" variant="ghost"
                  onClick={() => { setSearchValue(''); setShowDropdown(false) }} />
              </InputRightElement>
            )}
          </InputGroup>
          <Collapse in={showDropdown} animateOpacity>
            <Box position="absolute" top="100%" left={0} right={0} mt={2} bg="white" borderRadius="lg" boxShadow="lg"
              border="1px solid" borderColor="gray.100" maxH="400px" overflowY="auto" zIndex={100}>
              {searchResults.length > 0 ? (
                <VStack spacing={0} align="stretch">
                  <Text px={4} pt={3} pb={1} fontSize="xs" color="gray.500" fontWeight={600}>搜索结果</Text>
                  {searchResults.map((result, idx) => (
                    <Box key={idx} px={4} py={2.5} cursor="pointer" _hover={{ bg: 'blackAlpha.50' }} onClick={() => handleSelect(result)}>
                      <HStack spacing={2}>
                        <Badge colorScheme={result.type === 'classic' ? 'green' : 'orange'} fontSize="xs" px={2} borderRadius="full">
                          {result.type === 'classic' ? '典籍' : '章节'}
                        </Badge>
                        <Text fontSize="sm" fontWeight={600} noOfLines={1}
                          dangerouslySetInnerHTML={{ __html: highlightKeyword(result.type === 'classic' ? (result.classicName || '') : `${result.classicName || ''} · ${result.chapterTitle || ''}`, searchValue) }} />
                      </HStack>
                      <Text fontSize="xs" color="gray.500" mt={0.5} ml="60px" noOfLines={1}
                        dangerouslySetInnerHTML={{ __html: highlightKeyword(result.matchContent, searchValue) }} />
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Box p={4} textAlign="center">
                  <Text color="gray.400" fontSize="sm">未找到相关内容</Text>
                </Box>
              )}
              {searchHistory.length > 0 && (
                <>
                  <Divider />
                  <Box px={4} py={2}>
                    <Flex justify="space-between" align="center" mb={1}>
                      <Text fontSize="xs" color="gray.500" fontWeight={600}>最近搜索</Text>
                      <Text fontSize="xs" color="gray.400" cursor="pointer" onClick={() => setSearchHistory([])} _hover={{ color: 'red.500' }}>清除</Text>
                    </Flex>
                    <HStack spacing={2} flexWrap="wrap">
                      {searchHistory.map((h) => (
                        <Box key={h.timestamp} px={2} py={0.5} bg="gray.100" borderRadius="full" fontSize="xs" color="gray.600"
                          cursor="pointer" onClick={() => { setSearchValue(h.keyword); handleSearch(h.keyword) }}>
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
        <HStack spacing={1} flexShrink={0}>
          <IconButton aria-label="网格" icon={<ViewGridIcon />} size="sm" variant={viewMode === 'grid' ? 'solid' : 'ghost'} colorScheme={viewMode === 'grid' ? 'green' : 'gray'} onClick={() => setViewMode('grid')} />
          <IconButton aria-label="列表" icon={<ViewListIcon />} size="sm" variant={viewMode === 'list' ? 'solid' : 'ghost'} colorScheme={viewMode === 'list' ? 'green' : 'gray'} onClick={() => setViewMode('list')} />
        </HStack>
      </Flex>

      {/* 三维筛选 */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        {(['dimension', 'academy', 'genre'] as const).map(type => {
          const labelMap = { dimension: '🌟 育人维度', academy: '🏫 书院来源', genre: '📄 体裁类型' }
          const options = filterOptions.filter(f => f.type === type)
          return (
            <Box key={type} bg="white" borderRadius="xl" border="1px solid" borderColor="blackAlpha.100" boxShadow="sm" p={4}
              _hover={{ boxShadow: 'md' }} transition="all 0.2s">
              <Text fontSize="sm" fontWeight={700} color={type === 'academy' ? 'brand.secondary' : 'brand.primary'} fontFamily="heading" mb={3}>
                {labelMap[type]}
              </Text>
              <Flex gap={2.5} flexWrap="wrap">
                {options.map(f => {
                  const isActive = selectedFilters.some(s => s.value === f.value)
                  const activeBg = type === 'academy' ? 'brand.secondary' : 'brand.primary'
                  return (
                    <Box key={f.value} px={3.5} py={2} borderRadius="lg" cursor="pointer" userSelect="none"
                      bg={isActive ? activeBg : 'blackAlpha.50'} color={isActive ? 'white' : 'gray.700'}
                      _hover={{ bg: isActive ? activeBg : 'blackAlpha.100', transform: 'translateY(-1px)' }}
                      transition="all 0.2s" fontSize="sm" fontWeight={isActive ? 600 : 400}
                      onClick={() => toggleFilter(f)}>
                      {f.value}
                    </Box>
                  )
                })}
              </Flex>
            </Box>
          )
        })}
      </SimpleGrid>

      {/* 标签栏 */}
      <HStack spacing={2} mb={3}>
        {(['全部', '已收藏'] as QuickTag[]).map(tag => (
          <Button key={tag} size="sm" variant={selectedTag === tag ? 'solid' : 'ghost'}
            colorScheme={selectedTag === tag ? 'green' : 'gray'} borderRadius="full" px={4}
            onClick={() => setSelectedTag(tag)}>{tag}</Button>
        ))}
      </HStack>

      {selectedFilters.length > 0 && (
        <HStack spacing={2} mb={4} flexWrap="wrap">
          {selectedFilters.map(f => (
            <Tag key={`${f.type}-${f.value}`} size="sm" colorScheme={filterColorSchemes[f.type]} borderRadius="full"
              cursor="pointer" onClick={() => toggleFilter(f)}>
              <TagLabel>{f.value} ✕</TagLabel>
            </Tag>
          ))}
        </HStack>
      )}

      {/* 典籍列表 */}
      {loading ? (
        <Box textAlign="center" py={20}><Spinner color="brand.primary" size="lg" /><Text mt={4} color="gray.500">加载中...</Text></Box>
      ) : displayClassics.length > 0 ? (
        viewMode === 'grid' ? (
          <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={5}>
            {displayClassics.map(c => (
              <ClassicCard key={c.id} classic={{ ...c, isFavorited: favorites.includes(c.id), isLearning: enrolled.includes(c.id) }} viewMode="grid"
                onToggleFavorite={() => handleToggleFavorite(c.id)}
                onToggleLearning={() => handleToggleLearning(c.id)} />
            ))}
          </SimpleGrid>
        ) : (
          <VStack spacing={3} align="stretch">
            {displayClassics.map(c => (
              <ClassicCard key={c.id} classic={{ ...c, isFavorited: favorites.includes(c.id), isLearning: enrolled.includes(c.id) }} viewMode="list"
                onToggleFavorite={() => handleToggleFavorite(c.id)}
                onToggleLearning={() => handleToggleLearning(c.id)} />
            ))}
          </VStack>
        )
      ) : (
        <Box textAlign="center" py={20}>
          <Text fontSize="5xl" mb={4}>📚</Text>
          <Text fontSize="lg" color="gray.500" fontWeight={600} fontFamily="heading">没有找到匹配的典籍</Text>
          <Text fontSize="sm" color="gray.400" mt={2}>试试调整筛选条件或搜索其他关键词</Text>
        </Box>
      )}
    </Box>
  )
}
