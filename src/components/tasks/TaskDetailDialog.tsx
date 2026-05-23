import {
  CalendarRange,
  CheckCircle2,
  CircleDashed,
  Clock,
  Pencil,
  Sparkles,
  Trash2,
} from 'lucide-react'

import { TaskScheduleFields } from '@/components/TaskScheduleFields'
import {
  TaskDialogHeader,
  TaskMetaItem,
  TaskStatusBadge,
} from '@/components/tasks/TaskDialogChrome'
import type { Task } from '@/lib/task-calendar'
import { useFormatters } from '@/providers/AppPreferencesProvider'
import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type TaskDetailDialogProps = {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  pending: boolean
  error: string | null
  isEditing: boolean
  editTitle: string
  editStartAt: string
  editEndAt: string
  onStartEdit: () => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onDelete: () => void
  onEditTitleChange: (value: string) => void
  onEditStartChange: (value: string) => void
  onEditEndChange: (value: string) => void
}

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
  pending,
  error,
  isEditing,
  editTitle,
  editStartAt,
  editEndAt,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onEditTitleChange,
  onEditStartChange,
  onEditEndChange,
}: TaskDetailDialogProps) {
  const { t } = useTranslation(['tasks', 'common'])
  const { formatTaskRange, formatTaskTimestamp } = useFormatters()

  if (!task) {
    return null
  }

  const rangeLabel = formatTaskRange(task.taskStartAt, task.taskEndsAt)
  const hasSchedule = task.taskStartAt != null || task.taskEndsAt != null

  function handleClose() {
    if (isEditing) {
      onCancelEdit()
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
      <DialogContent onClose={handleClose}>
        {isEditing ? (
          <>
            <TaskDialogHeader
              icon={Pencil}
              title={t('tasks:edit.title')}
              description={t('tasks:edit.description')}
            />
            <DialogBody className="space-y-5">
              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
              <div className="grid gap-2.5">
                <Label htmlFor={`detail-edit-title-${task.id}`}>
                  {t('common:labels.title')}
                </Label>
                <Input
                  id={`detail-edit-title-${task.id}`}
                  type="text"
                  value={editTitle}
                  onChange={(e) => onEditTitleChange(e.target.value)}
                  disabled={pending}
                  className="h-10 bg-background/80"
                  autoFocus
                />
              </div>
              <TaskScheduleFields
                idPrefix={`detail-edit-${task.id}`}
                startValue={editStartAt}
                endValue={editEndAt}
                onStartChange={onEditStartChange}
                onEndChange={onEditEndChange}
                disabled={pending}
              />
            </DialogBody>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                disabled={pending}
                onClick={onCancelEdit}
              >
                {t('common:actions.cancel')}
              </Button>
              <Button
                type="button"
                disabled={pending || !editTitle.trim()}
                onClick={onSaveEdit}
              >
                {t('tasks:edit.saveChanges')}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <TaskDialogHeader
              icon={task.completed ? CheckCircle2 : Sparkles}
              title={task.title}
              titleClassName={cn(task.completed && 'text-muted-foreground')}
              badge={<TaskStatusBadge completed={task.completed} />}
              description={
                hasSchedule
                  ? (rangeLabel ?? undefined)
                  : t('tasks:schedule.none')
              }
            />
            <DialogBody className="space-y-5">
              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <TaskMetaItem
                  icon={task.completed ? CheckCircle2 : CircleDashed}
                  label={t('common:labels.status')}
                  value={
                    <span
                      className={cn(
                        task.completed && 'text-muted-foreground line-through',
                      )}
                    >
                      {task.completed
                        ? t('tasks:status.markedComplete')
                        : t('tasks:status.stillOpen')}
                    </span>
                  }
                />
                <TaskMetaItem
                  icon={CalendarRange}
                  label={t('common:labels.schedule')}
                  value={
                    rangeLabel ?? (
                      <span className="font-normal text-muted-foreground">
                        {t('tasks:unscheduledLabel')}
                      </span>
                    )
                  }
                  className={!hasSchedule ? 'sm:col-span-2' : undefined}
                />
                <TaskMetaItem
                  icon={Clock}
                  label={t('common:labels.created')}
                  value={formatTaskTimestamp(task.createdAt)}
                />
                <TaskMetaItem
                  icon={Clock}
                  label={t('common:labels.updated')}
                  value={formatTaskTimestamp(task.updatedAt)}
                />
              </div>
            </DialogBody>
            <DialogFooter className="gap-3 sm:justify-between">
              <Button
                type="button"
                variant="destructive"
                disabled={pending}
                onClick={onDelete}
              >
                <Trash2 className="size-4" />
                {t('common:actions.delete')}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bg-background/80"
                disabled={pending}
                onClick={onStartEdit}
              >
                <Pencil className="size-4" />
                {t('tasks:aria.editTask')}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
