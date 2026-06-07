import { Link as RouterLink, useLocation } from 'react-router-dom'
import {
  Box, Flex, Text, Link, HStack,
} from '@chakra-ui/react'

const navLinks = [
  { label: '首页', path: '/' },
  { label: '经典研习', path: '/classics' },
  { label: '会讲互动', path: '#' },
  { label: 'VR数字书院', path: '#' },
  { label: '资源共享', path: '/resources' },
]

export default function Navbar() {
  const location = useLocation()

  /** 判断当前路由是否匹配导航项 */
  const isActive = (path: string) => {
    if (path === '#') return false
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      bg="white"
      borderBottom="1px solid"
      borderColor="blackAlpha.100"
      boxShadow="0 2px 8px rgba(0,0,0,0.04)"
    >
      <Flex
        maxW="1400px"
        mx="auto"
        h="72px"
        px={6}
        align="center"
        gap={6}
      >
        {/* Logo */}
        <Link
          as={RouterLink}
          to="/"
          display="flex"
          alignItems="center"
          gap={2}
          textDecoration="none"
          _hover={{ textDecoration: 'none' }}
          flexShrink={0}
        >
          <Box
            w="36px"
            h="36px"
            bg="brand.primary"
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="xl"
            color="white"
            fontWeight={900}
            fontFamily="serif"
          >
            書
          </Box>
          <Text
            fontSize="xl"
            fontWeight={700}
            fontFamily="heading"
            color="brand.primary"
            display={{ base: 'none', md: 'block' }}
          >
            数智书院
          </Text>
        </Link>

        {/* 全局导航 */}
        <HStack spacing={1} display={{ base: 'none', md: 'flex' }} flexShrink={0}>
          {navLinks.map((link) => {
            const active = isActive(link.path)
            const isDisabled = link.path === '#'
            return (
              <Link
                key={link.label}
                as={isDisabled ? undefined : RouterLink}
                to={link.path}
                px={3}
                py={2}
                borderRadius="md"
                fontSize="sm"
                fontWeight={active ? 700 : 400}
                color={active ? 'brand.primary' : 'gray.600'}
                bg={active ? 'blackAlpha.50' : 'transparent'}
                _hover={{ bg: 'blackAlpha.50', textDecoration: 'none' }}
                cursor={isDisabled ? 'not-allowed' : 'pointer'}
                opacity={isDisabled ? 0.6 : 1}
                transition="all 0.15s"
              >
                {link.label}
              </Link>
            )
          })}
        </HStack>
      </Flex>
    </Box>
  )
}
