import { useState, useEffect, useRef } from 'react'
import {
  Box, Text, VStack, HStack, SimpleGrid, Button, Input, Textarea, Select,
  Flex, useToast, Spinner, Avatar, IconButton,
} from '@chakra-ui/react'
import { fetchSharedResources, createSharedResource } from '../api/resources'

const TAG_OPTIONS = ['书院历史', '学规解读', '先贤精神', '经典导读', '教案', '试题', '活动方案', '艺术创作', '其他']
const CATEGORY_OPTIONS = [
  { value: '名师微课', label: '🎬 名师微课' },
  { value: '教师备课', label: '📚 教师备课' },
  { value: '学生学习', label: '✏️ 学生学习' },
  { value: '亲子共读', label: '👨‍👩‍👧 亲子共读' },
]
const CATEGORY_COLORS: Record<string, string> = {
  '名师微课': 'purple', '教师备课': 'orange', '学生学习': 'green', '亲子共读': 'pink',
}

export default function SharedResourceSection() {
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [category, setCategory] = useState('学生学习')
  const [selTags, setSelTags] = useState<string[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [searchKw, setSearchKw] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const load = (keyword?: string) => {
    setLoading(true)
    const params: Record<string, string> = { pageSize: '50' }
    if (keyword) params.keyword = keyword
    if (filterCategory) params.category = filterCategory
    fetchSharedResources(params).then(res => {
      if (res.code === 200) setResources(res.data.list)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [filterCategory])

  const handleSubmit = async () => {
    if (!title.trim()) { toast({ title: '请输入资源标题', status: 'warning', duration: 2000, position: 'top' }); return }
    setSubmitting(true)
    let fileUrl: string | undefined

    if (file) {
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)
        const token = localStorage.getItem('access_token')
        const res = await fetch('/api/v1/upload', { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: formData })
        const json = await res.json()
        if (json.code === 200) { fileUrl = json.data.url }
        else { toast({ title: json.message || '文件上传失败', status: 'error', duration: 2500, position: 'top' }); setSubmitting(false); setUploading(false); return }
      } catch { toast({ title: '文件上传失败', status: 'error', duration: 2500, position: 'top' }); setSubmitting(false); setUploading(false); return }
      setUploading(false)
    }

    const res = await createSharedResource({ title: title.trim(), description: desc.trim(), category, tags: selTags, fileUrl })
    setSubmitting(false)
    if (res.code === 200) {
      toast({ title: '发布成功！全服用户都可以看到', status: 'success', duration: 2500, position: 'top' })
      setShowForm(false); setTitle(''); setDesc(''); setSelTags([]); setCategory('学生学习'); setFile(null)
      if (fileRef.current) fileRef.current.value = ''
      load()
    } else {
      toast({ title: res.message || '发布失败', status: 'error', duration: 2000, position: 'top' })
    }
  }

  return (
    <Box>
      {/* ===== 顶栏：分类筛选 + 搜索 + 发布 ===== */}
      <Flex justify="space-between" align="center" mb={6} gap={4} flexWrap="wrap">
        <HStack spacing={2} flexWrap="wrap">
          <Button
            size="sm" borderRadius="full" fontWeight={600}
            variant={!filterCategory ? 'solid' : 'ghost'}
            colorScheme={!filterCategory ? 'green' : 'gray'}
            onClick={() => setFilterCategory('')}
          >全部</Button>
          {CATEGORY_OPTIONS.map(opt => (
            <Button
              key={opt.value} size="sm" borderRadius="full" fontWeight={500}
              variant={filterCategory === opt.value ? 'solid' : 'outline'}
              colorScheme={filterCategory === opt.value ? 'green' : 'gray'}
              onClick={() => setFilterCategory(filterCategory === opt.value ? '' : opt.value)}
            >{opt.label}</Button>
          ))}
        </HStack>

        <HStack>
          <InputGroup>
            <Input
              placeholder="搜索投稿..."
              value={searchKw}
              onChange={e => setSearchKw(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && load(searchKw)}
              bg="white" border="1px solid" borderColor="gray.200" borderRadius="full"
              size="sm" w="200px" fontSize="sm"
              _focus={{ borderColor: 'brand.primary', boxShadow: '0 0 0 1px #2C5F2D' }}
            />
          </InputGroup>
          <Button
            size="md" borderRadius="full" fontWeight={600} px={6}
            bg="brand.primary" color="white"
            _hover={{ bg: 'brand.dark' }}
            _active={{ bg: 'brand.dark' }}
            onClick={() => setShowForm(!showForm)}
            leftIcon={<Text fontSize="md">{showForm ? '✕' : '📤'}</Text>}
          >
            {showForm ? '收起' : '发布资源'}
          </Button>
        </HStack>
      </Flex>

      {/* ===== 发布表单 ===== */}
      {showForm && (
        <Box
          bg="white" borderRadius="2xl" border="1px solid" borderColor="blackAlpha.100"
          boxShadow="sm" p={8} mb={8}
        >
          <Text fontSize="xl" fontWeight={700} fontFamily="heading" color="gray.800" mb={6} textAlign="center">
            发布共享资源
          </Text>

          <VStack spacing={5} align="stretch">
            {/* 标题 */}
            <Box>
              <Text fontSize="sm" fontWeight={600} color="gray.600" mb={1.5}>资源标题 *</Text>
              <Input
                placeholder="给你的资源起个名字"
                value={title} onChange={e => setTitle(e.target.value)}
                bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="xl"
                size="lg" fontSize="sm"
                _focus={{ bg: 'white', borderColor: 'brand.primary', boxShadow: '0 0 0 1px #2C5F2D' }}
              />
            </Box>

            {/* 分类 */}
            <Box>
              <Text fontSize="sm" fontWeight={600} color="gray.600" mb={1.5}>所属分类</Text>
              <Select
                value={category} onChange={e => setCategory(e.target.value)}
                bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="xl"
                size="lg" fontSize="sm"
                _focus={{ borderColor: 'brand.primary', boxShadow: '0 0 0 1px #2C5F2D' }}
              >
                {CATEGORY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </Select>
            </Box>

            {/* 描述 */}
            <Box>
              <Text fontSize="sm" fontWeight={600} color="gray.600" mb={1.5}>资源描述</Text>
              <Textarea
                placeholder="介绍一下这个资源的内容和用途..."
                value={desc} onChange={e => setDesc(e.target.value)}
                bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="xl"
                fontSize="sm" rows={3} resize="vertical"
                _focus={{ bg: 'white', borderColor: 'brand.primary', boxShadow: '0 0 0 1px #2C5F2D' }}
              />
            </Box>

            {/* 文件上传 */}
            <Box>
              <Text fontSize="sm" fontWeight={600} color="gray.600" mb={1.5}>上传文件</Text>
              <Text fontSize="xs" color="gray.400" mb={2}>支持 PDF、Word、PPT、MP4、MP3、JPG、PNG，最大 100MB</Text>
              <HStack
                bg="gray.50" border="1px dashed" borderColor="gray.300" borderRadius="xl" p={4}
                justify="center" cursor="pointer"
                _hover={{ borderColor: 'brand.primary', bg: '#F0F7F0' }}
                transition="all 0.2s"
                onClick={() => fileRef.current?.click()}
              >
                <Text fontSize="2xl">{file ? '📎' : '📁'}</Text>
                <VStack spacing={0} align="start">
                  <Text fontSize="sm" fontWeight={600} color={file ? 'brand.primary' : 'gray.500'}>
                    {file ? file.name : '点击选择文件，或拖拽到此处'}
                  </Text>
                  {file && <Text fontSize="xs" color="gray.400">{(file.size / 1024 / 1024).toFixed(1)} MB</Text>}
                </VStack>
                {file && (
                  <IconButton
                    aria-label="移除" icon={<Text>✕</Text>} size="xs" variant="ghost" borderRadius="full"
                    onClick={(e) => { e.stopPropagation(); setFile(null); if (fileRef.current) fileRef.current.value = '' }}
                    ml="auto"
                  />
                )}
              </HStack>
              <Input
                ref={fileRef} type="file" display="none"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mp3,.wav,.jpg,.jpeg,.png,.webp"
                onChange={e => setFile(e.target.files?.[0] || null)}
              />
            </Box>

            {/* 标签 */}
            <Box>
              <Text fontSize="sm" fontWeight={600} color="gray.600" mb={1.5}>内容标签</Text>
              <Flex gap={2} flexWrap="wrap">
                {TAG_OPTIONS.map(t => {
                  const active = selTags.includes(t)
                  return (
                    <Button
                      key={t} size="sm" borderRadius="full" fontWeight={500} fontSize="xs"
                      variant={active ? 'solid' : 'outline'}
                      colorScheme={active ? 'green' : 'gray'}
                      onClick={() => setSelTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
                    >{t}</Button>
                  )
                })}
              </Flex>
            </Box>

            {/* 提交 */}
            <Button
              size="lg" borderRadius="full" fontWeight={600} fontSize="md" mt={2}
              bg="brand.primary" color="white"
              _hover={{ bg: 'brand.dark' }}
              _active={{ bg: 'brand.dark' }}
              isLoading={submitting || uploading}
              loadingText={uploading ? '文件上传中...' : '发布中...'}
              onClick={handleSubmit}
            >
              确认发布
            </Button>
          </VStack>
        </Box>
      )}

      {/* ===== 资源列表 ===== */}
      {loading ? (
        <Box textAlign="center" py={20}>
          <Spinner color="brand.primary" size="lg" thickness="3px" />
          <Text mt={4} color="gray.400" fontSize="sm">加载中...</Text>
        </Box>
      ) : resources.length === 0 ? (
        <Box
          bg="white" borderRadius="2xl" border="1px solid" borderColor="blackAlpha.100"
          py={16} textAlign="center"
        >
          <Text fontSize="6xl" mb={4}>📤</Text>
          <Text fontSize="md" fontWeight={600} fontFamily="heading" color="gray.500">还没有人分享资源</Text>
          <Text fontSize="sm" color="gray.400" mt={1}>成为第一个贡献者吧</Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {resources.map(r => (
            <Box
              key={r.id}
              bg="white" borderRadius="xl" border="1px solid" borderColor="blackAlpha.100"
              overflow="hidden"
              _hover={{ borderColor: 'brand.primary', boxShadow: '0 8px 24px rgba(44,95,45,0.1)', transform: 'translateY(-2px)' }}
              transition="all 0.25s"
            >
              {/* 卡片顶部色条 + 分类 */}
              <Box
                h="8px"
                bg={CATEGORY_COLORS[r.category] ? `${CATEGORY_COLORS[r.category]}.400` : 'brand.primary'}
              />
              <Box p={5}>
                {/* 发布者 */}
                <HStack spacing={3} mb={3}>
                  <Avatar size="sm" bg="brand.primary" color="white" name={r.publisher?.name} />
                  <Box>
                    <Text fontSize="sm" fontWeight={600} color="gray.800">{r.publisher?.name || '匿名'}</Text>
                    <Text fontSize="xs" color="gray.400">{r.created_at?.slice(0, 10)}</Text>
                  </Box>
                </HStack>

                {/* 分类标签 */}
                <Box
                  display="inline-block"
                  px={3} py={0.5} borderRadius="full" fontSize="xs" fontWeight={600} mb={2}
                  bg={CATEGORY_COLORS[r.category] ? `${CATEGORY_COLORS[r.category]}.50` : 'green.50'}
                  color={CATEGORY_COLORS[r.category] ? `${CATEGORY_COLORS[r.category]}.600` : 'brand.primary'}
                >
                  {r.category || '学生学习'}
                </Box>

                {/* 标题 */}
                <Text fontSize="md" fontWeight={700} fontFamily="heading" color="gray.800" mb={1.5} noOfLines={2}>
                  {r.title}
                </Text>
                <Text fontSize="sm" color="gray.500" lineHeight="1.6" mb={3} noOfLines={2}>
                  {r.description || '暂无描述'}
                </Text>

                {/* 标签 */}
                {(r.tags || []).length > 0 && (
                  <Flex gap={1.5} flexWrap="wrap" mb={4}>
                    {(r.tags || []).slice(0, 3).map((t: string) => (
                      <Box key={t} px={2.5} py={0.5} bg="brand.bg" borderRadius="full" fontSize="xs" color="brand.primary" fontWeight={500}>
                        {t}
                      </Box>
                    ))}
                  </Flex>
                )}

                {/* 底部 */}
                <Flex justify="space-between" align="center" pt={3} borderTop="1px solid" borderColor="blackAlpha.50">
                  {r.file_url ? (
                    <Button
                      as="a" href={r.file_url} target="_blank"
                      size="sm" variant="outline" colorScheme="green" borderRadius="full" fontWeight={500}
                      leftIcon={<Text fontSize="sm">📥</Text>}
                    >下载文件</Button>
                  ) : (
                    <Text fontSize="xs" color="gray.300">无附件</Text>
                  )}
                  <HStack spacing={3} fontSize="xs" color="gray.400">
                    <Text>👁 {r.downloads || 0}</Text>
                  </HStack>
                </Flex>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  )
}

// 辅助：InputGroup 简化写法
function InputGroup({ children }: { children: React.ReactNode }) {
  return <Box position="relative">{children}</Box>
}
