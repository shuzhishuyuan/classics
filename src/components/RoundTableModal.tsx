import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
  Box, Text, Flex, Input, Button, VStack, HStack, Avatar, Divider, Tooltip,
} from '@chakra-ui/react'
import { useAuth } from '../hooks/useAuth'
import { post, get } from '../hooks/useApi'

const TABLES = 9
const SEATS_PER_TABLE = 6
const TOTAL_SEATS = TABLES * SEATS_PER_TABLE // 54

/** 八边形 clip-path */
const OCTAGON = 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'

/** 真实教室配色 */
const CLASSROOM = {
  wall: '#F5F0E6',
  floor: '#E3D5B8',
  podium: '#7A4E28',
  desk: '#C9A15B',
  deskBorder: '#B08A4A',
  seat: '#4E7A5A',
  seatHover: '#6B9A78',
  occupied: '#8B6F47',
}

/** 座位显示名：最多3字，超出显示前2字+省略号 */
function shortName(name: string): string {
  if (name.length <= 3) return name
  return name.slice(0, 2) + '…'
}

/** 座位 id 转为「X桌Y座」标签 */
function seatLabel(tableIndex: number, seatIndex: number): string {
  return `${tableIndex + 1}桌${seatIndex + 1}座`
}

interface ChatMessage {
  user: string
  seat: string
  text: string
  time: string
}

