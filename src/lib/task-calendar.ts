import type { tasks } from '#/db/schema'

export type TasksViewMode = 'monthly' | 'weekly' | 'daily'

export type Task = typeof tasks.$inferSelect

export const WEEKDAY_LABELS = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
] as const

export const WEEKDAY_LABELS_SHORT = [
  'M',
  'T',
  'W',
  'T',
  'F',
  'S',
  'S',
] as const

export const MONTH_GRID_WEEKS = 5
export const MONTH_GRID_DAYS = MONTH_GRID_WEEKS * 7

export function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function endOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function addMonths(year: number, month: number, delta: number) {
  const next = new Date(year, month + delta, 1)
  return { year: next.getFullYear(), month: next.getMonth() }
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

/** Week starts on Monday (matches 2026/05/18 – 2026/05/24 style ranges). */
export function startOfWeekMonday(date: Date): Date {
  const d = startOfDay(date)
  const weekday = d.getDay()
  const diff = weekday === 0 ? -6 : 1 - weekday
  return addDays(d, diff)
}

export function isScheduledTask(task: Task): boolean {
  return task.taskStartAt != null || task.taskEndsAt != null
}

export function isUnscheduledTask(task: Task): boolean {
  return !isScheduledTask(task)
}

/** True when the task’s schedule overlaps the given calendar day (local time). */
export function taskOverlapsDay(task: Task, day: Date): boolean {
  if (!isScheduledTask(task)) {
    return false
  }

  const dayStart = startOfDay(day).getTime()
  const dayEnd = endOfDay(day).getTime()

  const startsAt = task.taskStartAt
  const endsAt = task.taskEndsAt

  let rangeStartMs: number
  let rangeEndMs: number

  if (startsAt) {
    rangeStartMs = startOfDay(startsAt).getTime()
    rangeEndMs = endsAt ? endOfDay(endsAt).getTime() : endOfDay(startsAt).getTime()
  } else if (endsAt) {
    rangeStartMs = startOfDay(endsAt).getTime()
    rangeEndMs = endOfDay(endsAt).getTime()
  } else {
    return false
  }

  return rangeStartMs <= dayEnd && rangeEndMs >= dayStart
}

export function getMonthGridDays(year: number, month: number): Date[] {
  const firstOfMonth = new Date(year, month, 1)
  const gridStart = startOfWeekMonday(firstOfMonth)
  return Array.from({ length: MONTH_GRID_DAYS }, (_, i) =>
    addDays(gridStart, i),
  )
}

export function getWeekDays(weekStart: Date): Date[] {
  const start = startOfWeekMonday(weekStart)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export function formatCalendarDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`
}

export function formatWeekRange(weekStart: Date): string {
  const start = startOfWeekMonday(weekStart)
  const end = addDays(start, 6)
  return `${formatCalendarDate(start)} - ${formatCalendarDate(end)}`
}

export function tasksForDay(tasks: Task[], day: Date): Task[] {
  return tasks.filter((task) => taskOverlapsDay(task, day))
}

/** One day on the timeline: 0 (midnight) through 24 (end of day). */
export const TIME_GRID_HOURS = 24
export const TIME_GRID_HOUR_HEIGHT_PX = 72
export const TIME_GRID_TOTAL_HEIGHT_PX = TIME_GRID_HOURS * TIME_GRID_HOUR_HEIGHT_PX
/** Space above 00:00 and below 24:00 so edge labels are not cramped. */
export const TIME_GRID_EDGE_PADDING_PX = 24
export const TIME_GRID_SCROLL_HEIGHT_PX =
  TIME_GRID_TOTAL_HEIGHT_PX + TIME_GRID_EDGE_PADDING_PX * 2
export const TIME_GRID_MIN_TASK_MINUTES = 15

export function timeGridYFromHourFraction(hourFraction: number): number {
  return TIME_GRID_EDGE_PADDING_PX + hourFraction * TIME_GRID_HOUR_HEIGHT_PX
}
/** Full-hour grid lines, inclusive 0 and 24. */
export const TIME_GRID_HOUR_LABELS = Array.from(
  { length: TIME_GRID_HOURS + 1 },
  (_, i) => i,
)

/** Gutter labels every 30 minutes from 00:00 through 24:00. */
export const TIME_GRID_TIME_SLOTS = Array.from(
  { length: TIME_GRID_HOURS * 2 + 1 },
  (_, i) => i / 2,
)

/** Task interval clipped to a single calendar day (local time). */
export function getTaskIntervalOnDay(
  task: Task,
  day: Date,
): { start: Date; end: Date } | null {
  if (!taskOverlapsDay(task, day)) {
    return null
  }

  const dayStart = startOfDay(day)
  const dayEnd = endOfDay(day)

  let start = task.taskStartAt ?? startOfDay(task.taskEndsAt!)
  let end = task.taskEndsAt ?? endOfDay(task.taskStartAt!)

  if (start.getTime() < dayStart.getTime()) {
    start = dayStart
  }
  if (end.getTime() > dayEnd.getTime()) {
    end = dayEnd
  }

  if (end.getTime() <= start.getTime()) {
    end = new Date(start.getTime() + TIME_GRID_MIN_TASK_MINUTES * 60 * 1000)
  }

  return { start, end }
}

export function getTimeGridStyle(start: Date, end: Date) {
  const dayMinutes = TIME_GRID_HOURS * 60
  const startMinutes = start.getHours() * 60 + start.getMinutes()
  let endMinutes = end.getHours() * 60 + end.getMinutes()

  if (endMinutes <= startMinutes) {
    endMinutes = startMinutes + TIME_GRID_MIN_TASK_MINUTES
  }

  const durationMinutes = Math.max(
    endMinutes - startMinutes,
    TIME_GRID_MIN_TASK_MINUTES,
  )

  const top = timeGridYFromHourFraction(startMinutes / dayMinutes)
  const height = Math.max(
    (durationMinutes / dayMinutes) * TIME_GRID_TOTAL_HEIGHT_PX,
    (TIME_GRID_MIN_TASK_MINUTES / dayMinutes) * TIME_GRID_TOTAL_HEIGHT_PX,
  )

  return { top, height }
}

export function partitionTasks(tasks: Task[]) {
  const scheduled: Task[] = []
  const unscheduled: Task[] = []

  for (const task of tasks) {
    if (isUnscheduledTask(task)) {
      unscheduled.push(task)
    } else {
      scheduled.push(task)
    }
  }

  return { scheduled, unscheduled }
}
