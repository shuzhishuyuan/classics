import { useState } from 'react'
import {
  Box, Text, VStack, HStack, Flex, Badge, Button, IconButton,
  Divider, SimpleGrid, useToast, Tooltip,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import type { ResourceItem } from '../types/resource'
import { teacherPrepData } from '../data/resourceMockData'

interface DocumentPreviewProps {
  resource: ResourceItem
}

/** 模拟文档页面内容 */
function getMockDocumentPages(resource: ResourceItem): { title: string; content: string }[] {
  const base = [
    {
      title: resource.title,
      content: `资源类型：${resource.subCategory || resource.type}\n适用学段：${Array.isArray(resource.stage) ? resource.stage.join('、') : resource.stage}\n适用学科：${resource.subject || '综合'}\n文件格式：${resource.format || 'PDF / DOCX'}\n更新时间：${resource.updatedAt || '2025年'}\n\n${resource.description}`,
    },
    {
      title: '一、教学目标',
      content: `1. 知识与能力目标\n   - 了解${resource.tags[0] || '书院文化'}的基本内容与历史背景\n   - 掌握核心概念并能运用于实际教学场景\n\n2. 过程与方法目标\n   - 通过案例研习、小组讨论等方式深化理解\n   - 培养学生自主探究与合作学习的能力\n\n3. 情感态度与价值观目标\n   - 感受中华优秀传统文化的深厚底蕴\n   - 增强文化自信与民族认同感`,
    },
    {
      title: '二、教学重难点',
      content: `【教学重点】\n• ${resource.tags[1] || '核心知识'}的理解与运用\n• 关键概念的辨析与迁移\n\n【教学难点】\n• 如何将传统文化内容与当代学生生活经验相连接\n• 跨学科融合教学的设计与实施`,
    },
    {
      title: '三、教学过程设计',
      content: `环节一：情境导入（5分钟）\n以${resource.tags[0] || '相关素材'}创设情境，激发学生学习兴趣，引出本课主题。\n\n环节二：新知探究（20分钟）\n通过问题链引导学生逐步深入，结合小组合作学习，突破重难点。\n\n环节三：巩固拓展（10分钟）\n设计分层练习与开放性问题，促进知识的迁移应用。\n\n环节四：总结提升（5分钟）\n师生共同回顾本课所学，提炼核心思想与方法。`,
    },
    {
      title: '四、教学评价方案',
      content: `1. 过程性评价（40%）\n   - 课堂参与度与小组合作表现\n   - 学习任务单完成质量\n\n2. 终结性评价（60%）\n   - 课后检测题（基础+提升）\n   - 拓展性学习成果（小论文/思维导图/创意作品）\n\n3. 评价量规\n   附详细评分标准，涵盖内容理解、思维品质、表达交流三个维度。`,
    },
    {
      title: '五、拓展资源与教学建议',
      content: `【推荐拓展资源】\n• 相关典籍原文及白话译本\n• 配套微课视频链接\n• 研学活动参考方案\n• 主题班会设计模板\n\n【教学实施建议】\n• 建议采用"翻转课堂"模式，课前布置预习任务\n• 鼓励跨学科协作教学（语文+历史+道德与法治）\n• 可根据学情灵活调整教学环节时长\n• 重视生成性教学资源，及时记录课堂亮点`,
    },
  ]
  return base
}

export default function DocumentPreview({ resource }: DocumentPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoomLevel, setZoomLevel] = useState(100)
  const toast = useToast()
  const navigate = useNavigate()

  const pages = getMockDocumentPages(resource)
  const totalPages = pages.length
  const isPDF = resource.format?.toUpperCase().includes('PDF')
  const isDOCX = resource.format?.toUpperCase().includes('DOCX')
  const fileIcon = isPDF ? '📕' : isDOCX ? '📘' : '📄'

  // 相关资源
  const relatedResources = teacherPrepData
    .filter((r) => r.id !== resource.id)
    .slice(0, 4)

  return (
    <HStack spacing={0} align="stretch" h="100%">
      {/* ========== 左侧：文档预览区 ========== */}
      <Box flex={1} maxW="860px">
        {/* 工具栏 */}
        <Flex
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="blackAlpha.100"
          px={5}
          py={3}
          mb={3}
          align="center"
          justify="space-between"
          boxShadow="sm"
        >
          <HStack spacing={3}>
            <Text fontSize="xl">{fileIcon}</Text>
            <VStack spacing={0} align="start">
              <Text fontSize="sm" fontWeight={600} color="gray.800" noOfLines={1} maxW="320px">
                {resource.title}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {resource.format} · {totalPages}页
              </Text>
            </VStack>
          </HStack>

          <HStack spacing={2}>
            {/* 缩放 */}
            <Tooltip label="缩小">
              <IconButton
                aria-label="缩小"
                icon={<Text>🔍−</Text>}
                size="sm"
                variant="ghost"
                onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
                isDisabled={zoomLevel <= 50}
              />
            </Tooltip>
            <Text fontSize="sm" color="gray.600" minW="48px" textAlign="center">
              {zoomLevel}%
            </Text>
            <Tooltip label="放大">
              <IconButton
                aria-label="放大"
                icon={<Text>🔍+</Text>}
                size="sm"
                variant="ghost"
                onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                isDisabled={zoomLevel >= 200}
              />
            </Tooltip>

            <Divider orientation="vertical" h="20px" borderColor="blackAlpha.200" />

            {/* 下载 */}
            <Button
              size="sm"
              colorScheme="green"
              bg="brand.primary"
              _hover={{ bg: 'brand.dark' }}
              borderRadius="full"
              leftIcon={<Text>📥</Text>}
              onClick={() => toast({ title: '文件下载已开始', status: 'success', duration: 2000, position: 'top' })}
            >
              下载文件
            </Button>
          </HStack>
        </Flex>

        {/* 文档页面 */}
        <Box
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="blackAlpha.100"
          boxShadow="md"
          minH="600px"
          p={10}
          transform={`scale(${zoomLevel / 100})`}
          transformOrigin="top center"
          transition="transform 0.2s"
        >
          {/* 模拟纸张纹理 */}
          <Box
            bg="linear-gradient(180deg, #fefefe 0%, #fafaf8 100%)"
            minH="500px"
          >
            {/* 页眉 */}
            <Flex justify="space-between" mb={8} pb={4} borderBottom="2px solid" borderColor="brand.primary">
              <VStack spacing={0} align="start">
                <Text fontSize="xs" color="brand.primary" fontWeight={600} fontFamily="heading">
                  书院文化教育平台 · {resource.subCategory || '教学资源'}
                </Text>
                <Text fontSize="xs" color="gray.400">内部教学参考资料</Text>
              </VStack>
              <Text fontSize="xs" color="gray.500" fontFamily="mono">
                {currentPage} / {totalPages}
              </Text>
            </Flex>

            {/* 正文 */}
            <Box fontFamily="heading">
              <Text
                fontSize="xl"
                fontWeight={700}
                color="gray.900"
                mb={1}
                textAlign="center"
                lineHeight="1.6"
              >
                {pages[currentPage - 1].title}
              </Text>
              {currentPage === 1 && (
                <Text fontSize="xs" color="gray.400" textAlign="center" mb={6}>
                  {resource.subject && `学科：${resource.subject}　|　`}
                  适用年级：{Array.isArray(resource.stage) ? resource.stage.join('、') : resource.stage}
                </Text>
              )}
              <Box mt={6}>
                {pages[currentPage - 1].content.split('\n').map((line, idx) => {
                  // 标题行
                  if (line.match(/^[一二三四五六七八九十]、/) || line.match(/^环节[一二三四]/)) {
                    return (
                      <Text key={idx} fontSize="md" fontWeight={700} color="brand.primary" mt={idx > 0 ? 5 : 0} mb={2}>
                        {line}
                      </Text>
                    )
                  }
                  // 子标题
                  if (line.match(/^【.+】/) || line.match(/^\d+\.\s/)) {
                    return (
                      <Text key={idx} fontSize="sm" fontWeight={600} color="gray.800" mt={idx > 0 ? 3 : 0} mb={1}>
                        {line}
                      </Text>
                    )
                  }
                  // 带缩进的子项
                  if (line.match(/^\s{2,}[•\-]/) || line.match(/^\s{3,}/)) {
                    return (
                      <Text key={idx} fontSize="sm" color="gray.600" ml={6} mb={0.5} lineHeight="1.8">
                        {line}
                      </Text>
                    )
                  }
                  // 普通段落
                  return (
                    <Text
                      key={idx}
                      fontSize="sm"
                      color="gray.700"
                      textIndent={line.length > 10 ? '2em' : undefined}
                      mb={1.5}
                      lineHeight="1.9"
                    >
                      {line}
                    </Text>
                  )
                })}
              </Box>
            </Box>

            {/* 页脚 */}
            <Flex justify="space-between" mt={12} pt={4} borderTop="1px solid" borderColor="blackAlpha.100">
              <Text fontSize="xs" color="gray.400">书院文化教育平台 · 教师备课资源</Text>
              <Text fontSize="xs" color="gray.400">更新于 {resource.updatedAt}</Text>
            </Flex>
          </Box>
        </Box>

        {/* 页面导航 */}
        <Flex justify="center" align="center" mt={4} gap={3}>
          <Button
            size="sm"
            variant="outline"
            borderRadius="full"
            isDisabled={currentPage <= 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ← 上一页
          </Button>
          <HStack spacing={1}>
            {pages.map((_, idx) => (
              <Box
                key={idx}
                w="32px"
                h="32px"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                bg={currentPage === idx + 1 ? 'brand.primary' : 'white'}
                color={currentPage === idx + 1 ? 'white' : 'gray.600'}
                border="1px solid"
                borderColor={currentPage === idx + 1 ? 'brand.primary' : 'blackAlpha.100'}
                fontSize="xs"
                fontWeight={currentPage === idx + 1 ? 700 : 400}
                onClick={() => setCurrentPage(idx + 1)}
                _hover={{ borderColor: 'brand.primary' }}
                transition="all 0.15s"
              >
                {idx + 1}
              </Box>
            ))}
          </HStack>
          <Button
            size="sm"
            variant="outline"
            borderRadius="full"
            isDisabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            下一页 →
          </Button>
        </Flex>
      </Box>

      {/* ========== 右侧：文档信息栏 ========== */}
      <Box
        w="300px"
        flexShrink={0}
        ml={6}
        display={{ base: 'none', lg: 'block' }}
      >
        {/* 文档信息卡片 */}
        <Box bg="white" borderRadius="xl" border="1px solid" borderColor="blackAlpha.100" p={5} mb={4}>
          <Text fontSize="md" fontWeight={700} fontFamily="heading" color="gray.800" mb={4}>
            文档信息
          </Text>
          <VStack spacing={3} align="stretch">
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.500">资源类型</Text>
              <Badge colorScheme="green" borderRadius="full" fontSize="xs">{resource.subCategory}</Badge>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.500">文件格式</Text>
              <Text fontSize="sm" fontWeight={600} color="gray.800">{resource.format}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.500">适用学科</Text>
              <Text fontSize="sm" fontWeight={600} color="gray.800">{resource.subject || '综合'}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.500">适用学段</Text>
              <Text fontSize="sm" fontWeight={600} color="gray.800">
                {Array.isArray(resource.stage) ? resource.stage.join('、') : resource.stage}
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.500">下载次数</Text>
              <Text fontSize="sm" fontWeight={600} color="brand.accent">📥 {resource.downloads?.toLocaleString()}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.500">更新时间</Text>
              <Text fontSize="sm" fontWeight={600} color="gray.800">{resource.updatedAt}</Text>
            </Flex>
          </VStack>

          <Divider my={4} borderColor="blackAlpha.100" />

          {/* 操作按钮 */}
          <VStack spacing={2} align="stretch">
            <Button
              colorScheme="green"
              bg="brand.primary"
              _hover={{ bg: 'brand.dark' }}
              borderRadius="full"
              size="sm"
              leftIcon={<Text>📥</Text>}
              onClick={() => toast({ title: '文件下载已开始', status: 'success', duration: 2000, position: 'top' })}
            >
              一键下载
            </Button>
            <Text fontSize="xs" color="gray.400" textAlign="center">
              下载后可二次改编使用
            </Text>
          </VStack>
        </Box>

        {/* 相关资源推荐 */}
        <Box bg="white" borderRadius="xl" border="1px solid" borderColor="blackAlpha.100" p={5}>
          <Text fontSize="md" fontWeight={700} fontFamily="heading" color="gray.800" mb={4}>
            相关备课资源
          </Text>
          <VStack spacing={3} align="stretch">
            {relatedResources.map((r) => (
              <HStack
                key={r.id}
                p={2}
                borderRadius="md"
                cursor="pointer"
                _hover={{ bg: 'gray.50' }}
                onClick={() => navigate(`/resources/${r.id}`)}
                spacing={3}
                transition="all 0.15s"
              >
                <Text fontSize="2xl" flexShrink={0}>{r.coverEmoji || '📄'}</Text>
                <Box flex={1} minW={0}>
                  <Text fontSize="sm" fontWeight={600} color="gray.800" noOfLines={1}>
                    {r.title}
                  </Text>
                  <Text fontSize="xs" color="gray.500">{r.format} · {r.subject}</Text>
                </Box>
              </HStack>
            ))}
          </VStack>
        </Box>
      </Box>
    </HStack>
  )
}
