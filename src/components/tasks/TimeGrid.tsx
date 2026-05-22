import { TaskTimeBlock } from '@/components/tasks/TaskTimeBlock'
import {
  formatTimelineLabel,
  getTaskIntervalOnDay,
  getTimeGridStyle,
  isToday,
  tasksForDay,
  TIME_GRID_HOUR_LABELS,
  TIME_GRID_HOURS,
  TIME_GRID_SCROLL_HEIGHT_PX,
  TIME_GRID_TIME_SLOTS,
  timeGridYFromHourFraction,
  WEEKDAY_LABELS,
  type Task,
} from '@/lib/task-calendar'
import { cn } from '@/lib/utils'

const HALF_HOUR_INDICES = Array.from({ length: TIME_GRID_HOURS }, (_, i) => i)
const TIME_GUTTER_WIDTH = '4.25rem'

function gridTemplateColumns(columnCount: number) {
  return `${TIME_GUTTER_WIDTH} repeat(${columnCount}, minmax(0, 1fr))`
}

type TimeGridProps = {
  days: Date[]
  tasks: Task[]
  pending: boolean
  onTaskSelect: (task: Task) => void
  onToggle: (task: Task, completed: boolean) => void
}

export function TimeGrid({
  days,
  tasks,
  pending,
  onTaskSelect,
  onToggle,
}: TimeGridProps) {
  const columnCount = days.length
  const showWeekdayHeaders = columnCount > 1
  const columns = gridTemplateColumns(columnCount)

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-gutter:stable]">
        {showWeekdayHeaders ? (
          <div
            className="sticky top-0 z-20 grid shrink-0 border-b border-border/60 bg-card"
            style={{ gridTemplateColumns: columns }}
          >
            <div />
            {days.map((day, index) => (
              <div
                key={day.toISOString()}
                className={cn(
                  'border-l border-border/60 px-2 py-2 text-center',
                  isToday(day) && 'bg-primary/5',
                )}
              >
                <span className="block text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {WEEKDAY_LABELS[index]}
                </span>
                <span
                  className={cn(
                    'mt-0.5 block text-sm font-semibold tabular-nums',
                    isToday(day) ? 'text-primary' : 'text-foreground',
                  )}
                >
                  {day.getDate()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="sticky top-0 z-20 grid shrink-0 border-b border-border/60 bg-card"
            style={{ gridTemplateColumns: columns }}
          >
            <div />
            <div
              className={cn(
                'border-l border-border/60 px-2 py-2 text-center text-sm font-semibold',
                isToday(days[0]!) && 'bg-primary/5 text-primary',
              )}
            >
              {days[0]!.toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </div>
        )}

        <div
          className="relative"
          style={{ height: TIME_GRID_SCROLL_HEIGHT_PX }}
        >
          {HALF_HOUR_INDICES.map((hour) => (
            <div
              key={`half-${hour}`}
              className="pointer-events-none absolute right-0 left-0 border-t border-border/20"
              style={{
                top: timeGridYFromHourFraction(hour + 0.5),
              }}
            />
          ))}

          {TIME_GRID_HOUR_LABELS.map((hour) => (
            <div
              key={`hour-${hour}`}
              className="pointer-events-none absolute right-0 left-0 border-t border-border/55"
              style={{ top: timeGridYFromHourFraction(hour) }}
            />
          ))}

          <div
            className="grid"
            style={{
              gridTemplateColumns: columns,
              height: TIME_GRID_SCROLL_HEIGHT_PX,
            }}
          >
            <div
              className="sticky left-0 z-10 border-r border-border/60 bg-card"
              style={{ height: TIME_GRID_SCROLL_HEIGHT_PX }}
            >
              {TIME_GRID_TIME_SLOTS.map((slot) => (
                <span
                  key={slot}
                  className={cn(
                    'absolute right-1.5 -translate-y-1/2 text-[10px] leading-none tabular-nums',
                    slot % 1 === 0
                      ? 'text-muted-foreground'
                      : 'text-muted-foreground/60',
                  )}
                  style={{ top: timeGridYFromHourFraction(slot) }}
                >
                  {formatTimelineLabel(slot)}
                </span>
              ))}
            </div>

            {days.map((day) => {
              const dayTasks = tasksForDay(tasks, day)

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'relative border-l border-border/60',
                    isToday(day) && 'bg-primary/[0.03]',
                  )}
                  style={{ height: TIME_GRID_SCROLL_HEIGHT_PX }}
                >
                  {dayTasks.map((task) => {
                    const interval = getTaskIntervalOnDay(task, day)
                    if (!interval) return null

                    const { top, height } = getTimeGridStyle(
                      interval.start,
                      interval.end,
                    )

                    return (
                      <div
                        key={`${task.id}-${day.toISOString()}`}
                        className={cn(
                          'absolute right-1 left-1 z-[1] overflow-hidden rounded-md border text-left shadow-sm',
                          'border-primary/25 bg-primary/15 hover:bg-primary/25',
                          task.completed && 'opacity-70',
                        )}
                        style={{
                          top,
                          height,
                          minHeight: '1.5rem',
                        }}
                      >
                        <TaskTimeBlock
                          task={task}
                          pending={pending}
                          onSelect={onTaskSelect}
                          onToggle={onToggle}
                        />
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
