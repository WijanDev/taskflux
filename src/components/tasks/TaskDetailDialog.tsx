import {

  CalendarRange,

  CheckCircle2,

  CircleDashed,

  Clock,

  Loader2,

  Pencil,

  Save,

  Sparkles,

  Trash2,

  X,

} from 'lucide-react'

import { useTranslation } from 'react-i18next'



import { TaskScheduleFields } from '@/components/TaskScheduleFields'

import {

  TaskDialogHeader,

  TaskMetaItem,

  TaskStatusBadge,

} from '@/components/tasks/TaskDialogChrome'

import type { Task } from '@/lib/task-calendar'

import { useFormatters } from '@/providers/AppPreferencesProvider'

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



type TaskDetailDialogProps = Readonly<{

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

}>



type TaskDetailPanelProps = Readonly<{

  task: Task

  pending: boolean

  error: string | null

}>



type TaskDetailEditPanelProps = TaskDetailPanelProps &

  Readonly<{

    editTitle: string

    editStartAt: string

    editEndAt: string

    onCancelEdit: () => void

    onSaveEdit: () => void

    onEditTitleChange: (value: string) => void

    onEditStartChange: (value: string) => void

    onEditEndChange: (value: string) => void

  }>



type TaskDetailViewPanelProps = TaskDetailPanelProps &

  Readonly<{

    onStartEdit: () => void

    onDelete: () => void

  }>



function TaskDetailErrorAlert({ error }: Readonly<{ error: string | null }>) {

  if (!error) return null



  return (

    <Alert variant="destructive">

      <AlertDescription>{error}</AlertDescription>

    </Alert>

  )

}



function TaskDetailEditPanel({

  task,

  pending,

  error,

  editTitle,

  editStartAt,

  editEndAt,

  onCancelEdit,

  onSaveEdit,

  onEditTitleChange,

  onEditStartChange,

  onEditEndChange,

}: TaskDetailEditPanelProps) {

  const { t } = useTranslation(['tasks', 'common'])



  return (

    <>

      <TaskDialogHeader

        icon={Pencil}

        title={t('tasks:edit.title')}

        description={t('tasks:edit.description')}

      />

      <DialogBody className="space-y-5">

        <TaskDetailErrorAlert error={error} />

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

          size="icon"

          disabled={pending}

          aria-label={t('common:actions.cancel')}

          onClick={onCancelEdit}

        >

          <X className="size-4" aria-hidden />

        </Button>

        <Button

          type="button"

          size="icon"

          disabled={pending || !editTitle.trim()}

          aria-label={

            pending

              ? t('common:actions.pleaseWait')

              : t('tasks:edit.saveChanges')

          }

          onClick={onSaveEdit}

        >

          {pending ? (

            <Loader2 className="size-4 animate-spin" aria-hidden />

          ) : (

            <Save className="size-4" aria-hidden />

          )}

        </Button>

      </DialogFooter>

    </>

  )

}



function TaskDetailViewPanel({

  task,

  pending,

  error,

  onStartEdit,

  onDelete,

}: TaskDetailViewPanelProps) {

  const { t } = useTranslation(['tasks', 'common'])

  const { formatTaskRange, formatTaskTimestamp } = useFormatters()



  const rangeLabel = formatTaskRange(task.taskStartAt, task.taskEndsAt)

  const hasSchedule = task.taskStartAt != null || task.taskEndsAt != null



  return (

    <>

      <TaskDialogHeader

        icon={task.completed ? CheckCircle2 : Sparkles}

        title={task.title}

        titleClassName={cn(task.completed && 'text-muted-foreground')}

        badge={<TaskStatusBadge completed={task.completed} />}

        description={

          hasSchedule ? (rangeLabel ?? undefined) : t('tasks:schedule.none')

        }

      />

      <DialogBody className="space-y-5">

        <TaskDetailErrorAlert error={error} />



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

            className={hasSchedule ? undefined : 'sm:col-span-2'}

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

          size="icon"

          disabled={pending}

          aria-label={t('common:actions.delete')}

          onClick={onDelete}

        >

          <Trash2 className="size-4" aria-hidden />

        </Button>

        <Button

          type="button"

          variant="outline"

          size="icon"

          className="bg-background/80"

          disabled={pending}

          aria-label={t('tasks:aria.editTask')}

          onClick={onStartEdit}

        >

          <Pencil className="size-4" aria-hidden />

        </Button>

      </DialogFooter>

    </>

  )

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



  function handleClose() {

    if (isEditing) {

      onCancelEdit()

    }

    onOpenChange(false)

  }



  const panelProps = { task, pending, error }



  return (

    <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>

      <DialogContent onClose={handleClose}>

        {isEditing ? (

          <TaskDetailEditPanel

            {...panelProps}

            editTitle={editTitle}

            editStartAt={editStartAt}

            editEndAt={editEndAt}

            onCancelEdit={onCancelEdit}

            onSaveEdit={onSaveEdit}

            onEditTitleChange={onEditTitleChange}

            onEditStartChange={onEditStartChange}

            onEditEndChange={onEditEndChange}

          />

        ) : (

          <TaskDetailViewPanel

            {...panelProps}

            onStartEdit={onStartEdit}

            onDelete={onDelete}

          />

        )}

      </DialogContent>

    </Dialog>

  )

}

