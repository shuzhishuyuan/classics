import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Stack,
  Text,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react'
import {
  FiArrowUp,
  FiClock,
  FiMessageSquare,
  FiPlus,
  FiRefreshCw,
  FiServer,
  FiSettings,
  FiTrash2,
} from 'react-icons/fi'
import {
  AI_PROVIDERS,
  createDefaultAiConfig,
  getAiProviderPreset,
  type AiClientConfig,
  type AiMessage,
  type AiProviderId,
} from '../types/ai'
import { fetchAiProviders, sendAiChat } from '../api/ai'
import AIAssistantLogo from '../components/AIAssistantLogo'

const AI_CONFIG_KEY = 'shuyuan_ai_config'
const AI_CHAT_KEY = 'shuyuan_ai_messages'
const AI_HISTORY_KEY = 'shuyuan_ai_history'
const SYSTEM_PROMPT =
  '你是数智书院的国学学习助手。回答要简洁、准确、友好，优先结合中国古代书院、经典研读、会讲互动与文化教育场景。'

const promptHints = [
  '讲解《白鹿洞书院揭示》的核心意思',
  '比较岳麓书院和白鹿洞书院的不同',
  '把“先天下之忧而忧”讲给初中生听',
  '帮我设计一节书院文化主题班会',
]

type ChatSession = {
  id: string
  title: string
  messages: AiMessage[]
  createdAt: number
  updatedAt: number
}

function createSession(messages: AiMessage[] = []): ChatSession {
  const now = Date.now()
  const firstUserMessage = messages.find((message) => message.role === 'user')

  return {
    id: `chat-${now}-${Math.random().toString(36).slice(2, 8)}`,
    title: firstUserMessage?.content.slice(0, 28) || '新的对话',
    messages,
    createdAt: now,
    updatedAt: now,
  }
}

function loadConfig(): AiClientConfig {
  if (typeof window === 'undefined') return createDefaultAiConfig()

  try {
    const raw = window.localStorage.getItem(AI_CONFIG_KEY)
    if (!raw) return createDefaultAiConfig()

    const parsed = JSON.parse(raw) as Partial<AiClientConfig>
    const provider = (parsed.provider as AiProviderId) || 'deepseek'
    const preset = getAiProviderPreset(provider)

    return {
      provider,
      apiKey: parsed.apiKey || '',
      baseUrl: parsed.baseUrl || preset.baseUrl,
      model: parsed.model || preset.model,
    }
  } catch {
    return createDefaultAiConfig()
  }
}

