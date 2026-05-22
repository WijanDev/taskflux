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
import {
  formatTaskRange,
  formatTaskTimestamp,
} from '@/lib/dates'
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
              title="Edit task"
              description="Update the title or schedule for this task."
            />
            <DialogBody className="space-y-5">
              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
              <div className="grid gap-2.5">
                <Label htmlFor={`detail-edit-title-${task.id}`}>Title</Label>
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
                Cancel
              </Button>
              <Button
                type="button"
                disabled={pending || !editTitle.trim()}
                onClick={onSaveEdit}
              >
                Save changes
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
                  : 'No schedule — add times when editing.'
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
                  label="Status"
                  value={
                    <span
                      className={cn(
                        task.completed && 'text-muted-foreground line-through',
                      )}
                    >
                      {task.completed ? 'Marked complete' : 'Still open'}
                    </span>
                  }
                />
                <TaskMetaItem
                  icon={CalendarRange}
                  label="Schedule"
                  value={
                    rangeLabel ?? (
                      <span className="font-normal text-muted-foreground">
                        Unscheduled
                      </span>
                    )
                  }
                  className={!hasSchedule ? 'sm:col-span-2' : undefined}
                />
                <TaskMetaItem
                  icon={Clock}
                  label="Created"
                  value={formatTaskTimestamp(task.createdAt)}
                />
                <TaskMetaItem
                  icon={Clock}
                  label="Updated"
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
                Delete
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bg-background/80"
                disabled={pending}
                onClick={onStartEdit}
              >
                <Pencil className="size-4" />
                Edit task
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
