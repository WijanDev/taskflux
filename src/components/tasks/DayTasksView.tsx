import { TimeGrid } from '@/components/tasks/TimeGrid'
import type { TaskListActions } from '@/components/tasks/TaskListItem'
import type { Task } from '@/lib/task-calendar'

type DayTasksViewProps = {
  day: Date
  scheduledTasks: Task[]
  actions: TaskListActions
  onTaskSelect: (task: Task) => void
}

export function DayTasksView({
  day,
  scheduledTasks,
  actions,
  onTaskSelect,
}: DayTasksViewProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
    <TimeGrid
      days={[day]}
      tasks={scheduledTasks}
      pending={actions.pending}
      onTaskSelect={onTaskSelect}
      onToggle={actions.onToggle}
    />
    </div>
  )
}
