import { Plus } from 'lucide-react'

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <form onSubmit={onSubmit}>
          <TaskDialogHeader
            icon={Plus}
            title="New task"
            description="Give it a title and optional start and end times."
          />

          <DialogBody className="space-y-5">
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <div className="grid gap-2.5">
              <Label htmlFor="new-task-title">Title</Label>
              <Input
                id="new-task-title"
                type="text"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="What do you need to do?"
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
              Cancel
            </Button>
            <Button type="submit" disabled={pending || !title.trim()}>
              <Plus className="size-4" />
              Add task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
