import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

import type { tasks } from '#/db/schema'
import { PageShell } from '@/components/PageShell'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  createTask,
  deleteTask,
  listTasks,
  setTaskCompleted,
  updateTask,
} from '#/server/tasks'

export const Route = createFileRoute('/tasks')({
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
  const [newTitle, setNewTitle] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const completedCount = taskList.filter((t) => t.completed).length

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

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const title = newTitle.trim()
    if (!title) return
    await runAction(async () => {
      await createTask({ data: { title } })
      setNewTitle('')
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
      await updateTask({ data: { id, title } })
      setEditingId(null)
      setEditTitle('')
    })
  }

  async function handleDelete(id: number) {
    await runAction(() => deleteTask({ data: { id } }))
  }

  function startEdit(task: Task) {
    setEditingId(task.id)
    setEditTitle(task.title)
  }

  return (
    <PageShell full className="py-8 md:py-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
        <aside className="shrink-0 lg:w-52">
          <div className="lg:sticky lg:top-24">
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Tasks
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {taskList.length === 0
                ? 'Nothing here yet.'
                : `${completedCount} of ${taskList.length} done`}
            </p>
          </div>
        </aside>

        <Card className="min-w-0 flex-1">
          <CardHeader className="border-b border-border/60 pb-6">
            <CardTitle className="text-lg lg:sr-only">Your tasks</CardTitle>
            <CardDescription className="lg:sr-only">
              Add and manage tasks for your account.
            </CardDescription>
            <form
              onSubmit={handleAdd}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="What do you need to do?"
                disabled={pending}
                className="h-10 flex-1 text-base sm:h-11"
              />
              <Button
                type="submit"
                disabled={pending || !newTitle.trim()}
                className="shrink-0 sm:px-8"
              >
                Add task
              </Button>
            </form>
          </CardHeader>

          <CardContent className="space-y-4 pt-6">
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            {taskList.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No tasks yet. Add one above.
              </p>
            ) : (
              <>
                <div
                  className="hidden gap-4 px-4 text-xs font-medium tracking-wide text-muted-foreground uppercase md:grid md:grid-cols-[2.5rem_1fr_6.5rem]"
                  aria-hidden
                >
                  <span>Done</span>
                  <span>Task</span>
                  <span className="text-right">Actions</span>
                </div>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {taskList.map((task) => (
                    <li
                      key={task.id}
                      className={cn(
                        'rounded-lg border border-border/80 transition-colors',
                        editingId === task.id
                          ? 'px-3 py-3 md:px-4 md:py-4'
                          : [
                              'flex items-center gap-3 px-3 py-3',
                              'md:grid md:grid-cols-[2.5rem_1fr_6.5rem] md:items-center md:gap-4 md:px-4 md:py-3.5',
                            ],
                        'hover:border-primary/20 hover:bg-accent/30',
                        task.completed && editingId !== task.id && 'bg-muted/30',
                      )}
                    >
                      {editingId === task.id ? (
                        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
                          <Input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            disabled={pending}
                            className="flex-1"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                void handleSaveEdit(task.id)
                              }
                              if (e.key === 'Escape') {
                                setEditingId(null)
                                setEditTitle('')
                              }
                            }}
                          />
                          <div className="flex shrink-0 gap-2">
                            <Button
                              type="button"
                              size="sm"
                              disabled={pending}
                              onClick={() => handleSaveEdit(task.id)}
                            >
                              Save
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={pending}
                              onClick={() => {
                                setEditingId(null)
                                setEditTitle('')
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                      <div className="flex shrink-0 items-center md:justify-center">
                        <Checkbox
                          checked={task.completed}
                          disabled={pending}
                          onCheckedChange={(checked) =>
                            handleToggle(task, checked === true)
                          }
                          aria-label={
                            task.completed
                              ? 'Mark incomplete'
                              : 'Mark complete'
                          }
                        />
                      </div>

                          <span
                            className={cn(
                              'min-w-0 flex-1 text-sm md:text-base',
                              task.completed
                                ? 'text-muted-foreground line-through'
                                : 'text-foreground',
                            )}
                          >
                            {task.title}
                          </span>
                          <div className="flex shrink-0 justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={pending}
                              onClick={() => startEdit(task)}
                              aria-label="Edit task"
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={pending}
                              onClick={() => handleDelete(task.id)}
                              aria-label="Delete task"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
