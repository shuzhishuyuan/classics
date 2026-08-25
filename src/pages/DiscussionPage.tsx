import { useState, useEffect } from 'react'
import {
  Badge,
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  VStack,
  useDisclosure,
  useToast,
  chakra,
  shouldForwardProp,
} from '@chakra-ui/react'
import { isValidMotionProp, motion } from 'framer-motion'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaCommentDots,
  FaHeart,
  FaPaperPlane,
  FaQuoteLeft,
  FaRegHeart,
  FaVoteYea,
} from 'react-icons/fa'
import {
  classicSeminars,
  creationTracks,
  creationWorks,
  debateTopics,
  ritualTasks,
  type CreationTrack,
  type CreationWork,
  type RitualTask,
} from '../data/discussion'
import { useDiscussionStore } from '../stores/discussionStore'
import { useAuth } from '../hooks/useAuth'
import { seedDiscussions } from '../data/discussion'
import type { DiscussionReply } from '../types'

const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
})

const sectionVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
}

const sectionMotion = {
  transition: { duration: 0.35, ease: 'easeOut' },
}

const pageMotion = {
  transition: { duration: 0.32 },
}

const viewSchema = z.object({
  title: z.string().min(4, '标题至少 4 个字'),
  author: z.string().min(2, '请填写展示署名'),
  topicId: z.string().optional(),
  track: z.string().optional(),
  content: z.string().min(12, '观点内容至少 12 个字'),
})

type ViewFormValues = z.infer<typeof viewSchema>

// ===== 评论区组件 =====

