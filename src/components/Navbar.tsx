import { Link as RouterLink } from 'react-router-dom'
import {
  Box, Flex, Text, Link, HStack,
} from '@chakra-ui/react'

const navLinks = [
  { label: '首页', path: '/', active: false },
  { label: '经典研习', path: '/classics', active: true },
  { label: '会讲互动', path: '#', active: false },
  { label: '资源共享', path: '#', active: false },
]

export default function Navbar() {
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
            书院
          </Text>
        </Link>

        {/* 全局导航 */}
        <HStack spacing={1} display={{ base: 'none', md: 'flex' }} flexShrink={0}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              as={link.path.startsWith('#') ? undefined : RouterLink}
              to={link.path}
              px={3}
              py={2}
              borderRadius="md"
              fontSize="sm"
              fontWeight={link.active ? 600 : 400}
              color={link.active ? 'brand.primary' : 'gray.600'}
              bg={link.active ? 'brand.primary.50' : 'transparent'}
              _hover={{ bg: 'blackAlpha.50', textDecoration: 'none' }}
              cursor={link.path.startsWith('#') ? 'not-allowed' : 'pointer'}
              opacity={link.path.startsWith('#') ? 0.6 : 1}
            >
              {link.label}
            </Link>
          ))}
        </HStack>
      </Flex>
    </Box>
  )
}
