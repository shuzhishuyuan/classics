import {
  Box, Text, VStack, HStack, SimpleGrid, Button,
  Avatar, Flex, Badge, Divider,
} from '@chakra-ui/react'
import type { UserRole, User } from '../hooks/useAuth'

interface LoginCardProps {
  selectedRole: UserRole | null
  showUserList: boolean
  availableUsers: User[]
  onSelectRole: (role: UserRole) => void
  onLogin: (user: User) => void
  onSwitchRole: () => void
}

const roleConfig: { key: UserRole; label: string; icon: string; desc: string; color: string }[] = [
  { key: '学生', label: '学生端', icon: '🧑‍🎓', desc: '课程学习 · 经典研习 · 自主学习', color: '#2C5F2D' },
  { key: '教师', label: '教师端', icon: '👩‍🏫', desc: '教学资源 · 备课授课 · 班级管理', color: '#97724F' },
  { key: '家长', label: '家长端', icon: '👨‍👩‍👧', desc: '亲子共读 · 家校协同 · 成长陪伴', color: '#6B5B4F' },
]

const roleBadgeColor: Record<UserRole, string> = {
  '学生': 'green',
  '教师': 'orange',
  '家长': 'purple',
}

export default function LoginCard({
  selectedRole,
  showUserList,
  availableUsers,
  onSelectRole,
  onLogin,
  onSwitchRole,
}: LoginCardProps) {
  return (
    <Box maxW="720px" mx="auto">
      {/* ========== 阶段一：三端角色选择 ========== */}
      {!showUserList && (
        <>
          <Text
            fontSize="2xl"
            fontWeight={700}
            fontFamily="heading"
            color="gray.800"
            textAlign="center"
            mb={2}
          >
            欢迎来到数智书院
          </Text>
          <Text fontSize="md" color="gray.500" textAlign="center" mb={10}>
            请选择您的身份进入平台
          </Text>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
            {roleConfig.map((role) => (
              <Box
                key={role.key}
                bg="white"
                borderRadius="xl"
                border="2px solid"
                borderColor="blackAlpha.100"
                p={6}
                cursor="pointer"
                textAlign="center"
                transition="all 0.25s"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
                  borderColor: role.color,
                }}
                onClick={() => onSelectRole(role.key)}
              >
                <Text fontSize="5xl" mb={4}>{role.icon}</Text>
                <Text
                  fontSize="lg"
                  fontWeight={700}
                  fontFamily="heading"
                  color={role.color}
                  mb={2}
                >
                  {role.label}
                </Text>
                <Text fontSize="sm" color="gray.500" lineHeight="1.6">
                  {role.desc}
                </Text>
                <Button
                  mt={5}
                  size="sm"
                  borderRadius="full"
                  bg={role.color}
                  color="white"
                  _hover={{ opacity: 0.9 }}
                  width="full"
                >
                  进入{role.label}
                </Button>
              </Box>
            ))}
          </SimpleGrid>
        </>
      )}

      {/* ========== 阶段二：选择具体用户 ========== */}
      {showUserList && selectedRole && (
        <>
          <HStack justify="center" mb={1}>
            <Text fontSize="5xl">{roleConfig.find(r => r.key === selectedRole)?.icon}</Text>
          </HStack>
          <Text
            fontSize="xl"
            fontWeight={700}
            fontFamily="heading"
            color="gray.800"
            textAlign="center"
            mb={6}
          >
            选择{selectedRole}账号
          </Text>

          <VStack spacing={3} align="stretch" mb={6}>
            {availableUsers.map((u) => (
              <Flex
                key={u.id}
                bg="white"
                borderRadius="xl"
                border="1px solid"
                borderColor="blackAlpha.100"
                p={4}
                cursor="pointer"
                align="center"
                gap={4}
                transition="all 0.2s"
                _hover={{
                  borderColor: 'brand.primary',
                  boxShadow: '0 4px 16px rgba(44,95,45,0.1)',
                  transform: 'translateX(4px)',
                }}
                onClick={() => onLogin(u)}
              >
                <Avatar
                  size="md"
                  bg={roleConfig.find(r => r.key === selectedRole)?.color}
                  icon={<Text fontSize="2xl">{u.avatar}</Text>}
                />
                <Box flex={1}>
                  <HStack spacing={2} mb={0.5}>
                    <Text fontSize="md" fontWeight={600} color="gray.800">
                      {u.name}
                    </Text>
                    <Badge colorScheme={roleBadgeColor[selectedRole]} fontSize="xs" borderRadius="full">
                      {selectedRole}
                    </Badge>
                  </HStack>
                  <Text fontSize="sm" color="gray.500">
                    {u.school}
                    {selectedRole === '教师' && u.subject && ` · ${u.subject}教师`}
                    {selectedRole === '家长' && u.studentName && ` · 学生：${u.studentName}`}
                    {selectedRole === '学生' && ` · ${u.grade}`}
                  </Text>
                </Box>
                <Text fontSize="lg" color="brand.primary">→</Text>
              </Flex>
            ))}
          </VStack>

          <Button
            variant="ghost"
            size="sm"
            color="gray.500"
            onClick={onSwitchRole}
            borderRadius="full"
            mx="auto"
            display="block"
          >
            ← 返回角色选择
          </Button>
        </>
      )}
    </Box>
  )
}
