import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type ContainerProps = Readonly<{
  children: ReactNode
  className?: string
  narrow?: boolean
  /** Form-style pages: narrow on mobile, wider from md up */
  comfortable?: boolean
  wide?: boolean
  /** App pages (e.g. tasks) — comfortable width on large screens */
  full?: boolean
  /** Near viewport width with minimal side padding */
  fluid?: boolean
}>

export function Container({
  children,
  className,
  narrow = false,
  comfortable = false,
  wide = false,
  full = false,
  fluid = false,
}: ContainerProps) {
  const hasFixedWidth = narrow || comfortable || wide || full

  return (
    <div
      className={cn(
        'mx-auto w-full',
        fluid ? 'px-3 sm:px-4 md:px-6 lg:px-8' : 'px-3 sm:px-6 lg:px-8',
        narrow && 'max-w-md',
        comfortable && 'max-w-md md:max-w-3xl lg:max-w-4xl',
        !narrow && !comfortable && !fluid && wide && 'max-w-6xl',
        !hasFixedWidth && !fluid && 'max-w-3xl',
        !narrow && !comfortable && !fluid && full && 'max-w-5xl',
        fluid && 'max-w-[min(100%,100rem)]',
        className,
      )}
    >
      {children}
    </div>
  )
}
