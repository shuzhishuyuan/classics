import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Box, Flex, HStack, Link, Text } from '@chakra-ui/react'

const navLinks = [
  { label: '首页', path: '/' },
  { label: '经典研习', path: '/classics' },
  { label: '会讲互动', path: '/discussion' },
  { label: 'VR数字书院', path: '#' },
  { label: '资源共享', path: '/resources' },
]

export default function Navbar() {
  const location = useLocation()

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
      <Flex maxW="1400px" mx="auto" h="72px" px={6} align="center" gap={6}>
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
            书
          </Box>
          <Text fontSize="xl" fontWeight={700} fontFamily="heading" color="brand.primary" display={{ base: 'none', md: 'block' }}>
            数智书院
          </Text>
        </Link>

        <HStack spacing={1} display={{ base: 'none', md: 'flex' }} flexShrink={0}>
          {navLinks.map((link) => {
            const isComingSoon = link.path === '#'
            const isActive =
              link.path === '/'
                ? location.pathname === '/'
                : !isComingSoon && location.pathname.startsWith(link.path)

            return (
              <Link
                key={link.label}
                as={isComingSoon ? undefined : RouterLink}
                to={link.path}
                px={3}
                py={2}
                borderRadius="md"
                fontSize="sm"
                fontWeight={isActive ? 700 : 500}
                color={isActive ? 'brand.primary' : 'gray.600'}
                bg={isActive ? 'green.50' : 'transparent'}
                _hover={{ bg: 'blackAlpha.50', textDecoration: 'none' }}
                cursor={isComingSoon ? 'not-allowed' : 'pointer'}
                opacity={isComingSoon ? 0.55 : 1}
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
