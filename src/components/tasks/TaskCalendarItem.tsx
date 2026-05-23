import { TaskBlockContextMenu } from '@/components/tasks/TaskBlockContextMenu'
import type { Task } from '@/lib/task-calendar'
import { cn } from '@/lib/utils'

type TaskCalendarItemProps = {
  task: Task
  pending: boolean
  onSelect: (task: Task) => void
  onToggle: (task: Task, completed: boolean) => void
}

export function TaskCalendarItem({
  task,
  pending,
  onSelect,
  onToggle,
}: TaskCalendarItemProps) {
  return (
    <li>
      <TaskBlockContextMenu task={task} pending={pending} onToggle={onToggle}>
        <button
          type="button"
          disabled={pending}
          className={cn(
            'w-full cursor-pointer truncate rounded-sm px-1 py-1 text-left text-[11px] leading-snug transition-colors sm:py-0.5 sm:text-xs',
            'hover:bg-accent/60 disabled:cursor-not-allowed disabled:opacity-60',
            task.completed
              ? 'text-muted-foreground line-through'
              : 'text-foreground',
          )}
          onClick={() => onSelect(task)}
        >
          {task.title}
        </button>
      </TaskBlockContextMenu>
    </li>
  )
}
