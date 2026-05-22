import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type ContainerProps = {
  children: ReactNode
  className?: string
  narrow?: boolean
  wide?: boolean
  /** App pages (e.g. tasks) — comfortable width on large screens */
  full?: boolean
  /** Near viewport width with minimal side padding */
  fluid?: boolean
}

export function Container({
  children,
  className,
  narrow = false,
  wide = false,
  full = false,
  fluid = false,
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        narrow && 'max-w-md',
        !narrow && !fluid && wide && 'max-w-6xl',
        !narrow && !fluid && !wide && full && 'max-w-5xl',
        !narrow && !fluid && !wide && !full && 'max-w-3xl',
        fluid && 'max-w-[min(100%,100rem)]',
        className,
      )}
    >
      {children}
    </div>
  )
}
