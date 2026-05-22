import type { ReactNode } from 'react'

import { Container } from '@/components/Container'
import { cn } from '@/lib/utils'

type PageShellProps = {
  children: ReactNode
  className?: string
  narrow?: boolean
  wide?: boolean
  full?: boolean
  /** Near viewport width (e.g. tasks calendar) */
  fluid?: boolean
}

export function PageShell({
  children,
  className,
  narrow = false,
  wide = false,
  full = false,
  fluid = false,
}: PageShellProps) {
  return (
    <main
      className={cn(
        fluid
          ? 'flex min-h-0 flex-1 flex-col overflow-hidden py-0'
          : 'min-h-0 flex-1 overflow-y-auto py-10',
        className,
      )}
    >
      <Container
        narrow={narrow}
        wide={wide}
        full={full}
        fluid={fluid}
        className={
          fluid ? 'flex h-full min-h-0 flex-1 flex-col overflow-hidden' : undefined
        }
      >
        {children}
      </Container>
    </main>
  )
}
