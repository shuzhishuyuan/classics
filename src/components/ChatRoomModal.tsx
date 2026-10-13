import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
  Box, Text, Flex, Input, Button, VStack, HStack, Avatar, Divider, Tooltip,
} from '@chakra-ui/react'
import { useAuth } from '../hooks/useAuth'
import { post, get } from '../hooks/useApi'

const TOTAL_SEATS = 120
const SEATS_PER_ROW = 8

/** 真实教室配色 */
const CLASSROOM = {
  wall: '#F5F0E6',      // 米白墙
  floor: '#E3D5B8',     // 木地板
  podium: '#7A4E28',    // 讲台深木棕
  desk: '#C9A15B',      // 课桌木黄
  seat: '#4E7A5A',      // 座椅墨绿
  seatHover: '#6B9A78', // 座椅浅绿（hover）
  occupied: '#8B6F47',  // 已占座（赭石）
}

/** 座位显示名：最多3字，超出显示前2字+省略号 */
function shortName(name: string): string {
  if (name.length <= 3) return name
  return name.slice(0, 2) + '…'
}

/** 座位 id 转为「排座」标签 */
function seatLabel(seatId: string): string {
  const index = parseInt(seatId.slice(5), 10)
  const row = Math.floor(index / SEATS_PER_ROW) + 1
  const col = (index % SEATS_PER_ROW) + 1
  return `${row}排${col}座`
}

interface ChatMessage {
  user: string
  seat: string
  text: string
  time: string
}

