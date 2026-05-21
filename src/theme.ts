import { extendTheme } from '@chakra-ui/react'

/** 国风配色方案 */
const colors = {
  brand: {
    primary: '#2C5F2D',   // 墨绿
    secondary: '#97724F', // 赭石
    bg: '#FAF6F0',        // 米白
    dark: '#1A3B1A',      // 深墨绿
    light: '#E8E0D0',     // 浅米色
    accent: '#C8A96E',    // 金色点缀
  },
}

const theme = extendTheme({
  colors,
  fonts: {
    heading: '"Noto Serif SC", "思源宋体", serif',
    body: '"Inter", sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: colors.brand.bg,
        color: 'gray.800',
        fontFamily: 'body',
      },
      '::selection': {
        bg: colors.brand.primary,
        color: 'white',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'md',
        fontWeight: 500,
      },
      variants: {
        solid: {
          bg: colors.brand.primary,
          color: 'white',
          _hover: {
            bg: colors.brand.dark,
          },
        },
        ghost: {
          color: colors.brand.primary,
          _hover: {
            bg: 'blackAlpha.100',
          },
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: 'full',
        px: 3,
        py: 0.5,
        fontWeight: 500,
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'lg',
          bg: 'white',
          boxShadow: 'sm',
          border: '1px solid',
          borderColor: 'blackAlpha.100',
        },
      },
    },
  },
})

export default theme
