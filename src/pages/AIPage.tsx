import { Box, Text, VStack, Input, InputGroup, InputLeftElement, Flex } from '@chakra-ui/react'
import { SearchIcon } from '../components/Icons'

export default function AIPage() {
  return (
    <Box maxW="800px" mx="auto">
      {/* 标题 */}
      <Text fontSize="2xl" fontWeight={700} fontFamily="heading" color="gray.800" mb={2}>
        🤖 AI 智能助学
      </Text>
      <Text fontSize="sm" color="gray.500" mb={8}>
        我是您的书院文化学习助手，可以帮您：
        解读典籍原文、梳理历史背景、答疑解惑、推荐学习路径……
      </Text>

      {/* 聊天区占位 */}
      <Box
        w="100%"
        h="600px"
        bg="white"
        borderRadius="xl"
        border="1px solid"
        borderColor="blackAlpha.100"
        boxShadow="sm"
        mb={4}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={3}>
          <Text fontSize="5xl">💬</Text>
          <Text fontSize="md" color="gray.400" fontWeight={500}>
            开始与 AI 助学的对话
          </Text>
          <Text fontSize="sm" color="gray.300">
            您可以询问任何与书院文化、典籍相关的问题
          </Text>
        </VStack>
      </Box>

      {/* 底部输入框 */}
      <Flex gap={3} align="center">
        <InputGroup size="lg" flex={1}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="请输入您的问题..."
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="full"
            _focus={{ borderColor: 'brand.primary', boxShadow: '0 0 0 1px #2C5F2D' }}
            isDisabled
          />
        </InputGroup>
      </Flex>
      <Text fontSize="xs" color="gray.400" textAlign="center" mt={2}>
        🔜 即将接入智能体，敬请期待
      </Text>
    </Box>
  )
}
