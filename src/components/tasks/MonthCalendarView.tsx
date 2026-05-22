import { TaskCalendarItem } from '@/components/tasks/TaskCalendarItem'
import type { TaskListActions } from '@/components/tasks/TaskListItem'
import {
  getMonthGridDays,
  isToday,
  tasksForDay,
  WEEKDAY_LABELS,
  type Task,
} from '@/lib/task-calendar'
import { cn } from '@/lib/utils'

type MonthCalendarViewProps = {
  year: number
  month: number
  scheduledTasks: Task[]
  actions: TaskListActions
  onTaskSelect: (task: Task) => void
}

export function MonthCalendarView({
  year,
  month,
  scheduledTasks,
  actions,
  onTaskSelect,
}: MonthCalendarViewProps) {
  const days = getMonthGridDays(year, month)

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div
        className="grid shrink-0 grid-cols-7 gap-1 text-center text-xs font-medium tracking-wide text-muted-foreground uppercase"
        aria-hidden
      >
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="py-1">
            {label}
          </span>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-5 gap-1 sm:gap-1.5">
        {days.map((day) => {
          const inMonth = day.getMonth() === month
          const dayTasks = tasksForDay(scheduledTasks, day)

          return (
            <div
              key={day.toISOString()}
              className={cn(
                'flex min-h-0 flex-col rounded-md border border-border/60 p-1 sm:p-1.5',
                inMonth ? 'bg-card' : 'bg-muted/20',
                isToday(day) && 'ring-2 ring-primary/40',
              )}
            >
              <span
                className={cn(
                  'mb-1 text-xs font-medium tabular-nums',
                  inMonth ? 'text-foreground' : 'text-muted-foreground',
                  isToday(day) && 'text-primary',
                )}
              >
                {day.getDate()}
              </span>
              <ul className="m-0 flex min-h-0 flex-1 list-none flex-col gap-0.5 overflow-y-auto p-0">
                {dayTasks.map((task) => (
                  <TaskCalendarItem
                    key={task.id}
                    task={task}
                    pending={actions.pending}
                    onSelect={onTaskSelect}
                    onToggle={actions.onToggle}
                  />
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
