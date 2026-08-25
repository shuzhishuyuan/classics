import { Box } from '@chakra-ui/react'

type AIAssistantLogoProps = {
  size?: number
}

export default function AIAssistantLogo({ size = 58 }: AIAssistantLogoProps) {
  return (
    <Box
      as="span"
      display="inline-flex"
      w={`${size}px`}
      h={`${size}px`}
      flexShrink={0}
      role="img"
      aria-label="书院智问标志"
    >
      <svg
        viewBox="0 0 72 72"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="2.5" y="2.5" width="67" height="67" rx="21" fill="#F6EFE4" />
        <path
          d="M13 20.5C19.3 16.9 26.2 16.8 35.2 21v34.2c-8.3-3.6-15.2-3.4-22.2.2V20.5Z"
          fill="#FFFDF8"
          stroke="#2C5F2D"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path
          d="M35.2 21c8.6-4.2 15.6-4.1 23.8-.5v34.1c-7.4-3.6-14.8-3.5-23.8.6V21Z"
          fill="#FFFDF8"
          stroke="#2C5F2D"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path d="M35.2 22v32.4" stroke="#97724F" strokeWidth="2.1" strokeLinecap="round" />
        <path
          d="M18.5 27.5c4.5-1.6 8.4-1.4 12.1.2M18.5 34.5c4.5-1.6 8.4-1.4 12.1.2M42.4 27.5c4.5-1.6 8.4-1.4 12.1.2M42.4 34.5c4.5-1.6 8.4-1.4 12.1.2"
          stroke="#B7A891"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M48.3 10.5h9.4a8.8 8.8 0 0 1 8.8 8.8v3.2a8.8 8.8 0 0 1-8.8 8.8h-3.1l-5.1 4.5.9-4.6h-2.1a8.8 8.8 0 0 1-8.8-8.8v-3.1a8.8 8.8 0 0 1 8.8-8.8Z"
          fill="#2C5F2D"
        />
        <circle cx="50.1" cy="21.7" r="1.6" fill="#F6EFE4" />
        <circle cx="55.1" cy="21.7" r="1.6" fill="#F6EFE4" />
        <circle cx="60.1" cy="21.7" r="1.6" fill="#F6EFE4" />
        <path
          d="m57.1 4.8 1.2 3.1 3.1 1.2-3.1 1.2-1.2 3.1-1.2-3.1-3.1-1.2 3.1-1.2 1.2-3.1Z"
          fill="#C8A96E"
        />
        <rect x="2.5" y="2.5" width="67" height="67" rx="21" stroke="#E3D6C3" strokeWidth="2" />
      </svg>
    </Box>
  )
}
