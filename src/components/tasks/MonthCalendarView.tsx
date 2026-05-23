import { useLayoutEffect, useMemo, useRef, type Ref } from 'react'
import { useTranslation } from 'react-i18next'

import { TaskCalendarItem } from '@/components/tasks/TaskCalendarItem'
import { WeekdayLabel } from '@/components/tasks/WeekdayLabel'
import type { TaskListActions } from '@/components/tasks/TaskListItem'
import {
  getMonthGridDays,
  isSameDay,
  isToday,
  tasksForDay,
  type Task,
} from '@/lib/task-calendar'
import { useFormatters } from '@/providers/AppPreferencesProvider'
import { cn } from '@/lib/utils'

type MonthCalendarViewProps = {
  year: number
  month: number
  scheduledTasks: Task[]
  actions: TaskListActions
  onTaskSelect: (task: Task) => void
  onDaySelect?: (day: Date) => void
}

type MonthDaySectionProps = {
  day: Date
  month: number
  scheduledTasks: Task[]
  actions: TaskListActions
  onTaskSelect: (task: Task) => void
  onDaySelect?: (day: Date) => void
  sectionRef?: Ref<HTMLLIElement>
}

function MonthMobileDaySection({
  day,
  month,
  scheduledTasks,
  actions,
  onTaskSelect,
  onDaySelect,
  sectionRef,
}: MonthDaySectionProps) {
  const { t } = useTranslation('calendar')
  const { formatMonthDayHeading } = useFormatters()
  const inMonth = day.getMonth() === month
  const dayTasks = tasksForDay(scheduledTasks, day)
  const dayLabel = formatMonthDayHeading(day)

  return (
    <li
      ref={sectionRef}
      className={cn(
        'rounded-lg border border-border/70 bg-card p-3',
        !inMonth && 'border-dashed bg-muted/15',
        isToday(day) && 'ring-2 ring-primary/40',
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        {onDaySelect ? (
          <button
            type="button"
            className={cn(
              'text-left text-sm font-semibold hover:underline',
              !inMonth && 'text-muted-foreground',
              isToday(day) && 'text-primary',
            )}
            onClick={() => onDaySelect(day)}
          >
            {dayLabel}
          </button>
        ) : (
          <p
            className={cn(
              'text-sm font-semibold',
              !inMonth && 'text-muted-foreground',
              isToday(day) && 'text-primary',
            )}
          >
            {dayLabel}
          </p>
        )}
        {dayTasks.length > 0 ? (
          <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary tabular-nums">
            {dayTasks.length}
          </span>
        ) : null}
      </div>

      {dayTasks.length === 0 ? (
        <p className="text-xs text-muted-foreground">{t('calendar:noTasksScheduled')}</p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
          {dayTasks.map((task) => (
            <TaskCalendarItem
              key={task.id}
              task={task}
              pending={actions.pending}
              onSelect={onTaskSelect}
              onToggle={actions.onToggle}
              className="gap-1 rounded-md border border-border/50 bg-muted/30 px-2 py-2"
              scheduleTimeClassName="text-xs"
              titleClassName="text-sm"
            />
          ))}
        </ul>
      )}
    </li>
  )
}

function MonthDesktopDayCell({
  day,
  month,
  scheduledTasks,
  actions,
  onTaskSelect,
  onDaySelect,
}: MonthDaySectionProps) {
  const { t } = useTranslation('calendar')
  const inMonth = day.getMonth() === month
  const dayTasks = tasksForDay(scheduledTasks, day)
  const overflowCount = Math.max(0, dayTasks.length - 3)
  const visibleTasks = dayTasks.slice(0, 3)

  return (
    <div
      className={cn(
        'flex min-h-0 flex-col overflow-hidden rounded-md border border-border/60 p-1',
        inMonth ? 'bg-card' : 'bg-muted/20',
        isToday(day) && 'ring-2 ring-primary/40',
      )}
    >
      <span
        className={cn(
          'mb-1 shrink-0 px-0.5 text-xs font-medium tabular-nums',
          inMonth ? 'text-foreground' : 'text-muted-foreground',
          isToday(day) && 'text-primary',
        )}
      >
        {day.getDate()}
      </span>
      <ul className="m-0 flex min-h-0 flex-1 list-none flex-col gap-0.5 overflow-y-auto p-0">
        {visibleTasks.map((task) => (
          <TaskCalendarItem
            key={task.id}
            task={task}
            pending={actions.pending}
            onSelect={onTaskSelect}
            onToggle={actions.onToggle}
            titleClassName="line-clamp-2"
          />
        ))}
      </ul>
      {overflowCount > 0 ? (
        <button
          type="button"
          className="mt-0.5 shrink-0 px-0.5 text-left text-[10px] font-medium text-primary hover:underline"
          onClick={() =>
            onDaySelect ? onDaySelect(day) : onTaskSelect(dayTasks[3]!)
          }
        >
          {t('calendar:moreTasks', { count: overflowCount })}
        </button>
      ) : null}
    </div>
  )
}

export function MonthCalendarView({
  year,
  month,
  scheduledTasks,
  actions,
  onTaskSelect,
  onDaySelect,
}: MonthCalendarViewProps) {
  const { t } = useTranslation('calendar')
  const days = getMonthGridDays(year, month)

  const mobileDays = days.filter((day) => {
    const inMonth = day.getMonth() === month
    return inMonth || tasksForDay(scheduledTasks, day).length > 0
  })

  const mobileScrollTargetDay = useMemo(() => {
    const today = new Date()
    if (today.getFullYear() === year && today.getMonth() === month) {
      return today
    }
    return new Date(year, month, 1)
  }, [year, month])

  const mobileScrollRef = useRef<HTMLDivElement>(null)
  const mobileScrollTargetRef = useRef<HTMLLIElement>(null)

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(max-width: 767px)').matches) return

    const target = mobileScrollTargetRef.current
    const container = mobileScrollRef.current
    if (!target || !container) return

    const targetTop =
      target.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop

    container.scrollTo({ top: targetTop, behavior: 'instant' })
  }, [year, month, mobileDays.length])

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        ref={mobileScrollRef}
        className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain md:hidden"
      >
        <ul className="m-0 flex list-none flex-col gap-2 p-0 pb-1">
          {mobileDays.length === 0 ? (
            <li className="rounded-lg border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
              {t('calendar:emptyMonth')}
            </li>
          ) : (
            mobileDays.map((day) => (
              <MonthMobileDaySection
                key={day.toISOString()}
                day={day}
                month={month}
                scheduledTasks={scheduledTasks}
                actions={actions}
                onTaskSelect={onTaskSelect}
                onDaySelect={onDaySelect}
                sectionRef={
                  isSameDay(day, mobileScrollTargetDay)
                    ? mobileScrollTargetRef
                    : undefined
                }
              />
            ))
          )}
        </ul>
      </div>

      <div className="hidden h-full min-h-0 flex-col gap-2 md:flex md:gap-3">
        <div
          className="grid shrink-0 grid-cols-7 gap-1 text-center text-xs font-medium tracking-wide text-muted-foreground uppercase"
          aria-hidden
        >
          {Array.from({ length: 7 }, (_, index) => (
            <span key={index} className="py-1">
              <WeekdayLabel index={index} />
            </span>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-5 gap-1.5">
          {days.map((day) => (
            <MonthDesktopDayCell
              key={day.toISOString()}
              day={day}
              month={month}
              scheduledTasks={scheduledTasks}
              actions={actions}
              onTaskSelect={onTaskSelect}
              onDaySelect={onDaySelect}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
