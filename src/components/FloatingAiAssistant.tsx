import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Text,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { FiArrowUp, FiMessageCircle, FiMaximize2, FiTrash2, FiX } from 'react-icons/fi'
import AIAssistantLogo from './AIAssistantLogo'
import { sendAiChat } from '../api/ai'
import {
  createDefaultAiConfig,
  getAiProviderPreset,
  type AiClientConfig,
  type AiMessage,
} from '../types/ai'

const AI_CONFIG_KEY = 'shuyuan_ai_config'
const AI_CHAT_KEY = 'shuyuan_ai_messages'
const AI_FLOATING_POSITION_KEY = 'shuyuan_ai_floating_position'
const SYSTEM_PROMPT =
  '你是数智书院的国学学习助手。回答要简洁、准确、友好，优先结合中国古代书院、经典研读、会讲互动与文化教育场景。'

function loadConfig(): AiClientConfig {
  try {
    const raw = window.localStorage.getItem(AI_CONFIG_KEY)
    if (!raw) return createDefaultAiConfig()
    const parsed = JSON.parse(raw) as Partial<AiClientConfig>
    const provider = parsed.provider || 'deepseek'
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

function loadMessages(): AiMessage[] {
  try {
    const raw = window.localStorage.getItem(AI_CHAT_KEY)
    if (!raw) return []
    const messages = JSON.parse(raw) as AiMessage[]
    return Array.isArray(messages) ? messages.slice(-8) : []
  } catch {
    return []
  }
}

type FloatingPosition = {
  x: number
  y: number
}

const ORB_SIZE = 66

function clampPosition(position: FloatingPosition): FloatingPosition {
  return {
    x: Math.max(8, Math.min(position.x, window.innerWidth - ORB_SIZE - 8)),
    y: Math.max(8, Math.min(position.y, window.innerHeight - ORB_SIZE - 8)),
  }
}

function loadFloatingPosition(): FloatingPosition {
  try {
    const raw = window.localStorage.getItem(AI_FLOATING_POSITION_KEY)
    if (raw) return clampPosition(JSON.parse(raw) as FloatingPosition)
  } catch {
    // Use the default corner position when the stored value is unavailable.
  }

  return {
    x: Math.max(8, window.innerWidth - ORB_SIZE - 24),
    y: Math.max(8, window.innerHeight - ORB_SIZE - 28),
  }
}

export default function FloatingAiAssistant() {
  const location = useLocation()
  const navigate = useNavigate()
  const toast = useToast()
  const endRef = useRef<HTMLDivElement | null>(null)
  const orbRef = useRef<HTMLButtonElement | null>(null)
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [messages, setMessages] = useState<AiMessage[]>(loadMessages)
  const [orbPosition, setOrbPosition] = useState<FloatingPosition>(loadFloatingPosition)
  const dragRef = useRef<{
    active: boolean
    moved: boolean
    pointerId: number
    startX: number
    startY: number
    originX: number
    originY: number
  } | null>(null)

  const hidden =
    location.pathname === '/ai' ||
    location.pathname === '/immersive3d' ||
    location.pathname.startsWith('/academy-3d')

  useEffect(() => {
    window.localStorage.setItem(AI_CHAT_KEY, JSON.stringify(messages.slice(-12)))
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  useEffect(() => {
    const handleResize = () => setOrbPosition((position) => clampPosition(position))
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (hidden) return null

  const handleOrbPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: orbPosition.x,
      originY: orbPosition.y,
    }
  }

  const handleOrbPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    if (!drag?.active || drag.pointerId !== event.pointerId) return

    const nextPosition = clampPosition({
      x: drag.originX + event.clientX - drag.startX,
      y: drag.originY + event.clientY - drag.startY,
    })
    if (Math.abs(nextPosition.x - drag.originX) > 3 || Math.abs(nextPosition.y - drag.originY) > 3) {
      drag.moved = true
    }
    // Update the visual position immediately; React still owns the saved position.
    if (orbRef.current) {
      orbRef.current.style.left = `${nextPosition.x}px`
      orbRef.current.style.top = `${nextPosition.y}px`
    }
    setOrbPosition(nextPosition)
  }

  const handleOrbPointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    dragRef.current = null
    event.currentTarget.releasePointerCapture(event.pointerId)
    setOrbPosition((position) => {
      window.localStorage.setItem(AI_FLOATING_POSITION_KEY, JSON.stringify(position))
      return position
    })
    if (!drag.moved) setOpen((value) => !value)
  }

  const panelWidth = window.innerWidth < 480 ? window.innerWidth - 32 : 380
  const panelHeight = Math.min(560, window.innerHeight - 120)
  const panelLeft = Math.max(16, Math.min(orbPosition.x + ORB_SIZE - panelWidth, window.innerWidth - panelWidth - 16))
  const panelTop =
    orbPosition.y - panelHeight - 16 > 16
      ? orbPosition.y - panelHeight - 16
      : Math.min(window.innerHeight - panelHeight - 16, orbPosition.y + ORB_SIZE + 16)

  const send = async () => {
    const content = input.trim()
    if (!content || sending) return

    const config = loadConfig()
    if (!config.apiKey.trim()) {
      toast({
        title: '请先在书院智问中配置 API Key',
        description: '配置完成后即可在任意页面直接提问。',
        status: 'warning',
        duration: 2600,
        position: 'top',
      })
      navigate('/ai')
      return
    }

    const nextMessages: AiMessage[] = [...messages, { role: 'user', content }]
    setMessages(nextMessages)
    setInput('')
    setSending(true)

    try {
      const response = await sendAiChat({
        ...config,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...nextMessages.slice(-10)],
      })

      if (response.code !== 200 || !response.data?.content) {
        throw new Error(response.message || 'AI 暂时没有返回结果')
      }

      setMessages([...nextMessages, { role: 'assistant', content: response.data.content }])
    } catch (error: any) {
      toast({
        title: error?.message || 'AI 请求失败',
        status: 'error',
        duration: 2400,
        position: 'top',
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {open && (
        <Box
          position="fixed"
          left={`${panelLeft}px`}
          top={`${panelTop}px`}
          zIndex={1200}
          w={`${panelWidth}px`}
          h={`${panelHeight}px`}
          bg="white"
          border="1px solid"
          borderColor="rgba(44,95,45,0.16)"
          borderRadius="20px"
          boxShadow="0 24px 70px rgba(49, 54, 38, 0.24)"
          overflow="hidden"
        >
          <Flex
            align="center"
            justify="space-between"
            px={4}
            py={3}
            bg="linear-gradient(135deg, #f7f0e4 0%, #fffdf8 100%)"
            borderBottom="1px solid"
            borderColor="blackAlpha.100"
          >
            <HStack spacing={3}>
              <AIAssistantLogo size={42} />
              <Box>
                <Text fontWeight={800} fontFamily="heading" color="gray.800">
                  书院智问
                </Text>
                <Text fontSize="xs" color="gray.500">
                  随时问经典、问书院
                </Text>
              </Box>
            </HStack>
            <HStack spacing={0}>
              <IconButton
                aria-label="打开完整问答页"
                title="打开完整问答页"
                variant="ghost"
                size="sm"
                icon={<FiMaximize2 />}
                onClick={() => navigate('/ai')}
              />
              <IconButton
                aria-label="关闭书院智问"
                title="关闭"
                variant="ghost"
                size="sm"
                icon={<FiX />}
                onClick={() => setOpen(false)}
              />
            </HStack>
          </Flex>

          <VStack
            align="stretch"
            spacing={3}
            h="calc(100% - 65px)"
            p={4}
          >
            <Box flex="1" overflowY="auto" pr={1}>
              {messages.length === 0 ? (
                <VStack justify="center" h="100%" spacing={3} color="gray.400">
                  <FiMessageCircle size={30} />
                  <Text fontSize="sm">从一个问题开始吧</Text>
                  <Text fontSize="xs">例如：岳麓书院为什么有“千年学府”之称？</Text>
                </VStack>
              ) : (
                <VStack align="stretch" spacing={3}>
                  {messages.map((message, index) => (
                    <Flex
                      key={`${message.role}-${index}`}
                      justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
                    >
                      <Box
                        maxW="88%"
                        px={3}
                        py={2.5}
                        borderRadius="14px"
                        bg={message.role === 'user' ? 'brand.primary' : '#f5f7f4'}
                        color={message.role === 'user' ? 'white' : 'gray.800'}
                        whiteSpace="pre-wrap"
                        fontSize="sm"
                        lineHeight="1.7"
                      >
                        {message.content}
                      </Box>
                    </Flex>
                  ))}
                  <div ref={endRef} />
                </VStack>
              )}
            </Box>

            <HStack justify="space-between">
              <Text fontSize="xs" color="gray.400">
                {sending ? '正在思考…' : 'Enter 发送，Shift + Enter 换行'}
              </Text>
              <IconButton
                aria-label="清空对话"
                title="清空对话"
                variant="ghost"
                size="xs"
                icon={<FiTrash2 />}
                onClick={() => setMessages([])}
              />
            </HStack>

            <Box position="relative">
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    void send()
                  }
                }}
                placeholder="问问书院里的事…"
                minH="82px"
                resize="none"
                pr="52px"
                fontSize="sm"
              />
              <IconButton
                aria-label="发送问题"
                title="发送问题"
                icon={<FiArrowUp />}
                position="absolute"
                right={2}
                bottom={2}
                zIndex={2}
                size="sm"
                borderRadius="full"
                colorScheme="green"
                isLoading={sending}
                isDisabled={!input.trim()}
                onClick={() => void send()}
              />
            </Box>
            <Button
              size="sm"
              variant="ghost"
              color="brand.primary"
              onClick={() => navigate('/ai')}
            >
              进入完整书院智问
            </Button>
          </VStack>
        </Box>
      )}

      {!open && (
      <IconButton
        ref={orbRef}
        aria-label={open ? '关闭书院智问' : '打开书院智问'}
        title={open ? '关闭书院智问' : '打开书院智问'}
        position="fixed"
        left={`${orbPosition.x}px`}
        top={`${orbPosition.y}px`}
        zIndex={1201}
        w={`${ORB_SIZE}px`}
        h={`${ORB_SIZE}px`}
        borderRadius="full"
        bg="white"
        border="3px solid"
        borderColor="brand.accent"
        boxShadow="0 10px 28px rgba(44,95,45,0.24)"
        icon={open ? <FiX size={24} /> : <AIAssistantLogo size={48} />}
        onPointerDown={handleOrbPointerDown}
        onPointerMove={handleOrbPointerMove}
        onPointerUp={handleOrbPointerUp}
        onPointerCancel={handleOrbPointerUp}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setOpen((value) => !value)
          }
        }}
        userSelect="none"
        cursor="grab"
        sx={{ touchAction: 'none' }}
        _hover={{ transform: 'translateY(-3px)', boxShadow: '0 14px 32px rgba(44,95,45,0.3)' }}
        transition="box-shadow 0.2s, transform 0.2s"
      />
      )}
    </>
  )
}
