import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { PageShell } from '@/components/PageShell'
import { CalendarPeriodTransition } from '@/components/tasks/CalendarPeriodTransition'
import { NewTaskDialog } from '@/components/tasks/NewTaskDialog'
import { TaskDetailDialog } from '@/components/tasks/TaskDetailDialog'
import { TasksCalendarToolbar } from '@/components/tasks/TasksCalendarToolbar'
import { TasksCalendarViews } from '@/components/tasks/TasksCalendarViews'
import { UnscheduledTasksPanel } from '@/components/tasks/UnscheduledTasksPanel'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { useEnterFromSettings } from '@/hooks/use-enter-from-settings'
import { useCalendarPeriodNavigation } from '@/hooks/use-calendar-period-navigation'
import { useTasksPageActions } from '@/hooks/use-tasks-page-actions'
import { PAGE_ENTER_CLASS } from '@/lib/page-transition'
import { partitionTasks } from '@/lib/task-calendar'
import { getTasksViewNavLabels } from '@/lib/tasks-view-labels'
import {
  tasksSearchSchema,
  useTasksUrlState,
} from '@/lib/tasks-search-params'
import { cn } from '@/lib/utils'
import { useFormatters } from '@/providers/AppPreferencesProvider'
import { listTasks } from '#/server/tasks'

export const Route = createFileRoute('/tasks')({
  validateSearch: tasksSearchSchema,
  beforeLoad: async () => {
    const { getSession } = await import('#/server/session')

    const session = await getSession()

    if (!session?.user) {
      throw redirect({
        to: '/signin',
        search: { redirect: '/tasks' },
      })
    }

    return { session }
  },

  loader: () => listTasks(),

  component: TasksPage,
})

function TasksPage() {
  const { t } = useTranslation(['tasks', 'errors'])
  const formatters = useFormatters()
  const router = useRouter()
  const taskList = Route.useLoaderData()
  const enterFromSettings = useEnterFromSettings(router)

  const {
    viewMode,
    setViewMode,
    selectedTaskId,
    viewDay,
    viewWeekStart,
    viewYear,
    viewMonth,
    goToPreviousPeriod,
    goToNextPeriod,
    setCalendarAnchor,
    openTaskId,
    closeTaskId,
  } = useTasksUrlState()

  const {
    periodKey,
    enterDirection,
    onPrevious,
    onNext,
    onViewModeChange,
    openDayView,
  } = useCalendarPeriodNavigation({
    viewMode,
    viewYear,
    viewMonth,
    viewWeekStart,
    viewDay,
    goToPreviousPeriod,
    goToNextPeriod,
    setViewMode,
    setCalendarAnchor,
  })

  const actions = useTasksPageActions({
    router,
    t,
    selectedTaskId,
    openTaskId,
    closeTaskId,
  })

  const { scheduled, unscheduled } = useMemo(
    () => partitionTasks(taskList),
    [taskList],
  )

  const selectedTask = useMemo(
    () =>
      selectedTaskId == null
        ? null
        : (taskList.find((task) => task.id === selectedTaskId) ?? null),
    [selectedTaskId, taskList],
  )

  const detailDialogOpen = selectedTask != null

  useEffect(() => {
    if (selectedTaskId != null && selectedTask == null) {
      closeTaskId()
    }
  }, [selectedTaskId, selectedTask, closeTaskId])

  const { periodTitle, previousLabel, nextLabel } = getTasksViewNavLabels(
    viewMode,
    t,
    formatters,
    { viewYear, viewMonth, viewWeekStart, viewDay },
  )

  const showPageError =
    Boolean(actions.error) && !actions.addDialogOpen && !detailDialogOpen

  let taskDetailError: string | null = null
  if (detailDialogOpen && !actions.addDialogOpen) {
    taskDetailError = actions.error
  }

  return (
    <PageShell
      full
      fluid
      className={cn(
        'px-2 py-2 sm:px-0 md:py-3',
        enterFromSettings && PAGE_ENTER_CLASS,
      )}
    >
      <TaskDetailDialog
        task={selectedTask}
        open={detailDialogOpen}
        onOpenChange={(open) => {
          if (!open) actions.closeTaskDetail()
        }}
        pending={actions.pending}
        error={taskDetailError}
        isEditing={actions.editingId === selectedTask?.id}
        editTitle={actions.editTitle}
        editStartAt={actions.editStartAt}
        editEndAt={actions.editEndAt}
        onStartEdit={() => {
          if (!selectedTask) return
          actions.startEdit(selectedTask)
        }}
        onSaveEdit={() => {
          const id = selectedTask?.id
          if (id == null) return
          actions.handleSaveEdit(id)
        }}
        onCancelEdit={actions.clearEditForm}
        onDelete={() => {
          const id = selectedTask?.id
          if (id == null) return
          actions.handleDelete(id)
        }}
        onEditTitleChange={actions.setEditTitle}
        onEditStartChange={actions.setEditStartAt}
        onEditEndChange={actions.setEditEndAt}
      />

      <NewTaskDialog
        open={actions.addDialogOpen}
        onOpenChange={actions.setAddDialogOpen}
        title={actions.newTitle}
        startAt={actions.newStartAt}
        endAt={actions.newEndAt}
        pending={actions.pending}
        error={actions.addDialogOpen ? actions.error : null}
        onTitleChange={actions.setNewTitle}
        onStartChange={actions.setNewStartAt}
        onEndChange={actions.setNewEndAt}
        onSubmit={actions.handleAdd}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden lg:flex-row lg:items-stretch lg:gap-4">
        <UnscheduledTasksPanel
          tasks={unscheduled}
          actions={actions.listActions}
          className="lg:self-stretch"
        />

        <Card className="flex min-h-0 min-w-0 flex-1 flex-col gap-0 overflow-hidden rounded-xl py-0">
          <CardContent className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-3 sm:gap-4 sm:p-4">
            {showPageError ? (
              <Alert variant="destructive" className="shrink-0">
                <AlertDescription>{actions.error}</AlertDescription>
              </Alert>
            ) : null}

            <TasksCalendarToolbar
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
              periodTitle={periodTitle}
              periodKey={periodKey}
              enterDirection={enterDirection}
              onPrevious={onPrevious}
              onNext={onNext}
              previousLabel={previousLabel}
              nextLabel={nextLabel}
              onAddTask={() => actions.setAddDialogOpen(true)}
            />

            <CalendarPeriodTransition
              periodKey={periodKey}
              enterDirection={enterDirection}
            >
              <TasksCalendarViews
                viewMode={viewMode}
                viewYear={viewYear}
                viewMonth={viewMonth}
                viewWeekStart={viewWeekStart}
                viewDay={viewDay}
                scheduledTasks={scheduled}
                actions={actions.listActions}
                onTaskSelect={actions.openTaskDetail}
                onDaySelect={openDayView}
              />
            </CalendarPeriodTransition>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
