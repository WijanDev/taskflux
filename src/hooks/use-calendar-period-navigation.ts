import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'

import type { TasksViewMode } from '@/lib/task-calendar'
import { formatCalendarDateParam } from '@/lib/tasks-search-params'

export const CALENDAR_PERIOD_TRANSITION_MS = 320

export type CalendarNavDirection = 'previous' | 'next'

const VIEW_MODE_ORDER: Record<TasksViewMode, number> = {
  daily: 0,
  weekly: 1,
  monthly: 2,
}

export function viewSwapDirection(
  from: TasksViewMode,
  to: TasksViewMode,
): CalendarNavDirection | null {
  if (from === to) return null
  return VIEW_MODE_ORDER[to] > VIEW_MODE_ORDER[from] ? 'next' : 'previous'
}

type UseCalendarPeriodNavigationOptions = {
  readonly viewMode: TasksViewMode
  readonly viewYear: number
  readonly viewMonth: number
  readonly viewWeekStart: Date
  readonly viewDay: Date
  readonly goToPreviousPeriod: () => void
  readonly goToNextPeriod: () => void
  readonly setViewMode: (mode: TasksViewMode) => void
  readonly setCalendarAnchor: (options: {
    view?: TasksViewMode
    date?: Date
  }) => void
}

export function useCalendarPeriodNavigation({
  viewMode,
  viewYear,
  viewMonth,
  viewWeekStart,
  viewDay,
  goToPreviousPeriod,
  goToNextPeriod,
  setViewMode,
  setCalendarAnchor,
}: UseCalendarPeriodNavigationOptions) {
  const pendingDirectionRef = useRef<CalendarNavDirection | null>(null)
  const prevPeriodKeyRef = useRef<string | null>(null)
  const [enterDirection, setEnterDirection] = useState<CalendarNavDirection | null>(
    null,
  )

  const periodKey = useMemo(() => {
    if (viewMode === 'monthly') {
      return `${viewMode}:month-${viewYear}-${viewMonth}`
    }
    if (viewMode === 'weekly') {
      return `${viewMode}:week-${formatCalendarDateParam(viewWeekStart)}`
    }
    return `${viewMode}:day-${formatCalendarDateParam(viewDay)}`
  }, [viewMode, viewYear, viewMonth, viewWeekStart, viewDay])

  useLayoutEffect(() => {
    if (prevPeriodKeyRef.current === null) {
      prevPeriodKeyRef.current = periodKey
      return
    }

    if (prevPeriodKeyRef.current === periodKey) return

    const direction = pendingDirectionRef.current
    pendingDirectionRef.current = null
    prevPeriodKeyRef.current = periodKey

    if (!direction) return

    setEnterDirection(direction)
    const timeoutId = window.setTimeout(() => {
      setEnterDirection(null)
    }, CALENDAR_PERIOD_TRANSITION_MS)

    return () => window.clearTimeout(timeoutId)
  }, [periodKey])

  const queueDirection = useCallback((direction: CalendarNavDirection | null) => {
    if (direction) {
      pendingDirectionRef.current = direction
    }
  }, [])

  const onPrevious = useCallback(() => {
    queueDirection('previous')
    goToPreviousPeriod()
  }, [goToPreviousPeriod, queueDirection])

  const onNext = useCallback(() => {
    queueDirection('next')
    goToNextPeriod()
  }, [goToNextPeriod, queueDirection])

  const onViewModeChange = useCallback(
    (mode: TasksViewMode) => {
      queueDirection(viewSwapDirection(viewMode, mode))
      setViewMode(mode)
    },
    [queueDirection, setViewMode, viewMode],
  )

  const openDayView = useCallback(
    (day: Date) => {
      queueDirection(viewSwapDirection(viewMode, 'daily'))
      setCalendarAnchor({ view: 'daily', date: day })
    },
    [queueDirection, setCalendarAnchor, viewMode],
  )

  return {
    periodKey,
    enterDirection,
    onPrevious,
    onNext,
    onViewModeChange,
    openDayView,
  }
}
