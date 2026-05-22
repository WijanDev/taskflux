import type { ReactNode } from 'react'

import { Container } from '@/components/Container'
import { cn } from '@/lib/utils'

type PageShellProps = {
  children: ReactNode
  className?: string
  narrow?: boolean
  wide?: boolean
  full?: boolean
}

export function PageShell({
  children,
  className,
  narrow = false,
  wide = false,
  full = false,
}: PageShellProps) {
  return (
    <main className={cn('py-10', className)}>
      <Container narrow={narrow} wide={wide} full={full}>
        {children}
      </Container>
    </main>
  )
}
