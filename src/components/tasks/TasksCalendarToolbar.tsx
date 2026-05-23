import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { CalendarNav } from '@/components/tasks/CalendarNav'
import { TasksViewModeMenu } from '@/components/tasks/TasksViewModeMenu'
import { Button } from '@/components/ui/button'
import type { CalendarNavDirection } from '@/hooks/use-calendar-period-navigation'
import type { TasksViewMode } from '@/lib/task-calendar'

type TasksCalendarToolbarProps = {
  viewMode: TasksViewMode
  onViewModeChange: (mode: TasksViewMode) => void
  periodTitle: string
  periodKey: string
  enterDirection?: CalendarNavDirection | null
  onPrevious: () => void
  onNext: () => void
  previousLabel: string
  nextLabel: string
  onAddTask: () => void
}

export function TasksCalendarToolbar({
  viewMode,
  onViewModeChange,
  periodTitle,
  periodKey,
  enterDirection = null,
  onPrevious,
  onNext,
  previousLabel,
  nextLabel,
  onAddTask,
}: TasksCalendarToolbarProps) {
  const { t } = useTranslation('tasks')

  return (
    <>
      <div className="flex shrink-0 flex-col gap-2.5 md:hidden">
        <div className="flex items-center justify-between gap-2">
          <TasksViewModeMenu value={viewMode} onChange={onViewModeChange} compact />
          <Button
            type="button"
            size="icon"
            aria-label={t('toolbar.addTask')}
            onClick={onAddTask}
          >
            <Plus className="size-5" />
          </Button>
        </div>
        <CalendarNav
          title={periodTitle}
          periodKey={periodKey}
          enterDirection={enterDirection}
          onPrevious={onPrevious}
          onNext={onNext}
          previousLabel={previousLabel}
          nextLabel={nextLabel}
          className="w-full"
        />
      </div>

      <div className="relative z-30 hidden shrink-0 items-center gap-3 overflow-visible md:flex">
        <TasksViewModeMenu value={viewMode} onChange={onViewModeChange} />
        <div className="flex min-w-0 flex-1 justify-center">
          <CalendarNav
            title={periodTitle}
            periodKey={periodKey}
            enterDirection={enterDirection}
            onPrevious={onPrevious}
            onNext={onNext}
            previousLabel={previousLabel}
            nextLabel={nextLabel}
          />
        </div>
        <Button
          type="button"
          size="icon"
          aria-label={t('toolbar.addTask')}
          onClick={onAddTask}
        >
          <Plus className="size-5" />
        </Button>
      </div>
    </>
  )
}
