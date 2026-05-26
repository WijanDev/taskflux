import type { ReactNode } from 'react'

import type { CalendarNavDirection } from '@/hooks/use-calendar-period-navigation'
import { cn } from '@/lib/utils'

type CalendarPeriodTransitionProps = Readonly<{
  periodKey: string
  enterDirection: CalendarNavDirection | null
  children: ReactNode
  className?: string
}>

export function calendarPeriodEnterClass(
  enterDirection: CalendarNavDirection | null,
): string | undefined {
  if (enterDirection === 'next') return 'calendar-period-enter-next'
  if (enterDirection === 'previous') return 'calendar-period-enter-previous'
  return undefined
}

export function CalendarPeriodTransition({
  periodKey,
  enterDirection,
  children,
  className,
}: CalendarPeriodTransitionProps) {
  return (
    <div className={cn('flex min-h-0 flex-1 flex-col overflow-hidden', className)}>
      <div
        key={periodKey}
        className={cn(
          'flex h-full min-h-0 flex-1 flex-col',
          calendarPeriodEnterClass(enterDirection),
        )}
      >
        {children}
      </div>
    </div>
  )
}
