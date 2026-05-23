import { TaskTimeBlock } from '@/components/tasks/TaskTimeBlock'
import { WeekdayLabel } from '@/components/tasks/WeekdayLabel'
import { useFormatters } from '@/providers/AppPreferencesProvider'
import {
  getTaskIntervalOnDay,
  getTimeGridStyle,
  isToday,
  tasksForDay,
  TIME_GRID_HOUR_LABELS,
  TIME_GRID_HOURS,
  TIME_GRID_SCROLL_HEIGHT_PX,
  TIME_GRID_TIME_SLOTS,
  timeGridYFromHourFraction,
  type Task,
} from '@/lib/task-calendar'
import { cn } from '@/lib/utils'

const HALF_HOUR_INDICES = Array.from({ length: TIME_GRID_HOURS }, (_, i) => i)

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
  const { formatTimelineLabel } = useFormatters()
  const columnCount = days.length
  const showWeekdayHeaders = columnCount > 1
  const isWeekView = columnCount > 1
  const gutterClass = 'w-11 shrink-0 sm:w-[4.25rem]'

  const scrollContent = (
    <>
      {showWeekdayHeaders ? (
        <div
          className="sticky top-0 z-20 grid shrink-0 border-b border-border/60 bg-card [--time-gutter:2.75rem] sm:[--time-gutter:4.25rem]"
          style={{
            gridTemplateColumns: `var(--time-gutter) repeat(${columnCount}, minmax(3.25rem, 1fr))`,
          }}
        >
          <div />
          {days.map((day, index) => (
            <div
              key={day.toISOString()}
              className={cn(
                'border-l border-border/60 px-0.5 py-1.5 text-center sm:px-2 sm:py-2',
                isToday(day) && 'bg-primary/5',
              )}
            >
              <WeekdayLabel
                index={index}
                className="block text-[10px] font-medium tracking-wide text-muted-foreground uppercase sm:text-xs"
              />
              <span
                className={cn(
                  'mt-0.5 block text-xs font-semibold tabular-nums sm:text-sm',
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
          className="sticky top-0 z-20 grid shrink-0 border-b border-border/60 bg-card [--time-gutter:2.75rem] sm:[--time-gutter:4.25rem]"
          style={{
            gridTemplateColumns: `var(--time-gutter) minmax(0, 1fr)`,
          }}
        >
          <div />
          <div
            className={cn(
              'border-l border-border/60 px-2 py-2 text-center text-sm font-semibold sm:text-base',
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
          className="grid [--time-gutter:2.75rem] sm:[--time-gutter:4.25rem]"
          style={{
            gridTemplateColumns: isWeekView
              ? `var(--time-gutter) repeat(${columnCount}, minmax(3.25rem, 1fr))`
              : `var(--time-gutter) minmax(0, 1fr)`,
            height: TIME_GRID_SCROLL_HEIGHT_PX,
          }}
        >
          <div
            className={cn(
              'sticky left-0 z-10 border-r border-border/60 bg-card',
              gutterClass,
            )}
            style={{ height: TIME_GRID_SCROLL_HEIGHT_PX }}
          >
            {TIME_GRID_TIME_SLOTS.map((slot) => (
              <span
                key={slot}
                className={cn(
                  'absolute right-1 -translate-y-1/2 text-[9px] leading-none tabular-nums sm:right-1.5 sm:text-[10px]',
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
                        'absolute right-0.5 left-0.5 z-[1] overflow-hidden rounded-md border text-left shadow-sm sm:right-1 sm:left-1',
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
    </>
  )

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div
        className={cn(
          'min-h-0 flex-1 overscroll-contain',
          isWeekView
            ? 'overflow-x-auto overflow-y-auto [scrollbar-gutter:stable]'
            : 'overflow-y-auto [scrollbar-gutter:stable]',
        )}
      >
        <div
          className={cn(
            'flex h-full min-h-0 flex-col',
            isWeekView && 'min-w-[36rem] sm:min-w-0',
          )}
        >
          {scrollContent}
        </div>
      </div>
    </div>
  )
}
