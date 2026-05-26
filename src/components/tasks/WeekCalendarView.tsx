import { TimeGrid } from '@/components/tasks/TimeGrid'
import type { TaskListActions } from '@/components/tasks/TaskListItem'
import type { Task } from '@/lib/task-calendar'
import { getWeekDays } from '@/lib/task-calendar'

type WeekCalendarViewProps = Readonly<{
  weekStart: Date
  scheduledTasks: Task[]
  actions: TaskListActions
  onTaskSelect: (task: Task) => void
}>

export function WeekCalendarView({
  weekStart,
  scheduledTasks,
  actions,
  onTaskSelect,
}: WeekCalendarViewProps) {
  const days = getWeekDays(weekStart)

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
    <TimeGrid
      days={days}
      tasks={scheduledTasks}
      pending={actions.pending}
      onTaskSelect={onTaskSelect}
      onToggle={actions.onToggle}
    />
    </div>
  )
}
