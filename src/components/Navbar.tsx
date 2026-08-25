import { useEffect, useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import {
  Box,
  Collapse,
  Flex,
  HStack,
  IconButton,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FiMenu, FiX } from 'react-icons/fi'

const navLinks = [
  { label: '首页', path: '/' },
  { label: '经典研习', path: '/classics' },
  { label: '会讲互动', path: '/discussion' },
  { label: '3D展馆', path: '/academy-3d' },
  { label: '资源共享', path: '/resources' },
]

export default function Navbar() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const renderNavLink = (link: (typeof navLinks)[number], mobile = false) => {
    const isActive =
      link.path === '/'
        ? location.pathname === '/'
        : location.pathname.startsWith(link.path)

    return (
      <Link
        key={link.path}
        as={RouterLink}
        to={link.path}
        w={mobile ? 'full' : 'auto'}
        px={mobile ? 4 : 3}
        py={mobile ? 3 : 2}
        borderRadius="md"
        fontSize="sm"
        fontWeight={isActive ? 700 : 500}
        color={isActive ? 'brand.primary' : 'gray.600'}
        bg={isActive ? 'green.50' : 'transparent'}
        _hover={{ bg: 'blackAlpha.50', textDecoration: 'none' }}
      >
        {link.label}
      </Link>
    )
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
        px={{ base: 4, md: 6 }}
        align="center"
        gap={{ base: 3, md: 6 }}
      >
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
          <Text fontSize="xl" fontWeight={700} fontFamily="heading" color="brand.primary">
            数智书院
          </Text>
        </Link>

        <HStack spacing={1} display={{ base: 'none', md: 'flex' }} flexShrink={0}>
          {navLinks.map((link) => renderNavLink(link))}
        </HStack>

        <IconButton
          display={{ base: 'inline-flex', md: 'none' }}
          ml="auto"
          variant="ghost"
          color="brand.primary"
          fontSize="24px"
          aria-label={isMenuOpen ? '关闭导航菜单' : '打开导航菜单'}
          icon={isMenuOpen ? <FiX /> : <FiMenu />}
          onClick={() => setIsMenuOpen((open) => !open)}
        />
      </Flex>

      <Collapse in={isMenuOpen} animateOpacity>
        <Box
          display={{ base: 'block', md: 'none' }}
          bg="white"
          borderTop="1px solid"
          borderColor="blackAlpha.100"
          px={4}
          py={3}
        >
          <VStack align="stretch" spacing={1}>
            {navLinks.map((link) => renderNavLink(link, true))}
          </VStack>
        </Box>
      </Collapse>
    </Box>
  )
}
