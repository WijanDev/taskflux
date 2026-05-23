import { Plus } from 'lucide-react'
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

type NewTaskDialogProps = {
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
  onSubmit: (e: React.FormEvent) => void
}

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
              disabled={pending}
              onClick={() => onOpenChange(false)}
            >
              {t('common:actions.cancel')}
            </Button>
            <Button type="submit" disabled={pending || !title.trim()}>
              <Plus className="size-4" />
              {t('tasks:new.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
