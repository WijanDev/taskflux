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
  startOfWeekMonday
  
} from '@/lib/task-calendar'
import type {TasksViewMode} from '@/lib/task-calendar';

export const TASKS_VIEW_MODES = ['monthly', 'weekly', 'daily'] as const

export function isTasksViewMode(value: string): value is TasksViewMode {
  return (TASKS_VIEW_MODES as readonly string[]).includes(value)
}

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

/** URL calendar date (`YYYY-MM-DD`). */
export function formatCalendarDateParam(date: Date): string {
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
  serialize(value: string | Date) {
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

  function commitSearch(...args: Parameters<typeof setSearch>) {
    setSearch(...args).catch(() => {})
  }

  const today = useMemo(() => new Date(), [])
  const anchor = useMemo(() => {
    if (search.date === undefined || search.date === null) {
      return today
    }
    const dateParam =
      typeof search.date === 'string'
        ? search.date
        : formatCalendarDateParam(search.date)
    return parseCalendarDateFromString(dateParam) ?? today
  }, [search.date, today])

  const viewDay = anchor
  const viewWeekStart = useMemo(() => startOfWeekMonday(anchor), [anchor])
  const viewYear = anchor.getFullYear()
  const viewMonth = anchor.getMonth()

  function setViewMode(mode: TasksViewMode) {
    commitSearch({ view: mode })
  }

  function setAnchorDate(date: Date) {
    commitSearch({ date: formatCalendarDateParam(date) })
  }

  function setCalendarAnchor(options: {
    view?: TasksViewMode
    date?: Date
  }) {
    commitSearch({
      ...(options.view === undefined ? {} : { view: options.view }),
      ...(options.date === undefined
        ? {}
        : { date: formatCalendarDateParam(options.date) }),
    })
  }

  function goToPreviousPeriod() {
    if (search.view === 'monthly') {
      const prev = addMonths(viewYear, viewMonth, -1)
      commitSearch({ date: formatCalendarDateParam(new Date(prev.year, prev.month, 1)) })
      return
    }
    if (search.view === 'weekly') {
      commitSearch({ date: formatCalendarDateParam(addDays(viewWeekStart, -7)) })
      return
    }
    commitSearch({ date: formatCalendarDateParam(addDays(viewDay, -1)) })
  }

  function goToNextPeriod() {
    if (search.view === 'monthly') {
      const next = addMonths(viewYear, viewMonth, 1)
      commitSearch({ date: formatCalendarDateParam(new Date(next.year, next.month, 1)) })
      return
    }
    if (search.view === 'weekly') {
      commitSearch({ date: formatCalendarDateParam(addDays(viewWeekStart, 7)) })
      return
    }
    commitSearch({ date: formatCalendarDateParam(addDays(viewDay, 1)) })
  }

  function openTaskId(taskId: number) {
    commitSearch({ task: taskId })
  }

  function closeTaskId() {
    commitSearch({ task: null })
  }

  return {
    viewMode: search.view,
    selectedTaskId: search.task,
    setViewMode,
    setAnchorDate,
    setCalendarAnchor,
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
