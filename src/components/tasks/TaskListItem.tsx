import { Pencil, Trash2 } from 'lucide-react'

import { TaskScheduleFields } from '@/components/TaskScheduleFields'
import type { Task } from '@/lib/task-calendar'
import { toDatetimeLocalValue } from '@/lib/dates'
import { useFormatters } from '@/providers/AppPreferencesProvider'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation(['tasks', 'common'])
  const { formatTaskRange } = useFormatters()
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
            <Label htmlFor={`edit-title-${task.id}`}>{t('common:labels.title')}</Label>
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
              {t('common:actions.save')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={onCancelEdit}
            >
              {t('common:actions.cancel')}
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
          ? 'flex items-start gap-2 px-2.5 py-2'
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
          aria-label={
            task.completed
              ? t('tasks:aria.markIncomplete')
              : t('tasks:aria.markComplete')
          }
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
          className={compact ? 'size-8' : undefined}
          disabled={pending}
          onClick={() => onStartEdit(task)}
          aria-label={t('tasks:aria.editTask')}
        >
          <Pencil className={compact ? 'size-4' : 'size-3.5'} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            compact ? 'size-8' : undefined,
            'text-destructive hover:bg-destructive/10 hover:text-destructive',
          )}
          disabled={pending}
          onClick={() => onDelete(task.id)}
          aria-label={t('tasks:aria.deleteTask')}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </li>
  )
}
