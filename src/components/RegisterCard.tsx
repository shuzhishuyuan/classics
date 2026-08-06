import { useState } from 'react'
import {
  Box, Text, VStack, HStack, Input, InputGroup, InputLeftElement,
  Button,
} from '@chakra-ui/react'
import { PhoneIcon, LockIcon } from './Icons'

interface RegisterCardProps {
  onRegister: (data: { phone: string; name: string; password: string; confirmPassword: string }) => Promise<{ success: boolean; message?: string }>
  onSwitchToLogin: () => void
}

export default function RegisterCard({ onRegister, onSwitchToLogin }: RegisterCardProps) {
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async () => {
    setErrorMsg('')

    if (!phone.trim()) { setErrorMsg('请输入手机号'); return }
    if (!/^1[3-9]\d{9}$/.test(phone.trim())) { setErrorMsg('请输入有效的手机号'); return }
    if (!name.trim()) { setErrorMsg('请输入姓名'); return }
    if (!password) { setErrorMsg('请输入密码'); return }
    if (password.length < 6) { setErrorMsg('密码长度不能少于6位'); return }
    if (password !== confirmPassword) { setErrorMsg('两次输入的密码不一致'); return }

    setLoading(true)
    const result = await onRegister({ phone: phone.trim(), name: name.trim(), password, confirmPassword })
    setLoading(false)

    if (!result.success) {
      setErrorMsg(result.message || '注册失败')
    }
  }

  return (
    <Box maxW="420px" mx="auto" w="full">
      <Box
        bg="white"
        borderRadius="2xl"
        border="1px solid"
        borderColor="blackAlpha.100"
        boxShadow="sm"
        p={8}
      >
        <Text
          fontSize="lg"
          fontWeight={700}
          fontFamily="heading"
          color="gray.800"
          mb={6}
          textAlign="center"
        >
          注册账号
        </Text>

        <VStack spacing={4}>
          {/* 手机号 */}
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <PhoneIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setErrorMsg('') }}
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="xl"
              fontSize="sm"
              _focus={{ bg: 'white', borderColor: 'brand.primary' }}
            />
          </InputGroup>

          {/* 姓名 */}
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <Text fontSize="sm" color="gray.400">👤</Text>
            </InputLeftElement>
            <Input
              placeholder="请输入姓名（1-10个字符）"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrorMsg('') }}
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="xl"
              fontSize="sm"
              _focus={{ bg: 'white', borderColor: 'brand.primary' }}
            />
          </InputGroup>

          {/* 密码 */}
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <LockIcon color="gray.400" />
            </InputLeftElement>
            <Input
              type="password"
              placeholder="请输入密码（至少6位）"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrorMsg('') }}
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="xl"
              fontSize="sm"
              _focus={{ bg: 'white', borderColor: 'brand.primary' }}
            />
          </InputGroup>

          {/* 确认密码 */}
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <LockIcon color="gray.400" />
            </InputLeftElement>
            <Input
              type="password"
              placeholder="请再次输入密码"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setErrorMsg('') }}
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="xl"
              fontSize="sm"
              _focus={{ bg: 'white', borderColor: 'brand.primary' }}
            />
          </InputGroup>

          {/* 错误提示 */}
          {errorMsg && (
            <Text fontSize="sm" color="red.500" w="full" textAlign="left">
              {errorMsg}
            </Text>
          )}

          {/* 注册按钮 */}
          <Button
            size="lg"
            bg="brand.secondary"
            color="white"
            _hover={{ bg: '#7d5f3f' }}
            _active={{ bg: '#7d5f3f' }}
            borderRadius="full"
            w="full"
            fontWeight={600}
            fontSize="md"
            isLoading={loading}
            onClick={handleSubmit}
          >
            注 册
          </Button>

          {/* 去登录 */}
          <HStack spacing={1} pt={2}>
            <Text fontSize="sm" color="gray.400">已有账号？</Text>
            <Text
              fontSize="sm"
              color="brand.primary"
              fontWeight={600}
              cursor="pointer"
              onClick={onSwitchToLogin}
              _hover={{ textDecoration: 'underline' }}
            >
              返回登录
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
  )
}
