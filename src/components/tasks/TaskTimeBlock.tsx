import { TaskBlockContextMenu } from '@/components/tasks/TaskBlockContextMenu'
import type { Task } from '@/lib/task-calendar'
import { cn } from '@/lib/utils'

type TaskTimeBlockProps = Readonly<{
  task: Task
  pending: boolean
  onSelect: (task: Task) => void
  onToggle: (task: Task, completed: boolean) => void
}>

export function TaskTimeBlock({
  task,
  pending,
  onSelect,
  onToggle,
}: TaskTimeBlockProps) {
  return (
    <TaskBlockContextMenu task={task} pending={pending} onToggle={onToggle}>
      <button
        type="button"
        disabled={pending}
        className={cn(
          'flex h-full min-h-0 w-full flex-col px-0.5 py-0.5 text-left',
          'cursor-pointer disabled:cursor-not-allowed disabled:opacity-60',
        )}
        onClick={() => onSelect(task)}
      >
        <span
          className={cn(
            'line-clamp-2 text-[11px] leading-tight font-medium sm:line-clamp-3 sm:text-xs',
            task.completed
              ? 'text-muted-foreground line-through'
              : 'text-foreground',
          )}
        >
          {task.title}
        </span>
      </button>
    </TaskBlockContextMenu>
  )
}
