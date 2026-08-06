import { useState } from 'react'
import {
  Box, Text, VStack, HStack, Input, InputGroup, InputLeftElement,
  Button,
} from '@chakra-ui/react'
import { PhoneIcon, LockIcon } from './Icons'

interface LoginCardProps {
  onLogin: (phone: string, password: string) => Promise<{ success: boolean; message?: string }>
  onSwitchToRegister: () => void
}

export default function LoginCard({ onLogin, onSwitchToRegister }: LoginCardProps) {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async () => {
    setErrorMsg('')
    if (!phone.trim()) { setErrorMsg('请输入手机号'); return }
    if (!password) { setErrorMsg('请输入密码'); return }

    setLoading(true)
    const result = await onLogin(phone.trim(), password)
    setLoading(false)

    if (!result.success) {
      setErrorMsg(result.message || '登录失败')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
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
          账号登录
        </Text>

        <VStack spacing={4}>
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <PhoneIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setErrorMsg('') }}
              onKeyDown={handleKeyDown}
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="xl"
              fontSize="sm"
              _focus={{ bg: 'white', borderColor: 'brand.primary' }}
            />
          </InputGroup>

          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <LockIcon color="gray.400" />
            </InputLeftElement>
            <Input
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrorMsg('') }}
              onKeyDown={handleKeyDown}
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="xl"
              fontSize="sm"
              _focus={{ bg: 'white', borderColor: 'brand.primary' }}
            />
          </InputGroup>

          {errorMsg && (
            <Text fontSize="sm" color="red.500" w="full" textAlign="left">
              {errorMsg}
            </Text>
          )}

          <Button
            size="lg"
            bg="brand.primary"
            color="white"
            _hover={{ bg: 'brand.dark' }}
            _active={{ bg: 'brand.dark' }}
            borderRadius="full"
            w="full"
            fontWeight={600}
            fontSize="md"
            isLoading={loading}
            onClick={handleSubmit}
          >
            登 录
          </Button>

          <HStack spacing={1} pt={2}>
            <Text fontSize="sm" color="gray.400">没有账号？</Text>
            <Text
              fontSize="sm"
              color="brand.primary"
              fontWeight={600}
              cursor="pointer"
              onClick={onSwitchToRegister}
              _hover={{ textDecoration: 'underline' }}
            >
              立即注册
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
  )
}
