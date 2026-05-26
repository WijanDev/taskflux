import type { TFunction } from 'i18next'
import type { SubmitEvent } from 'react'
import { useState } from 'react'

import type { tasks } from '#/db/schema'
import {
  createTask,
  deleteTask,
  setTaskCompleted,
  updateTask,
} from '#/server/tasks'
import type { TaskListActions } from '@/components/tasks/TaskListItem'
import { toDatetimeLocalValue } from '@/lib/dates'
import type { AppRouter } from '@/router'

type Task = typeof tasks.$inferSelect

type UseTasksPageActionsOptions = Readonly<{
  router: AppRouter
  t: TFunction<['errors']>
  selectedTaskId: number | null
  openTaskId: (id: number) => void
  closeTaskId: () => void
}>

export function useTasksPageActions({
  router,
  t,
  selectedTaskId,
  openTaskId,
  closeTaskId,
}: UseTasksPageActionsOptions) {
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
      setError(err instanceof Error ? err.message : t('errors:generic'))
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

  function openTaskDetail(task: Task) {
    clearEditForm()
    openTaskId(task.id)
  }

  function closeTaskDetail() {
    clearEditForm()
    closeTaskId()
  }

  async function handleAdd(e: SubmitEvent) {
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

  return {
    newTitle,
    setNewTitle,
    newStartAt,
    setNewStartAt,
    newEndAt,
    setNewEndAt,
    editTitle,
    setEditTitle,
    editStartAt,
    setEditStartAt,
    editEndAt,
    setEditEndAt,
    editingId,
    pending,
    error,
    addDialogOpen,
    setAddDialogOpen,
    listActions,
    handleAdd,
    openTaskDetail,
    closeTaskDetail,
    clearEditForm,
    startEdit,
    handleSaveEdit,
    handleDelete,
  }
}
