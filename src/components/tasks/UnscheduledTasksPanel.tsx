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

export function UnscheduledTasksPanel({
  tasks,
  actions,
  className,
}: UnscheduledTasksPanelProps) {
  return (
    <Card
      className={cn(
        'flex min-h-0 w-full shrink-0 flex-col gap-0 overflow-hidden py-0 lg:w-52 xl:w-56',
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
        {tasks.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No unscheduled tasks.
          </p>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {tasks.map((task) => (
              <TaskListItem key={task.id} task={task} actions={actions} compact />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
