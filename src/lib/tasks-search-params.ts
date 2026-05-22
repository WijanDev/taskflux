import {
  createParser,
  createStandardSchemaV1,
  parseAsInteger,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs'
import { useMemo } from 'react'

import {
  addDays,
  addMonths,
  startOfWeekMonday,
  type TasksViewMode,
} from '@/lib/task-calendar'

export const TASKS_VIEW_MODES = ['monthly', 'weekly', 'daily'] as const

/** Calendar date param in the URL (YYYY-MM-DD). */
export type CalendarDateParam = string

export function parseCalendarDateFromString(
  value: string,
): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  const date = new Date(year, month, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null
  }
  return date
}

export function formatCalendarDateParam(date: Date): CalendarDateParam {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * String-based calendar date for URL + TanStack Router validateSearch.
 * (Router passes raw strings into serializers before parsing.)
 */
export const parseAsCalendarDate = createParser({
  parse(value) {
    const date = parseCalendarDateFromString(value)
    return date ? formatCalendarDateParam(date) : null
  },
  serialize(value: CalendarDateParam | Date) {
    if (typeof value === 'string') {
      const parsed = parseCalendarDateFromString(value)
      return parsed ? formatCalendarDateParam(parsed) : value
    }
    return formatCalendarDateParam(value)
  },
  eq: (a, b) => a === b,
})

export const tasksSearchParams = {
  view: parseAsStringLiteral(TASKS_VIEW_MODES).withDefault('daily'),
  task: parseAsInteger,
  date: parseAsCalendarDate,
}

export const tasksSearchSchema = createStandardSchemaV1(tasksSearchParams, {
  partialOutput: true,
})

export function useTasksUrlState() {
  const [search, setSearch] = useQueryStates(tasksSearchParams)
  const today = useMemo(() => new Date(), [])
  const anchor = useMemo(() => {
    if (!search.date) return today
    return parseCalendarDateFromString(search.date) ?? today
  }, [search.date, today])

  const viewDay = anchor
  const viewWeekStart = useMemo(() => startOfWeekMonday(anchor), [anchor])
  const viewYear = anchor.getFullYear()
  const viewMonth = anchor.getMonth()

  function setViewMode(mode: TasksViewMode) {
    void setSearch({ view: mode })
  }

  function setAnchorDate(date: Date) {
    void setSearch({ date: formatCalendarDateParam(date) })
  }

  function goToPreviousPeriod() {
    if (search.view === 'monthly') {
      const prev = addMonths(viewYear, viewMonth, -1)
      void setSearch({ date: formatCalendarDateParam(new Date(prev.year, prev.month, 1)) })
      return
    }
    if (search.view === 'weekly') {
      void setSearch({ date: formatCalendarDateParam(addDays(viewWeekStart, -7)) })
      return
    }
    void setSearch({ date: formatCalendarDateParam(addDays(viewDay, -1)) })
  }

  function goToNextPeriod() {
    if (search.view === 'monthly') {
      const next = addMonths(viewYear, viewMonth, 1)
      void setSearch({ date: formatCalendarDateParam(new Date(next.year, next.month, 1)) })
      return
    }
    if (search.view === 'weekly') {
      void setSearch({ date: formatCalendarDateParam(addDays(viewWeekStart, 7)) })
      return
    }
    void setSearch({ date: formatCalendarDateParam(addDays(viewDay, 1)) })
  }

  function openTaskId(taskId: number) {
    void setSearch({ task: taskId })
  }

  function closeTaskId() {
    void setSearch({ task: null })
  }

  return {
    viewMode: search.view,
    selectedTaskId: search.task,
    setViewMode,
    setAnchorDate,
    viewDay,
    viewWeekStart,
    viewYear,
    viewMonth,
    goToPreviousPeriod,
    goToNextPeriod,
    openTaskId,
    closeTaskId,
  }
}
