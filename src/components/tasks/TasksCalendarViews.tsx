import { DayTasksView } from '@/components/tasks/DayTasksView'
import { MonthCalendarView } from '@/components/tasks/MonthCalendarView'
import type { TaskListActions } from '@/components/tasks/TaskListItem'
import { WeekCalendarView } from '@/components/tasks/WeekCalendarView'
import type { Task, TasksViewMode } from '@/lib/task-calendar'

type TasksCalendarViewsProps = Readonly<{
  viewMode: TasksViewMode
  viewYear: number
  viewMonth: number
  viewWeekStart: Date
  viewDay: Date
  scheduledTasks: Task[]
  actions: TaskListActions
  onTaskSelect: (task: Task) => void
  onDaySelect: (day: Date) => void
}>

export function TasksCalendarViews({
  viewMode,
  viewYear,
  viewMonth,
  viewWeekStart,
  viewDay,
  scheduledTasks,
  actions,
  onTaskSelect,
  onDaySelect,
}: TasksCalendarViewsProps) {
  if (viewMode === 'monthly') {
    return (
      <MonthCalendarView
        year={viewYear}
        month={viewMonth}
        scheduledTasks={scheduledTasks}
        actions={actions}
        onTaskSelect={onTaskSelect}
        onDaySelect={onDaySelect}
      />
    )
  }

  if (viewMode === 'weekly') {
    return (
      <WeekCalendarView
        weekStart={viewWeekStart}
        scheduledTasks={scheduledTasks}
        actions={actions}
        onTaskSelect={onTaskSelect}
      />
    )
  }

  return (
    <DayTasksView
      day={viewDay}
      scheduledTasks={scheduledTasks}
      actions={actions}
      onTaskSelect={onTaskSelect}
    />
  )
}
