import { HStack, Box, Text, Flex } from '@chakra-ui/react'
import type { ResourceCategory } from '../types/resource'

interface CategoryNavProps {
  activeCategory: ResourceCategory
  onCategoryChange: (category: ResourceCategory) => void
}

const categories: { key: ResourceCategory; label: string; icon: string; desc: string }[] = [
  { key: '名师微课', label: '名师微课', icon: '🎬', desc: '书院文化系列课程' },
  { key: '教师备课', label: '教师备课', icon: '📚', desc: '教学资源与方案' },
  { key: '学生学习', label: '学生学习', icon: '✏️', desc: '自主学习与文化拓展' },
  { key: '亲子共读', label: '亲子共读', icon: '👨‍👩‍👧', desc: '家庭共育与亲子互动' },
]

export default function ResourceCategoryNav({ activeCategory, onCategoryChange }: CategoryNavProps) {
  return (
    <Box
      overflowX="auto"
      css={{
        '&::-webkit-scrollbar': { height: 0 },
        scrollbarWidth: 'none',
      }}
    >
      <HStack
        spacing={{ base: 2, md: 3 }}
        flexShrink={0}
        minW="max-content"
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.key
          return (
            <Box
              key={cat.key}
              onClick={() => onCategoryChange(cat.key)}
              cursor="pointer"
              role="group"
              flexShrink={0}
              px={{ base: 4, md: 6 }}
              py={4}
              borderRadius="xl"
              bg={isActive ? 'brand.primary' : 'white'}
              color={isActive ? 'white' : 'gray.700'}
              border="1px solid"
              borderColor={isActive ? 'brand.primary' : 'blackAlpha.100'}
              boxShadow={isActive ? '0 4px 16px rgba(44,95,45,0.2)' : 'sm'}
              transform={isActive ? 'translateY(-2px)' : 'translateY(0)'}
              transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: isActive ? '0 4px 16px rgba(44,95,45,0.2)' : '0 4px 12px rgba(0,0,0,0.08)',
                borderColor: isActive ? 'brand.primary' : 'brand.primary',
              }}
              minW={{ base: '140px', md: '180px' }}
            >
              <Flex align="center" gap={2.5}>
                <Text fontSize={{ base: 'xl', md: '2xl' }}>{cat.icon}</Text>
                <Box>
                  <Text
                    fontSize={{ base: 'sm', md: 'md' }}
                    fontWeight={700}
                    fontFamily="heading"
                    whiteSpace="nowrap"
                  >
                    {cat.label}
                  </Text>
                  <Text
                    fontSize="xs"
                    opacity={0.7}
                    whiteSpace="nowrap"
                    mt={0.5}
                  >
                    {cat.desc}
                  </Text>
                </Box>
              </Flex>
            </Box>
          )
        })}
      </HStack>
    </Box>
  )
}