/** 相对时间格式化 */
function relativeTime(ts: number): string {
  const diff = Date.now() - ts
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes} 分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} 小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} 天前`
  const months = Math.floor(days / 30)
  return `${months} 个月前`
}

/** 单条评论 */
function CommentItem({ reply, isOwn }: { reply: DiscussionReply; isOwn: boolean }) {
  const roleColorMap: Record<string, string> = { '学生': 'green', '教师': 'orange', '家长': 'purple' }

  return (
    <Box
      bg={isOwn ? 'green.50' : 'white'}
      border="1px solid"
      borderColor={isOwn ? 'green.100' : 'blackAlpha.100'}
      borderRadius="md"
      p={4}
    >
      <HStack spacing={3} align="flex-start">
        <Box
          w="36px"
          h="36px"
          borderRadius="full"
          bg="brand.bg"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="lg"
          flexShrink={0}
        >
          {reply.userAvatar || '👤'}
        </Box>
        <Box flex="1">
          <HStack spacing={2} mb={1}>
            <Text fontWeight={700} fontSize="sm">
              {reply.userName || '匿名用户'}
            </Text>
            {reply.userRole && (
              <Badge size="sm" colorScheme={roleColorMap[reply.userRole] || 'gray'} variant="subtle">
                {reply.userRole}
              </Badge>
            )}
            {isOwn && (
              <Badge size="sm" colorScheme="green" variant="outline">
                我
              </Badge>
            )}
          </HStack>
          <Text mt={1} color="gray.700" lineHeight="1.8" fontSize="sm">
            {reply.content}
          </Text>
          <Text mt={2} fontSize="xs" color="gray.400">
            {relativeTime(reply.createdAt)}
          </Text>
        </Box>
      </HStack>
    </Box>
  )
}

/** 评论输入表单 */
function CommentForm({
  sectionId,
  user,
}: {
  sectionId: string
  user: { id: string; name: string; role: string; avatar: string }
}) {
  const addComment = useDiscussionStore((s) => s.addComment)
  const toast = useToast()
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = () => {
    const trimmed = content.trim()
    if (!trimmed) return

    setSubmitting(true)
    const reply: DiscussionReply = {
      id: `reply-${Date.now()}`,
      userId: user.id,
      content: trimmed,
      createdAt: Date.now(),
      userName: user.name,
      userAvatar: user.avatar,
      userRole: user.role as DiscussionReply['userRole'],
    }

    addComment(sectionId, reply)
    setContent('')
    setSubmitting(false)

    toast({
      title: '评论已发送',
      status: 'success',
      duration: 2000,
    })
  }

  return (
    <Box bg="white" border="1px solid" borderColor="blackAlpha.100" borderRadius="md" p={4}>
      <HStack spacing={2} mb={3}>
        <Text fontSize="sm" color="gray.500">
          以
        </Text>
        <Box
          w="22px"
          h="22px"
          borderRadius="full"
          bg="brand.bg"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          fontSize="xs"
        >
          {user.avatar}
        </Box>
        <Text fontSize="sm" fontWeight={600} color="gray.700">
          {user.name}
        </Text>
        <Text fontSize="sm" color="gray.500">
          的身份发言
        </Text>
      </HStack>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="写下你的想法…"
        rows={3}
        resize="vertical"
        maxLength={2000}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleSubmit()
          }
        }}
      />
      <HStack justify="space-between" mt={3}>
        <Text fontSize="xs" color="gray.400">
          {content.length}/2000 · Ctrl+Enter 发送
        </Text>
        <Button
          size="sm"
          leftIcon={<FaPaperPlane />}
          colorScheme="green"
          onClick={handleSubmit}
          isLoading={submitting}
          isDisabled={!content.trim()}
        >
          发送
        </Button>
      </HStack>
    </Box>
  )
}

/** 评论区容器（折叠/展开） */
function CommentSection({ sectionId }: { sectionId: string }) {
  const { user, isLoggedIn } = useAuth()
  const discussion = useDiscussionStore((s) => s.discussions[sectionId])
  const [expanded, setExpanded] = useState(false)

  const replies = discussion?.replies ?? []
  const replyCount = replies.length

  return (
    <Box>
      <Button
        variant="ghost"
        w="full"
        justifyContent="space-between"
        leftIcon={<FaCommentDots />}
        rightIcon={expanded ? <FaChevronUp /> : <FaChevronDown />}
        onClick={() => setExpanded((v) => !v)}
        _hover={{ bg: 'green.50' }}
        size="sm"
      >
        {expanded ? '收起讨论' : `查看讨论${replyCount > 0 ? ` (${replyCount} 条回复)` : ''}`}
      </Button>

      {expanded && (
        <VStack spacing={3} align="stretch" mt={3}>
          {replyCount > 0 && (
            <VStack spacing={3} align="stretch">
              {replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  reply={reply}
                  isOwn={user?.id === reply.userId}
                />
              ))}
            </VStack>
          )}

          {isLoggedIn && user ? (
            <CommentForm sectionId={sectionId} user={user} />
          ) : (
            <Box bg="brand.bg" borderRadius="md" p={4} textAlign="center">
              <Text color="gray.500" fontSize="sm">
                登录后即可参与讨论
              </Text>
            </Box>
          )}
        </VStack>
      )}
    </Box>
  )
}

// ===== 页面组件 =====

function SectionShell({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <MotionBox
      id={id}
      scrollMarginTop="96px"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      {...(sectionMotion as any)}
    >
      <Box mb={5}>
        <Text as="h2" fontSize={{ base: 'xl', md: '2xl' }} fontWeight={800} fontFamily="heading" color="gray.800">
          {title}
        </Text>
        <Text mt={2} color="gray.600" lineHeight="1.8" maxW="860px">
          {description}
        </Text>
      </Box>
      {children}
    </MotionBox>
  )
}

function SeminarSection() {
  const votes = useDiscussionStore((state) => state.votes)
  const setVote = useDiscussionStore((state) => state.setVote)

  return (
    <SectionShell
      id="classic-seminar"
      title="经典会讲"
      description="从历史上的会讲与论辩出发，阅读相关背景，选择你更认同的学习方式，并说明理由。"
    >
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={5}>
        {classicSeminars.map((seminar) => {
          const selectedCamp = votes[seminar.id]

          return (
            <Box
              key={seminar.id}
              bg="white"
              border="1px solid"
              borderColor="blackAlpha.100"
              borderRadius="lg"
              p={5}
              display="flex"
              flexDirection="column"
              h="100%"
            >
              <Text fontSize="lg" fontWeight={800} fontFamily="heading">
                {seminar.title}
              </Text>

              <Text mt={4} color="gray.600" lineHeight="1.8">
                {seminar.background}
              </Text>

              <Box mt={4} bg="brand.bg" borderRadius="md" p={4}>
                <HStack align="flex-start" gap={3}>
                  <Icon as={FaQuoteLeft} color="brand.secondary" mt={1} />
                  <Text fontSize="sm" color="gray.700" lineHeight="1.7" fontWeight={600}>
                    {seminar.question}
                  </Text>
                </HStack>
              </Box>

              <Stack mt={5} spacing={3}>
                {seminar.camps.map((camp) => {
                  const isSelected = selectedCamp === camp.id

                  return (
                    <Box
                      key={camp.id}
                      border="1px solid"
                      borderColor={isSelected ? 'brand.primary' : 'blackAlpha.100'}
                      bg={isSelected ? 'green.50' : 'white'}
                      borderRadius="md"
                      p={4}
                    >
                      <HStack justify="space-between" align="center" gap={4}>
                        <Text fontWeight={700}>{camp.name}</Text>
                        <Button
                          size="sm"
                          leftIcon={<FaVoteYea />}
                          colorScheme={isSelected ? 'green' : undefined}
                          variant={isSelected ? 'solid' : 'outline'}
                          onClick={() => setVote(seminar.id, camp.id)}
                        >
                          {isSelected ? '已选择' : '投票'}
                        </Button>
                      </HStack>
                    </Box>
                  )
                })}
              </Stack>

              <Box mt="auto" pt={5}>
                <Divider mb={5} />
                <Text fontWeight={700} color="brand.primary" mb={2}>
                  讨论提示
                </Text>
                <VStack align="stretch" spacing={2}>
                  {seminar.hints.map((hint) => (
                    <Box key={hint} bg="gray.50" borderRadius="md" p={3}>
                      <Text fontSize="sm" color="gray.700" lineHeight="1.7">
                        {hint}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              </Box>
            </Box>
          )
        })}
      </SimpleGrid>

      <Divider my={6} />
      <CommentSection sectionId="classic-seminar" />
    </SectionShell>
  )
}

function DebateSection({ onOpenSubmit }: { onOpenSubmit: (topicId: string) => void }) {
  return (
    <SectionShell
      id="debate-lab"
      title="思辨论辩"
      description="围绕真实问题选择立场、陈述理由，并回应不同意见，完成一次讨论。"
    >
      <Stack spacing={5}>
        {debateTopics.map((topic) => (
          <Box key={topic.id} bg="white" border="1px solid" borderColor="blackAlpha.100" borderRadius="lg" p={5}>
            <Badge colorScheme="orange">{topic.schoolLevel}</Badge>
            <Text mt={3} fontSize="lg" fontWeight={800} fontFamily="heading">
              {topic.title}
            </Text>

            <Box mt={4}>
              <Text fontWeight={700} color="gray.700" fontSize="sm" mb={1}>
                情境说明
              </Text>
              <Text color="gray.600" lineHeight="1.8">
                {topic.context}
              </Text>
            </Box>

            <Box mt={4}>
              <Text fontWeight={700} color="gray.700" fontSize="sm" mb={1}>
                任务
              </Text>
              <Text color="gray.600" lineHeight="1.8">
                {topic.task}
              </Text>
            </Box>

            <Box mt={4}>
              <Text fontWeight={700} color="gray.700" fontSize="sm" mb={2}>
                可参考的材料方向
              </Text>
              <VStack align="stretch" spacing={2}>
                {topic.materials.map((item) => (
                  <HStack key={item} align="flex-start" gap={2}>
                    <Icon as={FaCheck} color="brand.primary" mt={1} />
                    <Text fontSize="sm" color="gray.600">
                      {item}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Box>

            <HStack mt={5} spacing={3} flexWrap="wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={() => document.getElementById('classic-seminar')?.scrollIntoView({ behavior: 'smooth' })}
              >
                阅读材料
              </Button>
              <Button size="sm" leftIcon={<FaPaperPlane />} colorScheme="green" onClick={() => onOpenSubmit(topic.id)}>
                写下观点
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => document.getElementById('debate-lab-discussion')?.scrollIntoView({ behavior: 'smooth' })}
              >
                查看讨论
              </Button>
            </HStack>
          </Box>
        ))}
      </Stack>

      <Divider my={6} />
      <Box id="debate-lab-discussion">
        <CommentSection sectionId="debate-lab" />
      </Box>
    </SectionShell>
  )
}

function RitualCard({ task }: { task: RitualTask }) {
  const isChecked = !!useDiscussionStore((state) => state.checkedRituals[task.id])
  const toggleRitual = useDiscussionStore((state) => state.toggleRitual)
  const note = useDiscussionStore((state) => state.ritualNotes[task.id]) ?? ''
  const setRitualNote = useDiscussionStore((state) => state.setRitualNote)
  const [writing, setWriting] = useState(false)

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="blackAlpha.100"
      borderRadius="lg"
      p={5}
      display="flex"
      flexDirection="column"
      h="100%"
    >
      <HStack justify="space-between" align="flex-start">
        <Text fontSize="lg" fontWeight={800} fontFamily="heading">
          {task.title}
        </Text>
        <Badge colorScheme={isChecked ? 'green' : 'gray'}>{isChecked ? '已完成' : '未完成'}</Badge>
      </HStack>
      <Text mt={4} fontSize="sm" color="gray.600" lineHeight="1.8">
        {task.description}
      </Text>

      <HStack mt="auto" pt={5} spacing={3}>
        <Button
          size="sm"
          flex="1"
          variant={isChecked ? 'solid' : 'outline'}
          colorScheme={isChecked ? 'green' : undefined}
          leftIcon={<FaCheck />}
          onClick={() => toggleRitual(task.id)}
        >
          {isChecked ? '已完成' : '我已完成'}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setWriting((v) => !v)}>
          {writing ? '收起' : '写下记录'}
        </Button>
      </HStack>

      {writing && (
        <Textarea
          mt={3}
          value={note}
          onChange={(e) => setRitualNote(task.id, e.target.value)}
          placeholder="写下你的记录…"
          rows={4}
          resize="vertical"
        />
      )}
    </Box>
  )
}

function RitualSection() {
  return (
    <SectionShell
      id="ritual-practice"
      title="礼仪习养"
      description="把会讲的过程拆成准备、倾听、整理三个可以马上行动的小任务。"
    >
      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={5}>
        {ritualTasks.map((task) => (
          <RitualCard key={task.id} task={task} />
        ))}
      </SimpleGrid>

      <Divider my={6} />
      <CommentSection sectionId="ritual-practice" />
    </SectionShell>
  )
}

function CreationSection({ onOpenSubmit }: { onOpenSubmit: (track: CreationTrack) => void }) {
  const likedWorks = useDiscussionStore((state) => state.likedWorks)
  const toggleWorkLike = useDiscussionStore((state) => state.toggleWorkLike)
  const submissions = useDiscussionStore((state) => state.submissions)
  const toast = useToast()
  const [viewingWork, setViewingWork] = useState<CreationWork | null>(null)

  const submittedWorks = submissions.filter((item) => item.track)

  const notifyCoEdit = () =>
    toast({ title: '共同编辑功能即将开放', status: 'info', duration: 2000 })

  return (
    <SectionShell
      id="co-creation"
      title="师生共创"
      description="把对经典的理解做成作品，和同学、老师一起分享、回应与完善。"
    >
      <HStack spacing={3} mb={5} flexWrap="wrap">
        <Button leftIcon={<FaPaperPlane />} colorScheme="green" onClick={() => onOpenSubmit('经典解读')}>
          发布作品
        </Button>
        <Button variant="outline" onClick={notifyCoEdit}>
          发起共同编辑
        </Button>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={5}>
        {creationWorks.map((work) => {
          const liked = !!likedWorks[work.id]
          return (
            <Box
              key={work.id}
              bg="white"
              border="1px solid"
              borderColor="blackAlpha.100"
              borderRadius="lg"
              p={5}
              display="flex"
              flexDirection="column"
              h="100%"
            >
              <Badge colorScheme="purple">{work.track}</Badge>
              <Text mt={4} fontWeight={800} fontFamily="heading">
                {work.title}
              </Text>
              <Text mt={1} fontSize="sm" color="gray.500">
                {work.author}
              </Text>
              <Text mt={3} fontSize="sm" color="gray.600" lineHeight="1.8" noOfLines={3}>
                {work.excerpt}
              </Text>
              <HStack mt="auto" pt={4} spacing={2} flexWrap="wrap">
                <Button size="xs" variant="outline" onClick={() => setViewingWork(work)}>
                  查看作品
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  leftIcon={liked ? <FaHeart /> : <FaRegHeart />}
                  color={liked ? 'red.500' : undefined}
                  onClick={() => toggleWorkLike(work.id)}
                >
                  {liked ? '已收藏' : '收藏'}
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => document.getElementById('co-creation-discussion')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  回应
                </Button>
                <Button size="xs" variant="ghost" onClick={notifyCoEdit}>
                  共同编辑
                </Button>
              </HStack>
            </Box>
          )
        })}
      </SimpleGrid>

      {submittedWorks.length > 0 && (
        <Box mt={6} bg="white" border="1px solid" borderColor="blackAlpha.100" borderRadius="lg" p={5}>
          <Text fontWeight={800} fontFamily="heading" mb={3}>
            我的投稿
          </Text>
          <VStack align="stretch" spacing={3}>
            {submittedWorks.map((work) => (
              <Box key={work.id} bg="gray.50" borderRadius="md" p={3}>
                <HStack justify="space-between" align="flex-start" gap={4}>
                  <Box>
                    <Text fontWeight={700}>{work.title}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {work.author} · {work.track}
                    </Text>
                  </Box>
                  <Badge>待审核</Badge>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
      )}

      <Divider my={6} />
      <Box id="co-creation-discussion">
        <CommentSection sectionId="co-creation" />
      </Box>

      <Modal isOpen={!!viewingWork} onClose={() => setViewingWork(null)} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{viewingWork?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Badge colorScheme="purple" mb={2}>
              {viewingWork?.track}
            </Badge>
            <Text fontSize="sm" color="gray.500" mb={3}>
              {viewingWork?.author}
            </Text>
            <Text color="gray.700" lineHeight="1.8">
              {viewingWork?.excerpt}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setViewingWork(null)}>
              关闭
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </SectionShell>
  )
}

function SubmissionModal({
  isOpen,
  onClose,
  defaultTopicId,
  defaultTrack,
}: {
  isOpen: boolean
  onClose: () => void
  defaultTopicId?: string
  defaultTrack?: CreationTrack
}) {
  const toast = useToast()
  const addSubmission = useDiscussionStore((state) => state.addSubmission)
  const [formError, setFormError] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ViewFormValues>({
    defaultValues: {
      title: '',
      author: '',
      topicId: defaultTopicId,
      track: defaultTrack,
      content: '',
    },
  })

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>请写下你的观点、理由和可以引用的材料。</p>',
    editorProps: {
      attributes: {
        class: 'discussion-editor',
      },
    },
  })

  const submit = (values: ViewFormValues) => {
    const content = editor?.getText().trim() || values.content
    const parsed = viewSchema.safeParse({
      ...values,
      topicId: defaultTopicId || values.topicId,
      track: defaultTrack || values.track,
      content,
    })

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message || '请完善投稿内容')
      return
    }

    addSubmission(parsed.data)
    toast({
      title: '作品已提交',
      description: '等待展示。',
      status: 'success',
      duration: 2600,
    })
    setFormError('')
    reset()
    editor?.commands.setContent('<p>请写下你的观点、理由和可以引用的材料。</p>')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>提交观点 / 共创作品</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl isInvalid={!!errors.title}>
              <FormLabel>标题</FormLabel>
              <Input placeholder="例如：我对义利之辨的理解" {...register('title', { required: '请填写标题' })} />
              <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.author}>
              <FormLabel>署名</FormLabel>
              <Input placeholder="例如：初二学生 李同学" {...register('author', { required: '请填写署名' })} />
              <FormErrorMessage>{errors.author?.message}</FormErrorMessage>
            </FormControl>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <FormLabel>关联议题</FormLabel>
                <Select placeholder="可选" defaultValue={defaultTopicId} {...register('topicId')}>
                  {debateTopics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.title}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>共创赛道</FormLabel>
                <Select placeholder="可选" defaultValue={defaultTrack} {...register('track')}>
                  {creationTracks.map(({ track }) => (
                    <option key={track} value={track}>
                      {track}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>
            <FormControl isInvalid={!!formError}>
              <FormLabel>正文</FormLabel>
              <Box
                border="1px solid"
                borderColor={formError ? 'red.300' : 'gray.200'}
                borderRadius="md"
                bg="white"
                p={3}
                minH="170px"
                sx={{
                  '.discussion-editor': {
                    minHeight: '140px',
                    outline: 'none',
                    lineHeight: 1.8,
                  },
                  '.discussion-editor p': {
                    margin: 0,
                  },
                }}
              >
                <EditorContent editor={editor} />
              </Box>
              <Textarea display="none" {...register('content')} />
              <FormErrorMessage>{formError}</FormErrorMessage>
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            取消
          </Button>
          <Button leftIcon={<FaPaperPlane />} colorScheme="green" onClick={handleSubmit(submit)}>
            提交
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default function DiscussionPage() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedTopicId, setSelectedTopicId] = useState<string | undefined>()
  const [selectedTrack, setSelectedTrack] = useState<CreationTrack | undefined>()
  const discussions = useDiscussionStore((state) => state.discussions)
  const initDiscussions = useDiscussionStore((state) => state.initDiscussions)

  // 首次加载时初始化种子讨论数据
  useEffect(() => {
    if (Object.keys(discussions).length === 0) {
      initDiscussions(seedDiscussions)
    }
  }, [discussions, initDiscussions])

  const openTopicSubmit = (topicId: string) => {
    setSelectedTopicId(topicId)
    setSelectedTrack(undefined)
    onOpen()
  }

  const openTrackSubmit = (track: CreationTrack) => {
    setSelectedTopicId(undefined)
    setSelectedTrack(track)
    onOpen()
  }

  return (
    <MotionBox initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} {...(pageMotion as any)}>
      <Box maxW="1400px" mx="auto">
        <Box
          bg="white"
          border="1px solid"
          borderColor="blackAlpha.100"
          borderRadius="lg"
          p={{ base: 5, md: 7 }}
          mb={6}
        >
          <Grid templateColumns={{ base: '1fr', lg: '1.1fr 0.9fr' }} gap={6} alignItems="center">
            <GridItem>
              <Badge colorScheme="green" mb={3}>
                书院会讲
              </Badge>
              <Text as="h1" fontSize={{ base: '2xl', md: '4xl' }} fontWeight={900} fontFamily="heading" color="gray.800">
                从一个问题开始
              </Text>
              <Text mt={3} color="gray.600" lineHeight="1.9" maxW="760px">
                会讲不是寻找唯一答案，而是把自己的理由讲清楚，也认真听完不同的看法。你可以从一段历史、一篇文章或一个现实问题出发，参与讨论并留下自己的判断。
              </Text>
              <HStack mt={5} spacing={3} flexWrap="wrap">
                <Button colorScheme="green" onClick={() => document.getElementById('classic-seminar')?.scrollIntoView({ behavior: 'smooth' })}>
                  开始会讲
                </Button>
                <Button variant="outline" onClick={() => document.getElementById('co-creation')?.scrollIntoView({ behavior: 'smooth' })}>
                  查看我的参与
                </Button>
              </HStack>
            </GridItem>
            <GridItem>
              <Box bg="brand.bg" borderRadius="lg" border="1px solid" borderColor="blackAlpha.100" p={5} position="relative">
                <Box position="absolute" top={3} right={3} opacity={0.14} pointerEvents="none">
                  <svg width="72" height="72" viewBox="0 0 72 72">
                    <rect x="5" y="5" width="62" height="62" rx="6" fill="none" stroke="#97724F" strokeWidth="2.5" />
                    <rect x="12" y="12" width="48" height="48" rx="3" fill="none" stroke="#97724F" strokeWidth="1" />
                    <text x="36" y="46" textAnchor="middle" fontSize="28" fill="#97724F" fontFamily="serif">
                      讲
                    </text>
                  </svg>
                </Box>
                <Text fontSize="sm" color="brand.secondary" fontWeight={700}>
                  本期议题
                </Text>
                <Text mt={2} fontSize="lg" fontWeight={800} fontFamily="heading" color="gray.800">
                  读书是为了形成共同认识，还是保留不同理解？
                </Text>
                <Text mt={2} fontSize="sm" color="gray.600" lineHeight="1.7">
                  阅读背景资料后，选择你的立场并说明理由。
                </Text>
                <HStack mt={4} justify="space-between" align="center">
                  <Text fontSize="sm" color="gray.500">
                    预计用时 8 分钟
                  </Text>
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={() => document.getElementById('debate-lab')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    参与讨论
                  </Button>
                </HStack>
              </Box>
            </GridItem>
          </Grid>
        </Box>

        <Tabs variant="soft-rounded" colorScheme="green" mb={6}>
          <TabList overflowX="auto" pb={1}>
            <Tab onClick={() => document.getElementById('classic-seminar')?.scrollIntoView({ behavior: 'smooth' })}>经典会讲</Tab>
            <Tab onClick={() => document.getElementById('debate-lab')?.scrollIntoView({ behavior: 'smooth' })}>思辨论辩</Tab>
            <Tab onClick={() => document.getElementById('ritual-practice')?.scrollIntoView({ behavior: 'smooth' })}>礼仪习养</Tab>
            <Tab onClick={() => document.getElementById('co-creation')?.scrollIntoView({ behavior: 'smooth' })}>师生共创</Tab>
          </TabList>
          <TabPanels display="none">
            <TabPanel />
          </TabPanels>
        </Tabs>

        <VStack spacing={10} align="stretch">
          <SeminarSection />
          <DebateSection onOpenSubmit={openTopicSubmit} />
          <RitualSection />
          <CreationSection onOpenSubmit={openTrackSubmit} />
        </VStack>
      </Box>

      <SubmissionModal isOpen={isOpen} onClose={onClose} defaultTopicId={selectedTopicId} defaultTrack={selectedTrack} />
    </MotionBox>
  )
}
