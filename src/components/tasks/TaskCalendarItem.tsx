import { TaskBlockContextMenu } from '@/components/tasks/TaskBlockContextMenu'
import type { Task } from '@/lib/task-calendar'
import { useFormatters } from '@/providers/AppPreferencesProvider'
import { cn } from '@/lib/utils'

type TaskCalendarItemProps = {
  task: Task
  pending: boolean
  onSelect: (task: Task) => void
  onToggle: (task: Task, completed: boolean) => void
  className?: string
  scheduleTimeClassName?: string
  titleClassName?: string
}

export function TaskCalendarItem({
  task,
  pending,
  onSelect,
  onToggle,
  className,
  scheduleTimeClassName,
  titleClassName,
}: TaskCalendarItemProps) {
  const { formatTaskTimeRange } = useFormatters()
  const scheduleLabel = formatTaskTimeRange(task.taskStartAt, task.taskEndsAt)

  return (
    <li>
      <TaskBlockContextMenu task={task} pending={pending} onToggle={onToggle}>
        <button
          type="button"
          disabled={pending}
          className={cn(
            'flex w-full min-w-0 cursor-pointer flex-col items-start gap-0.5 rounded-sm px-1 py-1 text-left leading-snug transition-colors',
            'hover:bg-accent/60 disabled:cursor-not-allowed disabled:opacity-60',
            className,
          )}
          onClick={() => onSelect(task)}
        >
          {scheduleLabel ? (
            <span
              className={cn(
                'w-full text-left text-[10px] text-muted-foreground tabular-nums',
                task.completed && 'line-through opacity-80',
                scheduleTimeClassName,
              )}
            >
              {scheduleLabel}
            </span>
          ) : null}
          <span
            className={cn(
              'w-full text-left text-[11px] leading-snug sm:text-xs',
              task.completed
                ? 'text-muted-foreground line-through'
                : 'text-foreground',
              titleClassName,
            )}
          >
            {task.title}
          </span>
        </button>
      </TaskBlockContextMenu>
    </li>
  )
}