interface RoundTableModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RoundTableModal({ isOpen, onClose }: RoundTableModalProps) {
  const { user } = useAuth()
  const [entered, setEntered] = useState(false)
  const [nickname, setNickname] = useState('')
  const [onlineCount, setOnlineCount] = useState(0)
  const [seatOwner, setSeatOwner] = useState<Record<string, string>>({})
  const [mySeat, setMySeat] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { user: '山长', seat: '讲台', text: '诸位围坐，今日会讲从《白鹿洞书院揭示》的"为学之序"说起。', time: '开场' },
  ])
  const [input, setInput] = useState('')

  useEffect(() => {
    if (isOpen && !entered) setNickname(user?.name || '')
  }, [isOpen, entered, user])

  // 轮询在线人数
  useEffect(() => {
    if (!isOpen || !entered) return
    const poll = async () => {
      const res = await get<{ onlineCount: number }>('/chatroom/online?room=roundtable')
      if (res.code === 200) setOnlineCount(res.data.onlineCount)
    }
    poll()
    const timer = setInterval(poll, 3000)
    return () => clearInterval(timer)
  }, [isOpen, entered])

  const leave = useCallback(async () => {
    if (entered) await post('/chatroom/leave', { room: 'roundtable' }).catch(() => {})
  }, [entered])

  const handleClose = useCallback(() => {
    leave()
    setEntered(false)
    setMySeat(null)
    setSeatOwner({})
    onClose()
  }, [leave, onClose])

  useEffect(() => () => { leave() }, [leave])

  const enter = async () => {
    if (!nickname.trim()) return
    const res = await post<{ onlineCount: number }>('/chatroom/join', { name: nickname.trim(), room: 'roundtable' })
    if (res.code === 200) {
      setEntered(true)
      setOnlineCount(res.data.onlineCount)
    }
  }

  const selectSeat = (seatId: string) => {
    if (seatOwner[seatId]) return
    const next = { ...seatOwner }
    if (mySeat && next[mySeat] === nickname) delete next[mySeat]
    next[seatId] = nickname
    setSeatOwner(next)
    setMySeat(seatId)
  }

  const leaveSeat = () => {
    if (!mySeat) return
    const next = { ...seatOwner }
    delete next[mySeat]
    setSeatOwner(next)
    setMySeat(null)
  }

  const sendMessage = () => {
    const text = input.trim()
    if (!text) return
    const now = new Date()
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    let seat = '未入座'
    if (mySeat) {
      const [t, s] = mySeat.slice(3).split('-').map(Number)
      seat = seatLabel(t, s)
    }
    setMessages(prev => [...prev, { user: nickname, seat, text, time }])
    setInput('')
  }

  // 每桌座位坐标（围绕八边形桌）
  const seatPositions = useMemo(() => {
    const radius = 56
    const center = 75
    const positions: { x: number; y: number }[] = []
    for (let i = 0; i < SEATS_PER_TABLE; i++) {
      const angle = (Math.PI * 2 * i) / SEATS_PER_TABLE - Math.PI / 2
      positions.push({ x: center + radius * Math.cos(angle), y: center + radius * Math.sin(angle) })
    }
    return positions
  }, [])

  const tables = useMemo(() => Array.from({ length: TABLES }, (_, i) => i), [])

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="6xl" isCentered>
      <ModalOverlay />
      <ModalContent maxW="1100px" h="680px">
        <ModalHeader borderBottom="1px solid" borderColor="blackAlpha.100" fontFamily="heading">
          <Flex align="center" justify="center" gap={3}>
            <Text>圆桌会讲</Text>
            {entered && (
              <Text fontSize="sm" fontWeight={500} color="gray.500">
                <Text as="span" color="brand.primary" fontWeight={700}>🟢 {onlineCount}</Text> / {TOTAL_SEATS} 人在线
              </Text>
            )}
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0} overflow="hidden">
          {!entered ? (
            <Flex direction="column" align="center" justify="center" h="100%" p={10}>
              <Text fontSize="3xl" mb={2}>🪑</Text>
              <Text fontSize="lg" fontWeight={700} fontFamily="heading" color="gray.800" mb={1}>入席会讲</Text>
              <Text fontSize="sm" color="gray.500" mb={6}>给自己取个名字，就座后参与讨论（限 {TOTAL_SEATS} 席）</Text>
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
              {/* ===== 左侧：八边形圆桌座位区 ===== */}
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

                {/* 圆桌区（滚动） */}
                <Box flex={1} overflowY="auto" px={4} pb={4}>
                  <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" rowGap={8} columnGap={4}>
                    {tables.map(tableIndex => (
                      <Box key={tableIndex} textAlign="center">
                        <Text fontSize="xs" color="gray.500" mb={1}>第{tableIndex + 1}桌</Text>
                        <Box position="relative" w="150px" h="150px" mx="auto">
                          {/* 圆桌 */}
                          <Box
                            position="absolute"
                            left="47px"
                            top="47px"
                            w="56px"
                            h="56px"
                            borderRadius="full"
                            bg="linear-gradient(135deg, #97724F, #6B4F33)"
                            boxShadow="0 2px 8px rgba(0,0,0,0.2)"
                          />
                          {/* 八边形座位 */}
                          {Array.from({ length: SEATS_PER_TABLE }).map((_, seatIndex) => {
                            const seatId = `rt-${tableIndex}-${seatIndex}`
                            const pos = seatPositions[seatIndex]
                            const owner = seatOwner[seatId]
                            const isMine = mySeat === seatId
                            return (
                              <Tooltip key={seatId} label={owner || '空座'} hasArrow>
                                <Box
                                  position="absolute"
                                  left={`${pos.x - 15}px`}
                                  top={`${pos.y - 15}px`}
                                  w="30px"
                                  h="30px"
                                  clipPath={OCTAGON}
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  cursor={owner ? 'default' : 'pointer'}
                                  bg={owner ? (isMine ? 'brand.primary' : CLASSROOM.occupied) : CLASSROOM.seat}
                                  border={owner ? 'none' : '1px solid'}
                                  borderColor={CLASSROOM.deskBorder}
                                  color={owner ? 'white' : 'gray.300'}
                                  fontSize="10px"
                                  fontWeight={owner ? 700 : 500}
                                  transition="all 0.12s"
                                  _hover={owner ? {} : { bg: CLASSROOM.seatHover, color: 'white' }}
                                  onClick={() => !owner && selectSeat(seatId)}
                                >
                                  {owner ? shortName(owner) : ''}
                                </Box>
                              </Tooltip>
                            )
                          })}
                        </Box>
                      </Box>
                    ))}
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
