import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'

import type { tasks } from '#/db/schema'
import { PageShell } from '@/components/PageShell'
import { NewTaskDialog } from '@/components/tasks/NewTaskDialog'
import { TaskDetailDialog } from '@/components/tasks/TaskDetailDialog'
import { DayTasksView } from '@/components/tasks/DayTasksView'
import { MonthCalendarView } from '@/components/tasks/MonthCalendarView'
import type { TaskListActions } from '@/components/tasks/TaskListItem'
import { TasksCalendarToolbar } from '@/components/tasks/TasksCalendarToolbar'
import { UnscheduledTasksPanel } from '@/components/tasks/UnscheduledTasksPanel'
import { WeekCalendarView } from '@/components/tasks/WeekCalendarView'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { toDatetimeLocalValue } from '@/lib/dates'
import {
  formatDayTitle,
  formatMonthYear,
  formatWeekRange,
  partitionTasks,
} from '@/lib/task-calendar'
import {
  tasksSearchSchema,
  useTasksUrlState,
} from '@/lib/tasks-search-params'
import {
  createTask,
  deleteTask,
  listTasks,
  setTaskCompleted,
  updateTask,
} from '#/server/tasks'

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

type Task = typeof tasks.$inferSelect

function TasksPage() {
  const router = useRouter()
  const taskList = Route.useLoaderData()

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
    openTaskId,
    closeTaskId,
  } = useTasksUrlState()

  const [newTitle, setNewTitle] = useState('')
  const [newStartAt, setNewStartAt] = useState('')
  const [newEndAt, setNewEndAt] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editStartAt, setEditStartAt] = useState('')
  const [editEndAt, setEditEndAt] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const { scheduled, unscheduled } = useMemo(
    () => partitionTasks(taskList),
    [taskList],
  )

  const selectedTask = useMemo(
    () =>
      selectedTaskId == null
        ? null
        : (taskList.find((t) => t.id === selectedTaskId) ?? null),
    [selectedTaskId, taskList],
  )

  const detailDialogOpen = selectedTask != null

  useEffect(() => {
    if (selectedTaskId != null && selectedTask == null) {
      closeTaskId()
    }
  }, [selectedTaskId, selectedTask, closeTaskId])

  function openTaskDetail(task: Task) {
    clearEditForm()
    openTaskId(task.id)
  }

  function closeTaskDetail() {
    clearEditForm()
    closeTaskId()
  }

  async function refresh() {
    await router.invalidate()
  }

  async function runAction(action: () => Promise<unknown>) {
    setPending(true)
    setError(null)
    try {
      await action()
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setPending(false)
    }
  }

  function clearNewForm() {
    setNewTitle('')
    setNewStartAt('')
    setNewEndAt('')
  }

  function clearEditForm() {
    setEditingId(null)
    setEditTitle('')
    setEditStartAt('')
    setEditEndAt('')
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const title = newTitle.trim()
    if (!title) return
    await runAction(async () => {
      await createTask({
        data: {
          title,
          taskStartAt: newStartAt || null,
          taskEndsAt: newEndAt || null,
        },
      })
      clearNewForm()
      setAddDialogOpen(false)
    })
  }

  async function handleToggle(task: Task, checked: boolean) {
    await runAction(() =>
      setTaskCompleted({ data: { id: task.id, completed: checked } }),
    )
  }

  async function handleSaveEdit(id: number) {
    const title = editTitle.trim()
    if (!title) return
    await runAction(async () => {
      await updateTask({
        data: {
          id,
          title,
          taskStartAt: editStartAt || null,
          taskEndsAt: editEndAt || null,
        },
      })
      clearEditForm()
    })
  }

  async function handleDelete(id: number) {
    await runAction(async () => {
      await deleteTask({ data: { id } })
      if (selectedTaskId === id) {
        closeTaskDetail()
      }
    })
  }

  function startEdit(task: Task) {
    setEditingId(task.id)
    setEditTitle(task.title)
    setEditStartAt(toDatetimeLocalValue(task.taskStartAt))
    setEditEndAt(toDatetimeLocalValue(task.taskEndsAt))
  }

  const listActions: TaskListActions = {
    pending,
    editingId,
    editTitle,
    editStartAt,
    editEndAt,
    onToggle: handleToggle,
    onStartEdit: startEdit,
    onSaveEdit: handleSaveEdit,
    onCancelEdit: clearEditForm,
    onDelete: handleDelete,
    onEditTitleChange: setEditTitle,
    onEditStartChange: setEditStartAt,
    onEditEndChange: setEditEndAt,
  }

  const periodTitle =
    viewMode === 'monthly'
      ? formatMonthYear(viewYear, viewMonth)
      : viewMode === 'weekly'
        ? formatWeekRange(viewWeekStart)
        : formatDayTitle(viewDay)

  const previousLabel =
    viewMode === 'monthly'
      ? 'Previous month'
      : viewMode === 'weekly'
        ? 'Previous week'
        : 'Previous day'

  const nextLabel =
    viewMode === 'monthly'
      ? 'Next month'
      : viewMode === 'weekly'
        ? 'Next week'
        : 'Next day'

  return (
    <PageShell full fluid className="px-2 py-2 sm:px-0 md:py-3">
      <TaskDetailDialog
        task={selectedTask}
        open={detailDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeTaskDetail()
        }}
        pending={pending}
        error={detailDialogOpen && !addDialogOpen ? error : null}
        isEditing={selectedTask != null && editingId === selectedTask.id}
        editTitle={editTitle}
        editStartAt={editStartAt}
        editEndAt={editEndAt}
        onStartEdit={() => selectedTask && startEdit(selectedTask)}
        onSaveEdit={() => selectedTask && handleSaveEdit(selectedTask.id)}
        onCancelEdit={clearEditForm}
        onDelete={() => selectedTask && handleDelete(selectedTask.id)}
        onEditTitleChange={setEditTitle}
        onEditStartChange={setEditStartAt}
        onEditEndChange={setEditEndAt}
      />

      <NewTaskDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        title={newTitle}
        startAt={newStartAt}
        endAt={newEndAt}
        pending={pending}
        error={addDialogOpen ? error : null}
        onTitleChange={setNewTitle}
        onStartChange={setNewStartAt}
        onEndChange={setNewEndAt}
        onSubmit={handleAdd}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden lg:flex-row lg:items-stretch lg:gap-4">
        <UnscheduledTasksPanel
          tasks={unscheduled}
          actions={listActions}
          className="lg:self-stretch"
        />

        <Card className="flex min-h-0 min-w-0 flex-1 flex-col gap-0 overflow-hidden rounded-xl py-0">
          <CardContent className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-3 sm:gap-4 sm:p-4">
            {error && !addDialogOpen && !detailDialogOpen ? (
              <Alert variant="destructive" className="shrink-0">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <TasksCalendarToolbar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              periodTitle={periodTitle}
              onPrevious={goToPreviousPeriod}
              onNext={goToNextPeriod}
              previousLabel={previousLabel}
              nextLabel={nextLabel}
              onAddTask={() => setAddDialogOpen(true)}
            />

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              {viewMode === 'monthly' ? (
                <MonthCalendarView
                  year={viewYear}
                  month={viewMonth}
                  scheduledTasks={scheduled}
                  actions={listActions}
                  onTaskSelect={openTaskDetail}
                />
              ) : null}

              {viewMode === 'weekly' ? (
                <WeekCalendarView
                  weekStart={viewWeekStart}
                  scheduledTasks={scheduled}
                  actions={listActions}
                  onTaskSelect={openTaskDetail}
                />
              ) : null}

              {viewMode === 'daily' ? (
                <DayTasksView
                  day={viewDay}
                  scheduledTasks={scheduled}
                  actions={listActions}
                  onTaskSelect={openTaskDetail}
                />
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
