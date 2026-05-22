import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type ContainerProps = {
  children: ReactNode
  className?: string
  narrow?: boolean
  wide?: boolean
  /** App pages (e.g. tasks) — comfortable width on large screens */
  full?: boolean
}

export function Container({
  children,
  className,
  narrow = false,
  wide = false,
  full = false,
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        narrow && 'max-w-md',
        !narrow && wide && 'max-w-6xl',
        !narrow && !wide && full && 'max-w-5xl',
        !narrow && !wide && !full && 'max-w-3xl',
        className,
      )}
    >
      {children}
    </div>
  )
}