interface ChatRoomModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChatRoomModal({ isOpen, onClose }: ChatRoomModalProps) {
  const { user } = useAuth()
  const [entered, setEntered] = useState(false)
  const [nickname, setNickname] = useState('')
  const [onlineCount, setOnlineCount] = useState(0)
  const [seatOwner, setSeatOwner] = useState<Record<string, string>>({})
  const [mySeat, setMySeat] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { user: '山长', seat: '讲台', text: '诸位就座，今日我们共读《白鹿洞书院揭示》，可从“为学之序”谈起。', time: '开场' },
  ])
  const [input, setInput] = useState('')

  // 打开弹窗时初始化昵称
  useEffect(() => {
    if (isOpen && !entered) {
      setNickname(user?.name || '')
    }
  }, [isOpen, entered, user])

  // 进入后轮询在线人数
  useEffect(() => {
    if (!isOpen || !entered) return
    const poll = async () => {
      const res = await get<{ onlineCount: number }>('/chatroom/online?room=chat')
      if (res.code === 200) setOnlineCount(res.data.onlineCount)
    }
    poll()
    const timer = setInterval(poll, 3000)
    return () => clearInterval(timer)
  }, [isOpen, entered])

  // 组件卸载/关闭时离开
  const leave = useCallback(async () => {
    if (entered) {
      await post('/chatroom/leave', { room: 'chat' }).catch(() => {})
    }
  }, [entered])

  const handleClose = useCallback(() => {
    leave()
    setEntered(false)
    setMySeat(null)
    setSeatOwner({})
    onClose()
  }, [leave, onClose])

  useEffect(() => {
    return () => { leave() }
  }, [leave])

  /** 进入会讲 */
  const enter = async () => {
    if (!nickname.trim()) return
    const res = await post<{ onlineCount: number }>('/chatroom/join', { name: nickname.trim(), room: 'chat' })
    if (res.code === 200) {
      setEntered(true)
      setOnlineCount(res.data.onlineCount)
    }
  }

  /** 选座 */
  const selectSeat = (seatId: string) => {
    if (seatOwner[seatId]) return
    const next = { ...seatOwner }
    if (mySeat && next[mySeat] === nickname) delete next[mySeat]
    next[seatId] = nickname
    setSeatOwner(next)
    setMySeat(seatId)
  }

  /** 离开座位 */
  const leaveSeat = () => {
    if (!mySeat) return
    const next = { ...seatOwner }
    delete next[mySeat]
    setSeatOwner(next)
    setMySeat(null)
  }

  /** 发送消息 */
  const sendMessage = () => {
    const text = input.trim()
    if (!text) return
    const now = new Date()
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    const seat = mySeat ? seatLabel(mySeat) : '未入座'
    setMessages(prev => [...prev, { user: nickname, seat, text, time }])
    setInput('')
  }

  // 座位列表
  const seats = useMemo(() => Array.from({ length: TOTAL_SEATS }, (_, i) => `seat-${i}`), [])

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="6xl" isCentered>
      <ModalOverlay />
      <ModalContent maxW="1100px" h="680px">
        <ModalHeader borderBottom="1px solid" borderColor="blackAlpha.100" fontFamily="heading">
          <Flex align="center" justify="center" gap={3}>
            <Text>聊天室</Text>
            {entered && (
              <Text fontSize="sm" fontWeight={500} color="gray.500">
                <Text as="span" color="brand.primary" fontWeight={700}>🟢 {onlineCount}</Text> 人在线
              </Text>
            )}
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0} overflow="hidden">
          {/* ===== 未进入：取名 ===== */}
          {!entered ? (
            <Flex direction="column" align="center" justify="center" h="100%" p={10}>
              <Text fontSize="3xl" mb={2}>🪑</Text>
              <Text fontSize="lg" fontWeight={700} fontFamily="heading" color="gray.800" mb={1}>入席会讲</Text>
              <Text fontSize="sm" color="gray.500" mb={6}>给自己取个名字，就座后参与讨论</Text>
              <Input
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="请输入你的名字"
                maxW="320px"
                textAlign="center"
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="full"
                size="lg"
                onKeyDown={e => e.key === 'Enter' && enter()}
              />
              <Button mt={4} colorScheme="green" borderRadius="full" px={10} size="lg" isDisabled={!nickname.trim()} onClick={enter}>
                进入会讲
              </Button>
            </Flex>
          ) : (
            <Flex h="100%">
              {/* ===== 左侧：教室座位区 ===== */}
              <Box flex="1.25" bg={CLASSROOM.wall} borderRight="1px solid" borderColor="blackAlpha.100" overflow="hidden" display="flex" flexDirection="column">
                {/* 讲台 */}
                <Box
                  h="54px"
                  m={4}
                  mb={2}
                  bg="linear-gradient(135deg, #8B5A2B, #6B4020)"
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 2px 6px rgba(0,0,0,0.2)"
                  flexShrink={0}
                >
                  <HStack spacing={3}>
                    <Text fontSize="lg">🎓</Text>
                    <Text color="white" fontWeight={700} fontFamily="heading" letterSpacing={6}>讲 台</Text>
                    <Text color="whiteAlpha.700" fontSize="xs">· 山长</Text>
                  </HStack>
                </Box>

                {/* 座位网格（滚动） */}
                <Box flex={1} overflowY="auto" px={4} pb={4}>
                  <Box
                    display="grid"
                    gridTemplateColumns={`repeat(${SEATS_PER_ROW}, 1fr)`}
                    gap={1.5}
                  >
                    {seats.map(seatId => {
                      const owner = seatOwner[seatId]
                      const isMine = mySeat === seatId
                      return (
                        <Tooltip key={seatId} label={owner || '空座'} hasArrow>
                          <Box
                            h="38px"
                            borderRadius="md"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            cursor={owner ? 'default' : 'pointer'}
                            bg={owner ? (isMine ? 'brand.primary' : CLASSROOM.occupied) : CLASSROOM.desk}
                            border={owner ? 'none' : '1px solid'}
                            borderColor="#B08A4A"
                            color={owner ? 'white' : 'gray.500'}
                            fontSize="xs"
                            fontWeight={owner ? 700 : 500}
                            transition="all 0.12s"
                            _hover={owner ? {} : { bg: CLASSROOM.seatHover, color: 'white', borderColor: CLASSROOM.seatHover }}
                            onClick={() => !owner && selectSeat(seatId)}
                          >
                            {owner ? shortName(owner) : (parseInt(seatId.slice(5)) + 1)}
                          </Box>
                        </Tooltip>
                      )
                    })}
                  </Box>
                </Box>

                {/* 底部状态 */}
                <Flex justify="space-between" align="center" px={4} py={2} borderTop="1px solid" borderColor="blackAlpha.100" bg="white" flexShrink={0}>
                  <Text fontSize="xs" color="gray.500">共 {TOTAL_SEATS} 席 · 点座位入座</Text>
                  {mySeat ? (
                    <HStack spacing={2}>
                      <Text fontSize="xs" color="brand.primary">已就座：{nickname}</Text>
                      <Button size="xs" variant="outline" colorScheme="gray" borderRadius="full" onClick={leaveSeat}>离开座位</Button>
                    </HStack>
                  ) : (
                    <Text fontSize="xs" color="gray.400">尚未入座</Text>
                  )}
                </Flex>
              </Box>

              {/* ===== 右侧：聊天区 ===== */}
              <Flex flex="1" direction="column" bg="white">
                <VStack flex={1} spacing={3} align="stretch" p={4} overflowY="auto">
                  {messages.map((msg, i) => (
                    <Flex key={i} gap={3} align="flex-start">
                      <Avatar size="sm" bg={msg.user === '山长' ? 'brand.primary' : 'brand.secondary'} name={msg.user} />
                      <Box flex={1}>
                        <HStack spacing={2}>
                          <Text fontSize="sm" fontWeight={700} color="gray.800">{msg.user}</Text>
                          <Text fontSize="xs" color="brand.secondary" fontWeight={600}>{msg.seat}</Text>
                          <Text fontSize="xs" color="gray.400">{msg.time}</Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.700" lineHeight="1.6" mt={0.5}>{msg.text}</Text>
                      </Box>
                    </Flex>
                  ))}
                </VStack>

                <Divider borderColor="blackAlpha.100" />
                <HStack p={3} gap={2}>
                  <Input
                    placeholder={mySeat ? '就座后畅所欲言…' : '请先入座再发言'}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="full"
                    fontSize="sm"
                    isDisabled={!mySeat}
                    _focus={{ bg: 'white', borderColor: 'brand.primary' }}
                  />
                  <Button colorScheme="green" borderRadius="full" size="md" onClick={sendMessage} isDisabled={!mySeat || !input.trim()}>
                    发送
                  </Button>
                </HStack>
              </Flex>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
