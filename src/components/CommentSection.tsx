import { useState } from 'react'
import {
  Box, Text, VStack, HStack, Flex, Button, Textarea, Avatar, Badge,
  Divider, useToast,
} from '@chakra-ui/react'

interface Comment {
  id: string
  userName: string
  avatar: string
  content: string
  time: string
  likes: number
  liked: boolean
}

/** 模拟初始评论 */
const MOCK_COMMENTS: Comment[] = [
  {
    id: '1', userName: '李明轩', avatar: '🧑‍🎓',
    content: '讲解得非常透彻！朱熹的教育理念放到今天仍然很有启发，特别是"循序渐进"这一点，对我读书帮助很大。',
    time: '3天前', likes: 28, liked: false,
  },
  {
    id: '2', userName: '张晓雅', avatar: '👩‍🎓',
    content: '我是小学五年级的学生，老师让我们看了这个微课，里面的故事很有意思，"程门立雪"让我懂得了尊师重道的意义。',
    time: '5天前', likes: 15, liked: false,
  },
  {
    id: '3', userName: '王雅文 老师', avatar: '👩‍🏫',
    content: '已经把这个资源用在了班会课上，学生反响很好。建议配合《岳麓书院学规》一起讲，效果更佳。',
    time: '1周前', likes: 42, liked: false,
  },
]

export default function CommentSection({ resourceTitle }: { resourceTitle?: string }) {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS)
  const [inputValue, setInputValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  const handleSubmit = () => {
    if (!inputValue.trim()) return
    setIsSubmitting(true)

    // 模拟提交
    setTimeout(() => {
      const newComment: Comment = {
        id: Date.now().toString(),
        userName: '我',
        avatar: '🧑‍🎓',
        content: inputValue.trim(),
        time: '刚刚',
        likes: 0,
        liked: false,
      }
      setComments(prev => [newComment, ...prev])
      setInputValue('')
      setIsSubmitting(false)
      toast({ title: '评论发布成功', status: 'success', duration: 2000, position: 'top' })
    }, 500)
  }

  const handleLike = (id: string) => {
    setComments(prev => prev.map(c =>
      c.id === id ? { ...c, likes: c.liked ? c.likes - 1 : c.likes + 1, liked: !c.liked } : c
    ))
  }

  return (
    <Box bg="white" borderRadius="xl" border="1px solid" borderColor="blackAlpha.100" p={5}>
      <Text fontSize="md" fontWeight={700} fontFamily="heading" color="gray.800" mb={4}>
        💬 评论 ({comments.length})
      </Text>

      {/* 发表评论 */}
      <Box mb={4}>
        <HStack align="flex-start" spacing={3} mb={2}>
          <Avatar size="sm" bg="brand.primary" icon={<Text fontSize="lg">🧑‍🎓</Text>} />
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="写下你的想法..."
            size="sm"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            fontSize="sm"
            rows={2}
            resize="none"
            _focus={{ bg: 'white', borderColor: 'brand.primary' }}
          />
        </HStack>
        <Flex justify="flex-end">
          <Button
            size="sm"
            colorScheme="green"
            borderRadius="full"
            isLoading={isSubmitting}
            isDisabled={!inputValue.trim()}
            onClick={handleSubmit}
          >
            发表评论
          </Button>
        </Flex>
      </Box>

      <Divider borderColor="blackAlpha.100" mb={3} />

      {/* 评论列表 */}
      <VStack spacing={3} align="stretch" maxH="420px" overflowY="auto">
        {comments.map((c) => (
          <Box key={c.id}>
            <HStack align="flex-start" spacing={3}>
              <Avatar size="sm" name={c.userName} bg="brand.light" icon={<Text fontSize="lg">{c.avatar}</Text>} />
              <Box flex={1}>
                <HStack spacing={2} mb={0.5}>
                  <Text fontSize="sm" fontWeight={600} color="gray.800">{c.userName}</Text>
                  <Text fontSize="xs" color="gray.400">{c.time}</Text>
                </HStack>
                <Text fontSize="sm" color="gray.700" lineHeight="1.6" mb={1.5}>
                  {c.content}
                </Text>
                <HStack spacing={1}>
                  <Box
                    as="button"
                    fontSize="xs"
                    color={c.liked ? 'red.400' : 'gray.400'}
                    cursor="pointer"
                    _hover={{ color: 'red.400' }}
                    onClick={() => handleLike(c.id)}
                  >
                    {c.liked ? '❤️' : '🤍'} {c.likes}
                  </Box>
                </HStack>
              </Box>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  )
}
