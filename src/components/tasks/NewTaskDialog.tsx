import { Plus, X, Loader2 } from 'lucide-react'
import type { SubmitEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { TaskScheduleFields } from '@/components/TaskScheduleFields'
import { TaskDialogHeader } from '@/components/tasks/TaskDialogChrome'
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

type NewTaskDialogProps = Readonly<{
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  startAt: string
  endAt: string
  pending: boolean
  error: string | null
  onTitleChange: (value: string) => void
  onStartChange: (value: string) => void
  onEndChange: (value: string) => void
  onSubmit: (e: SubmitEvent) => void
}>

export function NewTaskDialog({
  open,
  onOpenChange,
  title,
  startAt,
  endAt,
  pending,
  error,
  onTitleChange,
  onStartChange,
  onEndChange,
  onSubmit,
}: NewTaskDialogProps) {
  const { t } = useTranslation(['tasks', 'common'])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <form onSubmit={onSubmit}>
          <TaskDialogHeader
            icon={Plus}
            title={t('tasks:new.title')}
            description={t('tasks:new.description')}
          />

          <DialogBody className="space-y-5">
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <div className="grid gap-2.5">
              <Label htmlFor="new-task-title">{t('common:labels.title')}</Label>
              <Input
                id="new-task-title"
                type="text"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder={t('tasks:new.titlePlaceholder')}
                disabled={pending}
                className="h-10 bg-background/80"
                autoFocus
              />
            </div>

            <TaskScheduleFields
              idPrefix="new"
              startValue={startAt}
              endValue={endAt}
              onStartChange={onStartChange}
              onEndChange={onEndChange}
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
              onClick={() => onOpenChange(false)}
            >
              <X className="size-4" aria-hidden />
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={pending || !title.trim()}
              aria-label={
                pending ? t('common:actions.pleaseWait') : t('tasks:new.submit')
              }
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Plus className="size-4" aria-hidden />
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
