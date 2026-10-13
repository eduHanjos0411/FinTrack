import type { ReactNode } from 'react'

interface IconProps {
  size?: number
}

function Svg({ size = 18, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function ChevronLeftIcon(props: IconProps) {
  return <Svg {...props}><path d="M15 18l-6-6 6-6" /></Svg>
}

export function ChevronRightIcon(props: IconProps) {
  return <Svg {...props}><path d="M9 18l6-6-6-6" /></Svg>
}

export function PlusIcon(props: IconProps) {
  return <Svg {...props}><path d="M12 5v14M5 12h14" /></Svg>
}

export function CloseIcon(props: IconProps) {
  return <Svg {...props}><path d="M18 6L6 18M6 6l12 12" /></Svg>
}