function loadInitialSessions(): ChatSession[] {
  if (typeof window === 'undefined') return [createSession()]

  try {
    const history = window.localStorage.getItem(AI_HISTORY_KEY)
    if (history) {
      const parsed = JSON.parse(history) as ChatSession[]
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }

    const legacyMessages = window.localStorage.getItem(AI_CHAT_KEY)
    const messages = legacyMessages ? (JSON.parse(legacyMessages) as AiMessage[]) : []
    return [createSession(Array.isArray(messages) ? messages : [])]
  } catch {
    return [createSession()]
  }
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AIPage() {
  const toast = useToast()
  const [providers, setProviders] = useState(AI_PROVIDERS)
  const [config, setConfig] = useState<AiClientConfig>(() => loadConfig())
  const [sessions, setSessions] = useState<ChatSession[]>(() => loadInitialSessions())
  const [currentSessionId, setCurrentSessionId] = useState('')
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loadingProviders, setLoadingProviders] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setCurrentSessionId((previous) => previous || sessions[0]?.id || '')
  }, [sessions])

  const currentSession = useMemo(
    () => sessions.find((session) => session.id === currentSessionId) ?? sessions[0],
    [sessions, currentSessionId],
  )
  const messages = currentSession?.messages || []

  useEffect(() => {
    fetchAiProviders()
      .then((res) => {
        if (res.code === 200 && Array.isArray(res.data) && res.data.length > 0) {
          setProviders(res.data)
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProviders(false))
  }, [])

  useEffect(() => {
    window.localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(config))
  }, [config])

  useEffect(() => {
    window.localStorage.setItem(AI_HISTORY_KEY, JSON.stringify(sessions))
    window.localStorage.setItem(AI_CHAT_KEY, JSON.stringify(messages))
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [sessions, messages])

  const currentProvider = useMemo(
    () => providers.find((item) => item.id === config.provider) ?? providers[0],
    [providers, config.provider],
  )

  const updateCurrentMessages = (nextMessages: AiMessage[]) => {
    if (!currentSession) return

    setSessions((previous) =>
      previous.map((session) =>
        session.id === currentSession.id
          ? {
              ...session,
              title:
                session.title === '新的对话'
                  ? nextMessages.find((message) => message.role === 'user')?.content.slice(0, 28) ||
                    session.title
                  : session.title,
              messages: nextMessages,
              updatedAt: Date.now(),
            }
          : session,
      ),
    )
  }

  const handleProviderChange = (provider: AiProviderId) => {
    const preset = getAiProviderPreset(provider)
    setConfig((previous) => ({
      ...previous,
      provider,
      baseUrl: provider === 'custom' ? previous.baseUrl : preset.baseUrl,
      model: provider === 'custom' ? previous.model : preset.model,
    }))
  }

  const restoreDefaultConfig = () => {
    setConfig(createDefaultAiConfig(config.provider))
  }

  const createNewChat = () => {
    const session = createSession()
    setSessions((previous) => [session, ...previous])
    setCurrentSessionId(session.id)
    setInput('')
    setIsHistoryOpen(false)
  }

  const deleteSession = (sessionId: string) => {
    const remaining = sessions.filter((session) => session.id !== sessionId)
    const nextSessions = remaining.length > 0 ? remaining : [createSession()]
    setSessions(nextSessions)

    if (sessionId === currentSessionId) {
      setCurrentSessionId(nextSessions[0].id)
    }
  }

  const clearChat = () => {
    updateCurrentMessages([])
  }

  const send = async () => {
    const content = input.trim()
    if (!content || sending || !currentSession) return

    if (!config.apiKey.trim()) {
      toast({
        title: '请先填写 API Key',
        status: 'warning',
        duration: 2000,
        position: 'top',
      })
      setIsSettingsOpen(true)
      return
    }

    const nextMessages: AiMessage[] = [...messages, { role: 'user', content }]
    updateCurrentMessages(nextMessages)
    setInput('')
    setSending(true)

    try {
      const res = await sendAiChat({
        ...config,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...nextMessages.slice(-12)],
      })

      if (res.code === 200 && res.data?.content) {
        updateCurrentMessages([
          ...nextMessages,
          { role: 'assistant', content: res.data.content },
        ])
      } else {
        throw new Error(res.message || 'AI 返回失败')
      }
    } catch (error: any) {
      const message = error?.message || 'AI 请求失败'
      toast({
        title: message,
        status: 'error',
        duration: 2500,
        position: 'top',
      })
      updateCurrentMessages([
        ...nextMessages,
        { role: 'assistant', content: `抱歉，这次没有连接成功：${message}` },
      ])
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send()
    }
  }

  return (
    <Box maxW="1200px" mx="auto">
      <Flex justify="space-between" align="center" mb={6} gap={4} flexWrap="wrap">
        <HStack spacing={{ base: 3, md: 4 }} align="center">
          <AIAssistantLogo size={58} />
          <Box>
          <Text fontSize="2xl" fontWeight={800} fontFamily="heading" color="gray.800">
            书院智问
          </Text>
          <Text fontSize="sm" color="gray.500" mt={1}>
            Enter 发送，Shift + Enter 换行；对话会自动保存
          </Text>
          </Box>
        </HStack>
        <HStack spacing={2}>
          <Badge colorScheme="green" px={3} py={1}>
            {currentProvider?.label || 'DeepSeek'}
          </Badge>
          <Badge colorScheme="gray" px={3} py={1}>
            {config.model}
          </Badge>
        </HStack>
      </Flex>

      <Box
        bg="white"
        border="1px solid"
        borderColor="blackAlpha.100"
        borderRadius="xl"
        boxShadow="sm"
        minH={{ base: 'calc(100vh - 260px)', md: '700px' }}
        display="flex"
        flexDirection="column"
      >
        <Box px={{ base: 4, md: 5 }} py={4} borderBottom="1px solid" borderColor="blackAlpha.100">
          <HStack justify="space-between" align="center" flexWrap="wrap" gap={3}>
            <HStack spacing={2}>
              <FiServer />
              <Text fontWeight={700}>对话区</Text>
            </HStack>
            <HStack spacing={1}>
              <IconButton
                aria-label="新建对话"
                title="新建对话"
                size="sm"
                variant="ghost"
                icon={<FiPlus />}
                onClick={createNewChat}
              />
              <IconButton
                aria-label="历史对话"
                title="历史对话"
                size="sm"
                variant="ghost"
                icon={<FiClock />}
                onClick={() => setIsHistoryOpen(true)}
              />
              <IconButton
                aria-label="API 设置"
                title="API 设置"
                size="sm"
                variant="ghost"
                icon={<FiSettings />}
                onClick={() => setIsSettingsOpen(true)}
              />
              <Button size="sm" variant="ghost" leftIcon={<FiTrash2 />} onClick={clearChat}>
                清空
              </Button>
            </HStack>
          </HStack>
        </Box>

        <Box
          flex="1"
          px={{ base: 4, md: 5 }}
          py={4}
          overflowY="auto"
          bg="linear-gradient(180deg, #faf6f0 0%, #ffffff 18%)"
        >
          {messages.length === 0 ? (
            <VStack justify="center" align="center" h="100%" spacing={3} color="gray.400">
              <Text fontSize="4xl">💬</Text>
              <Text fontSize="md" fontWeight={600}>
                开始与 AI 助学对话
              </Text>
              <Text fontSize="sm">问经典、问书院、问课程设计都可以</Text>
            </VStack>
          ) : (
            <VStack align="stretch" spacing={4}>
              {messages.map((message, index) => (
                <Flex
                  key={`${message.role}-${index}`}
                  justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
                >
                  <Box
                    maxW="min(720px, 92%)"
                    px={4}
                    py={3}
                    borderRadius="lg"
                    bg={message.role === 'user' ? 'brand.primary' : 'gray.50'}
                    color={message.role === 'user' ? 'white' : 'gray.800'}
                    border="1px solid"
                    borderColor={message.role === 'user' ? 'brand.primary' : 'blackAlpha.100'}
                    whiteSpace="pre-wrap"
                    lineHeight="1.8"
                  >
                    {message.content}
                  </Box>
                </Flex>
              ))}
              <div ref={endRef} />
            </VStack>
          )}
        </Box>

        <Box px={{ base: 4, md: 5 }} py={4} borderTop="1px solid" borderColor="blackAlpha.100">
          <Stack spacing={3}>
            <HStack spacing={2} flexWrap="wrap">
              {promptHints.map((hint) => (
                <Button key={hint} size="sm" variant="ghost" onClick={() => setInput(hint)}>
                  {hint}
                </Button>
              ))}
            </HStack>

            <Box position="relative">
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="请输入您的问题，Enter 发送，Shift + Enter 换行"
                minH="120px"
                resize="vertical"
                pr="72px"
              />
              <IconButton
                aria-label="发送"
                icon={<FiArrowUp />}
                position="absolute"
                right={3}
                bottom={3}
                zIndex={2}
                colorScheme="green"
                borderRadius="full"
                onClick={send}
                isDisabled={!input.trim() || sending}
                isLoading={sending}
              />
            </Box>
          </Stack>
        </Box>
      </Box>

      <Modal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        isCentered
        size="lg"
        scrollBehavior="inside"
      >
        <ModalOverlay bg="blackAlpha.500" />
        <ModalContent>
          <ModalHeader>
            <HStack spacing={2}>
              <FiClock />
              <Text>历史对话</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="stretch" spacing={2}>
              {sessions
                .slice()
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .map((session) => (
                  <Flex
                    key={session.id}
                    align="center"
                    gap={3}
                    p={3}
                    border="1px solid"
                    borderColor={session.id === currentSessionId ? 'brand.primary' : 'blackAlpha.100'}
                    borderRadius="md"
                    bg={session.id === currentSessionId ? 'green.50' : 'white'}
                  >
                    <FiMessageSquare />
                    <Button
                      flex="1"
                      justifyContent="flex-start"
                      variant="ghost"
                      onClick={() => {
                        setCurrentSessionId(session.id)
                        setIsHistoryOpen(false)
                      }}
                    >
                      <Box textAlign="left">
                        <Text noOfLines={1}>{session.title}</Text>
                        <Text fontSize="xs" color="gray.500">
                          {session.messages.length} 条消息 · {formatDate(session.updatedAt)}
                        </Text>
                      </Box>
                    </Button>
                    <IconButton
                      aria-label="删除对话"
                      title="删除对话"
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      icon={<FiTrash2 />}
                      onClick={() => deleteSession(session.id)}
                    />
                  </Flex>
                ))}
            </VStack>
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <Button leftIcon={<FiPlus />} variant="outline" onClick={createNewChat}>
              新建对话
            </Button>
            <Button onClick={() => setIsHistoryOpen(false)}>关闭</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isCentered
        size="lg"
        scrollBehavior="inside"
      >
        <ModalOverlay bg="blackAlpha.500" />
        <ModalContent>
          <ModalHeader>
            <HStack spacing={2}>
              <FiSettings />
              <Text>API 接口设置</Text>
              {loadingProviders && <Spinner size="sm" color="brand.primary" />}
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack align="stretch" spacing={4}>
              <Text fontSize="sm" color="gray.500">
                可切换多种 OpenAI 兼容接口。配置仅保存在当前浏览器中。
              </Text>

              <Box>
                <Text fontSize="sm" fontWeight={600} mb={1}>
                  提供商
                </Text>
                <Select
                  value={config.provider}
                  onChange={(event) => handleProviderChange(event.target.value as AiProviderId)}
                >
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.label}
                    </option>
                  ))}
                </Select>
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight={600} mb={1}>
                  API Key
                </Text>
                <Input
                  type="password"
                  value={config.apiKey}
                  onChange={(event) =>
                    setConfig((previous) => ({ ...previous, apiKey: event.target.value }))
                  }
                  placeholder={currentProvider?.keyLabel || 'API Key'}
                />
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight={600} mb={1}>
                  Base URL
                </Text>
                <Input
                  value={config.baseUrl}
                  onChange={(event) =>
                    setConfig((previous) => ({ ...previous, baseUrl: event.target.value }))
                  }
                  placeholder="https://api.deepseek.com"
                />
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight={600} mb={1}>
                  模型
                </Text>
                <Input
                  value={config.model}
                  onChange={(event) =>
                    setConfig((previous) => ({ ...previous, model: event.target.value }))
                  }
                  placeholder="deepseek-chat"
                />
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <Button leftIcon={<FiRefreshCw />} variant="outline" onClick={restoreDefaultConfig}>
              恢复默认
            </Button>
            <Button colorScheme="green" onClick={() => setIsSettingsOpen(false)}>
              保存并关闭
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
