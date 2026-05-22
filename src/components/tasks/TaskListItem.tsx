import { Pencil, Trash2 } from 'lucide-react'

import { TaskScheduleFields } from '@/components/TaskScheduleFields'
import type { Task } from '@/lib/task-calendar'
import { formatTaskRange, toDatetimeLocalValue } from '@/lib/dates'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export type TaskListActions = {
  pending: boolean
  editingId: number | null
  editTitle: string
  editStartAt: string
  editEndAt: string
  onToggle: (task: Task, checked: boolean) => void
  onStartEdit: (task: Task) => void
  onSaveEdit: (id: number) => void
  onCancelEdit: () => void
  onDelete: (id: number) => void
  onEditTitleChange: (value: string) => void
  onEditStartChange: (value: string) => void
  onEditEndChange: (value: string) => void
}

type TaskListItemProps = {
  task: Task
  actions: TaskListActions
  compact?: boolean
}

export function TaskListItem({ task, actions, compact = false }: TaskListItemProps) {
  const {
    pending,
    editingId,
    editTitle,
    editStartAt,
    editEndAt,
    onToggle,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onDelete,
    onEditTitleChange,
    onEditStartChange,
    onEditEndChange,
  } = actions

  const rangeLabel = formatTaskRange(task.taskStartAt, task.taskEndsAt)
  const isEditing = editingId === task.id

  if (isEditing) {
    return (
      <li
        className={cn(
          'rounded-lg border border-border/80 px-3 py-4 transition-colors',
          compact ? '' : 'md:px-4',
        )}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor={`edit-title-${task.id}`}>Title</Label>
            <Input
              id={`edit-title-${task.id}`}
              type="text"
              value={editTitle}
              onChange={(e) => onEditTitleChange(e.target.value)}
              disabled={pending}
              autoFocus
            />
          </div>
          <TaskScheduleFields
            idPrefix={`edit-${task.id}`}
            startValue={editStartAt}
            endValue={editEndAt}
            onStartChange={onEditStartChange}
            onEndChange={onEditEndChange}
            disabled={pending}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              disabled={pending}
              onClick={() => onSaveEdit(task.id)}
            >
              Save
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={onCancelEdit}
            >
              Cancel
            </Button>
          </div>
        </div>
      </li>
    )
  }

  return (
    <li
      className={cn(
        'rounded-lg border border-border/80 transition-colors hover:border-primary/20 hover:bg-accent/30',
        task.completed && 'bg-muted/30',
        compact
          ? 'flex items-start gap-2 px-2 py-1.5'
          : [
              'flex items-center gap-3 px-3 py-3',
              'md:grid md:grid-cols-[2.5rem_1fr_6.5rem] md:items-center md:gap-4 md:px-4 md:py-3.5',
            ],
      )}
    >
      <div
        className={cn(
          'flex shrink-0 items-center',
          !compact && 'md:justify-center',
        )}
      >
        <Checkbox
          checked={task.completed}
          disabled={pending}
          onCheckedChange={(checked) => onToggle(task, checked === true)}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        />
      </div>

      <div className="min-w-0 flex-1">
        <span
          className={cn(
            'block',
            compact ? 'text-xs leading-snug' : 'text-sm md:text-base',
            task.completed
              ? 'text-muted-foreground line-through'
              : 'text-foreground',
          )}
        >
          {task.title}
        </span>
        {rangeLabel && !compact ? (
          <span className="mt-1 block text-xs text-muted-foreground">
            {rangeLabel}
          </span>
        ) : null}
      </div>

      <div className={cn('flex shrink-0 gap-0.5', compact ? '' : 'justify-end')}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={compact ? 'size-7' : undefined}
          disabled={pending}
          onClick={() => onStartEdit(task)}
          aria-label="Edit task"
        >
          <Pencil className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            compact ? 'size-7' : undefined,
            'text-destructive hover:bg-destructive/10 hover:text-destructive',
          )}
          disabled={pending}
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </li>
  )
}
