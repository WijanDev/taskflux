import { ChevronDown } from 'lucide-react'

import {
  TaskListItem,
  type TaskListActions,
} from '@/components/tasks/TaskListItem'
import type { Task } from '@/lib/task-calendar'
import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type UnscheduledTasksPanelProps = {
  tasks: Task[]
  actions: TaskListActions
  className?: string
}

function TaskListContent({
  tasks,
  actions,
}: {
  tasks: Task[]
  actions: TaskListActions
}) {
  if (tasks.length === 0) {
    return (
      <p className="py-2 text-center text-sm text-muted-foreground">
        No unscheduled tasks.
      </p>
    )
  }

  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {tasks.map((task) => (
        <TaskListItem key={task.id} task={task} actions={actions} compact />
      ))}
    </ul>
  )
}

export function UnscheduledTasksPanel({
  tasks,
  actions,
  className,
}: UnscheduledTasksPanelProps) {
  const countLabel =
    tasks.length === 0
      ? 'No tasks'
      : tasks.length === 1
        ? '1 task'
        : `${tasks.length} tasks`

  return (
    <>
      {/* Mobile: collapsible panel */}
      <details
        className={cn(
          'group w-full shrink-0 overflow-hidden rounded-xl border border-border/70 bg-card lg:hidden',
          className,
        )}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 marker:content-none [&::-webkit-details-marker]:hidden">
          <div className="min-w-0 text-left">
            <span className="text-sm font-semibold">Unscheduled</span>
            <p className="text-xs text-muted-foreground">
              {countLabel} · no start or end time
            </p>
          </div>
          <ChevronDown
            className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <div className="max-h-40 overflow-y-auto border-t border-border/60 px-3 py-3">
          <TaskListContent tasks={tasks} actions={actions} />
        </div>
      </details>

      {/* Desktop: sidebar */}
      <Card
        className={cn(
          'hidden min-h-0 w-full shrink-0 flex-col gap-0 overflow-hidden py-0 lg:flex lg:w-52 xl:w-56',
          className,
        )}
      >
        <CardHeader className="border-b border-border/60 px-4 py-3">
          <CardTitle className="text-sm">Unscheduled</CardTitle>
          <p className="text-xs text-muted-foreground">
            No start or end time
          </p>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          <TaskListContent tasks={tasks} actions={actions} />
        </CardContent>
      </Card>
    </>
  )
}
