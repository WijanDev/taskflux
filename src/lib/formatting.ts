import type { TFunction } from 'i18next'

import {
  addDays,
  formatCalendarDate,
  startOfWeekMonday,
} from '@/lib/task-calendar'
import type { AppLocale, TimeFormat } from '#/lib/user-settings'

const MONDAY_BASE = new Date(2024, 0, 1)

export function createFormatters(
  locale: AppLocale,
  timeFormat: TimeFormat,
  t: TFunction,
) {
  const hour12 = timeFormat === '12h'

  const dateTimeFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12,
  })

  const timeOnlyFormatter = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12,
  })

  function formatTaskTimestamp(date: Date | null | undefined): string {
    if (!date) {
      return ''
    }
    return dateTimeFormatter.format(date)
  }

  function formatTaskRange(
    start: Date | null | undefined,
    end: Date | null | undefined,
  ): string | null {
    if (!start && !end) {
      return null
    }
    if (start && end) {
      return t('tasks:range.both', {
        start: formatTaskTimestamp(start),
        end: formatTaskTimestamp(end),
      })
    }
    if (start) {
      return t('tasks:range.starts', { time: formatTaskTimestamp(start) })
    }
    return t('tasks:range.ends', { time: formatTaskTimestamp(end) })
  }

  function formatMonthYear(year: number, month: number): string {
    return new Intl.DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric',
    }).format(new Date(year, month, 1))
  }

  function formatDayTitle(day: Date): string {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(day)
  }

  function formatWeekRange(weekStart: Date): string {
    const start = startOfWeekMonday(weekStart)
    const end = addDays(start, 6)
    return `${formatCalendarDate(start)} - ${formatCalendarDate(end)}`
  }

  function formatTimelineLabel(hourFraction: number): string {
    const totalMinutes = Math.round(hourFraction * 60)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (timeFormat === '24h') {
      const pad = (n: number) => String(n).padStart(2, '0')
      return `${pad(hours)}:${pad(minutes)}`
    }

    const date = new Date(2000, 0, 1, hours, minutes)
    return timeOnlyFormatter.format(date)
  }

  function formatWeekday(index: number, short: boolean): string {
    const day = addDays(MONDAY_BASE, index)
    return new Intl.DateTimeFormat(locale, {
      weekday: short ? 'narrow' : 'short',
    }).format(day)
  }

  return {
    formatTaskTimestamp,
    formatTaskRange,
    formatMonthYear,
    formatDayTitle,
    formatWeekRange,
    formatTimelineLabel,
    formatWeekday,
  }
}

export type AppFormatters = ReturnType<typeof createFormatters>
