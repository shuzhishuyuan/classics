import { useMemo, useState, useEffect } from 'react'
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
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
  Tooltip,
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
  FaBookReader,
  FaCheck,
  FaChevronDown,
  FaChevronRight,
  FaChevronUp,
  FaCommentDots,
  FaHeart,
  FaPaperPlane,
  FaPlus,
  FaQuoteLeft,
  FaRegHeart,
  FaUpload,
  FaVoteYea,
} from 'react-icons/fa'
import {
  classicSeminars,
  creationTracks,
  creationWorks,
  debateDirections,
  debateTopics,
  ritualTasks,
  type CreationTrack,
  type DebateDirection,
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
  eyebrow,
  title,
  description,
  children,
}: {
  id: string
  eyebrow: string
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
        <Badge colorScheme="green" mb={3}>
          {eyebrow}
        </Badge>
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
      eyebrow="Classic Seminar"
      title="经典会讲"
      description="以历史会讲事件为原型，让学生选择观点阵营、表达个人判断，并在名师解读中理解“百家争鸣、教学相长”。"
    >
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={5}>
        {classicSeminars.map((seminar) => {
          const selectedCamp = votes[seminar.id]
          const totalVotes = seminar.camps.reduce((sum, camp) => sum + camp.votes + (selectedCamp === camp.id ? 1 : 0), 0)

          return (
            <Box key={seminar.id} bg="white" border="1px solid" borderColor="blackAlpha.100" borderRadius="lg" p={5}>
              <HStack justify="space-between" align="flex-start" gap={4}>
                <Box>
                  <Text fontSize="lg" fontWeight={800} fontFamily="heading">
                    {seminar.title}
                  </Text>
                  <Text mt={1} fontSize="sm" color="gray.500">
                    {seminar.source} · {seminar.academy}
                  </Text>
                </Box>
                <Icon as={FaBookReader} color="brand.primary" boxSize={5} />
              </HStack>

              <Text mt={4} color="gray.600" lineHeight="1.8">
                {seminar.summary}
              </Text>
              <Box mt={4} bg="brand.bg" borderRadius="md" p={4}>
                <HStack align="flex-start" gap={3}>
                  <Icon as={FaQuoteLeft} color="brand.secondary" mt={1} />
                  <Text fontSize="sm" color="gray.700" lineHeight="1.7">
                    {seminar.scene}
                  </Text>
                </HStack>
              </Box>

              <Stack mt={5} spacing={3}>
                {seminar.camps.map((camp) => {
                  const adjustedVotes = camp.votes + (selectedCamp === camp.id ? 1 : 0)
                  const percent = Math.round((adjustedVotes / totalVotes) * 100)
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
                      <HStack justify="space-between" align="flex-start" gap={4}>
                        <Box>
                          <Text fontWeight={700}>{camp.name}</Text>
                          <Text mt={1} fontSize="sm" color="gray.600" lineHeight="1.6">
                            {camp.thesis}
                          </Text>
                        </Box>
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
                      <HStack mt={3} spacing={3}>
                        <Progress flex="1" value={percent} colorScheme="green" borderRadius="full" />
                        <Text fontSize="sm" color="gray.600" w="42px" textAlign="right">
                          {percent}%
                        </Text>
                      </HStack>
                    </Box>
                  )
                })}
              </Stack>

              <Divider my={5} />
              <Text fontWeight={700} color="brand.primary" mb={2}>
                名师解读
              </Text>
              <Text fontSize="sm" color="gray.600" lineHeight="1.8">
                {seminar.teacherComment}
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} mt={4}>
                {seminar.featuredViews.map((view) => (
                  <Box key={view} bg="gray.50" borderRadius="md" p={3}>
                    <Text fontSize="sm" color="gray.700" lineHeight="1.7">
                      {view}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
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
  const [direction, setDirection] = useState<DebateDirection>('修身立德')
  const topics = debateTopics.filter((topic) => topic.direction === direction)

  return (
    <SectionShell
      id="debate-lab"
      eyebrow="Debate Lab"
      title="思辨论辩"
      description="围绕修身、勤学、家国与社会观察设置分学段议题，帮助学生完成“提出议题—组织论据—发表观点—获得反馈”的训练闭环。"
    >
      <ButtonGroup spacing={2} flexWrap="wrap" mb={5}>
        {debateDirections.map((item) => (
          <Button
            key={item}
            size="sm"
            variant={direction === item ? 'solid' : 'outline'}
            colorScheme={direction === item ? 'green' : undefined}
            onClick={() => setDirection(item)}
            mb={2}
          >
            {item}
          </Button>
        ))}
      </ButtonGroup>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={5}>
        {topics.map((topic) => (
          <Box key={topic.id} bg="white" border="1px solid" borderColor="blackAlpha.100" borderRadius="lg" p={5}>
            <HStack justify="space-between" align="flex-start">
              <Badge colorScheme="orange">{topic.schoolLevel}</Badge>
              <Icon as={FaChevronRight} color="brand.secondary" />
            </HStack>
            <Text mt={3} fontSize="lg" fontWeight={800} fontFamily="heading">
              {topic.title}
            </Text>
            <Text mt={2} color="gray.600" lineHeight="1.8">
              {topic.prompt}
            </Text>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} mt={5}>
              <GridItem>
                <Text fontWeight={700} color="gray.700" mb={2}>
                  论点梳理
                </Text>
                <VStack align="stretch" spacing={2}>
                  {topic.guidingQuestions.map((question, index) => (
                    <HStack key={question} align="flex-start" gap={2}>
                      <Badge colorScheme="green">Q{index + 1}</Badge>
                      <Text fontSize="sm" color="gray.600">
                        {question}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </GridItem>
              <GridItem>
                <Text fontWeight={700} color="gray.700" mb={2}>
                  论据素材
                </Text>
                <VStack align="stretch" spacing={2}>
                  {topic.evidence.map((item) => (
                    <HStack key={item} align="flex-start" gap={2}>
                      <Icon as={FaCheck} color="brand.primary" mt={1} />
                      <Text fontSize="sm" color="gray.600">
                        {item}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </GridItem>
            </Grid>

            <Button mt={5} leftIcon={<FaPaperPlane />} colorScheme="green" onClick={() => onOpenSubmit(topic.id)}>
              发表观点
            </Button>
          </Box>
        ))}
      </SimpleGrid>

      <Divider my={6} />
      <CommentSection sectionId="debate-lab" />
    </SectionShell>
  )
}

function RitualSection() {
  const checkedRituals = useDiscussionStore((state) => state.checkedRituals)
  const toggleRitual = useDiscussionStore((state) => state.toggleRitual)

  return (
    <SectionShell
      id="ritual-practice"
      eyebrow="Ritual Practice"
      title="礼仪习养"
      description="把传统书院的仪式规约转化为校园、家庭和班级场景中的可操作任务，突出从知识认知到行为养成。"
    >
      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={5}>
        {ritualTasks.map((task) => {
          const isChecked = !!checkedRituals[task.id]
          return (
            <Box key={task.id} bg="white" border="1px solid" borderColor="blackAlpha.100" borderRadius="lg" p={5}>
              <HStack justify="space-between" align="flex-start">
                <Box>
                  <Text fontSize="lg" fontWeight={800} fontFamily="heading">
                    {task.title}
                  </Text>
                  <Text mt={1} fontSize="sm" color="gray.500">
                    {task.duration}
                  </Text>
                </Box>
                <Badge colorScheme={isChecked ? 'green' : 'gray'}>{isChecked ? '已打卡' : '待实践'}</Badge>
              </HStack>
              <Text mt={4} fontSize="sm" color="gray.600" lineHeight="1.7">
                {task.context}
              </Text>
              <VStack align="stretch" spacing={3} mt={5}>
                {task.steps.map((step, index) => (
                  <HStack key={step} align="flex-start" gap={3}>
                    <Box
                      w="24px"
                      h="24px"
                      borderRadius="full"
                      bg="brand.bg"
                      color="brand.primary"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="xs"
                      fontWeight={800}
                      flexShrink={0}
                    >
                      {index + 1}
                    </Box>
                    <Text fontSize="sm" color="gray.700">
                      {step}
                    </Text>
                  </HStack>
                ))}
              </VStack>
              <Box mt={5} bg="gray.50" borderRadius="md" p={3}>
                <HStack align="flex-start" gap={2}>
                  <Icon as={FaUpload} color="brand.secondary" mt={1} />
                  <Text fontSize="sm" color="gray.600">
                    {task.evidenceHint}
                  </Text>
                </HStack>
              </Box>
              <Button
                mt={4}
                w="full"
                variant={isChecked ? 'solid' : 'outline'}
                colorScheme={isChecked ? 'green' : undefined}
                leftIcon={<FaCheck />}
                onClick={() => toggleRitual(task.id)}
              >
                {isChecked ? '已完成今日打卡' : '完成实践打卡'}
              </Button>
            </Box>
          )
        })}
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

  const submittedWorks = submissions.filter((item) => item.track)

  return (
    <SectionShell
      id="co-creation"
      eyebrow="Co-creation"
      title="师生共创"
      description="以经典解读、诗词创作、书画作品、文脉故事四个赛道重构师生共学、共研、共创的数字空间。"
    >
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} mb={5}>
        {creationTracks.map(({ track, icon }) => (
          <Button key={track} leftIcon={<Icon as={icon} />} variant="outline" onClick={() => onOpenSubmit(track)}>
            {track}
          </Button>
        ))}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={5}>
        {creationWorks.map((work) => {
          const liked = !!likedWorks[work.id]
          return (
            <Box key={work.id} bg="white" border="1px solid" borderColor="blackAlpha.100" borderRadius="lg" p={5}>
              <HStack justify="space-between" align="flex-start">
                <Badge colorScheme="purple">{work.track}</Badge>
                <Tooltip label={liked ? '取消点赞' : '点赞'}>
                  <IconButton
                    aria-label={liked ? '取消点赞' : '点赞'}
                    icon={liked ? <FaHeart /> : <FaRegHeart />}
                    size="sm"
                    colorScheme={liked ? 'red' : undefined}
                    variant={liked ? 'solid' : 'ghost'}
                    onClick={() => toggleWorkLike(work.id)}
                  />
                </Tooltip>
              </HStack>
              <Text mt={4} fontWeight={800} fontFamily="heading">
                {work.title}
              </Text>
              <Text mt={1} fontSize="sm" color="gray.500">
                {work.author} · {work.role}
              </Text>
              <Text mt={3} fontSize="sm" color="gray.600" lineHeight="1.8">
                {work.excerpt}
              </Text>
              <Text mt={4} fontSize="sm" color="gray.500">
                {work.likes + (liked ? 1 : 0)} 次认可
              </Text>
            </Box>
          )
        })}
      </SimpleGrid>

      {submittedWorks.length > 0 && (
        <Box mt={6} bg="white" border="1px solid" borderColor="blackAlpha.100" borderRadius="lg" p={5}>
          <Text fontWeight={800} fontFamily="heading" mb={3}>
            本机演示投稿
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
      <CommentSection sectionId="co-creation" />
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
      title: '投稿已保存到演示数据',
      description: '后续接入后端后，这里会进入审核与展示流程。',
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
            提交演示
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
  const submissions = useDiscussionStore((state) => state.submissions)
  const checkedRituals = useDiscussionStore((state) => state.checkedRituals)
  const votes = useDiscussionStore((state) => state.votes)
  const discussions = useDiscussionStore((state) => state.discussions)
  const initDiscussions = useDiscussionStore((state) => state.initDiscussions)

  // 首次加载时初始化种子讨论数据
  useEffect(() => {
    if (Object.keys(discussions).length === 0) {
      initDiscussions(seedDiscussions)
    }
  }, [discussions, initDiscussions])

  const stats = useMemo(
    () => [
      { label: '会讲场景', value: classicSeminars.length },
      { label: '思辨议题', value: debateTopics.length },
      { label: '礼仪任务', value: ritualTasks.length },
      { label: '本机投稿', value: submissions.length },
    ],
    [submissions.length],
  )

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
          <Grid templateColumns={{ base: '1fr', lg: '1.4fr 1fr' }} gap={6} alignItems="center">
            <GridItem>
              <Badge colorScheme="green" mb={3}>
                传统书院育人模式的数智化应用
              </Badge>
              <Text as="h1" fontSize={{ base: '2xl', md: '4xl' }} fontWeight={900} fontFamily="heading" color="gray.800">
                会讲互动
              </Text>
              <Text mt={3} color="gray.600" lineHeight="1.9" maxW="760px">
                还原传统书院“百家争鸣、教学相长、思辨笃行”的会讲传统，将经典会讲、思辨论辩、礼仪习养和师生共创转化为可点击、可演示的前端样机。
              </Text>
              <HStack mt={5} spacing={3} flexWrap="wrap">
                <Button leftIcon={<FaPlus />} colorScheme="green" onClick={() => openTrackSubmit('经典解读')}>
                  发起共创
                </Button>
                <Button variant="outline" onClick={() => document.getElementById('classic-seminar')?.scrollIntoView({ behavior: 'smooth' })}>
                  进入会讲
                </Button>
              </HStack>
            </GridItem>
            <GridItem>
              <SimpleGrid columns={2} spacing={3}>
                {stats.map((item) => (
                  <Box key={item.label} bg="brand.bg" borderRadius="md" p={4}>
                    <Text fontSize="2xl" fontWeight={900} color="brand.primary">
                      {item.value}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {item.label}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
              <HStack mt={4} spacing={3} flexWrap="wrap">
                <Badge colorScheme={Object.keys(votes).length ? 'green' : 'gray'}>投票 {Object.keys(votes).length}</Badge>
                <Badge colorScheme={Object.values(checkedRituals).filter(Boolean).length ? 'green' : 'gray'}>
                  打卡 {Object.values(checkedRituals).filter(Boolean).length}
                </Badge>
                <Badge colorScheme="purple">localStorage 持久化</Badge>
              </HStack>
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
