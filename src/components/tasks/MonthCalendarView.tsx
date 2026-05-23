import { TaskCalendarItem } from '@/components/tasks/TaskCalendarItem'
import { WeekdayLabel } from '@/components/tasks/WeekdayLabel'
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
    <div className="flex h-full min-h-0 flex-col gap-2 sm:gap-3">
      <div
        className="grid shrink-0 grid-cols-7 gap-0.5 text-center text-xs font-medium tracking-wide text-muted-foreground uppercase sm:gap-1"
        aria-hidden
      >
        {WEEKDAY_LABELS.map((label, index) => (
          <span key={label} className="py-1">
            <WeekdayLabel index={index} />
          </span>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto overscroll-contain sm:overflow-x-hidden">
        <div className="grid min-h-[28rem] min-w-[36rem] flex-1 grid-cols-7 grid-rows-5 gap-0.5 sm:min-h-0 sm:min-w-0 sm:gap-1 sm:gap-1.5">
          {days.map((day) => {
            const inMonth = day.getMonth() === month
            const dayTasks = tasksForDay(scheduledTasks, day)

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'flex min-h-[4.5rem] flex-col rounded-md border border-border/60 p-0.5 sm:min-h-0 sm:p-1.5',
                  inMonth ? 'bg-card' : 'bg-muted/20',
                  isToday(day) && 'ring-2 ring-primary/40',
                )}
              >
                <span
                  className={cn(
                    'mb-0.5 px-0.5 text-[10px] font-medium tabular-nums sm:mb-1 sm:text-xs',
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
    </div>
  )
}
