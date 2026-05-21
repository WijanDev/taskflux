import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'

import type { tasks } from '#/db/schema'
import {
  createTask,
  deleteTask,
  listTasks,
  setTaskCompleted,
  updateTask,
} from '#/server/tasks'

export const Route = createFileRoute('/tasks')({
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

  async function handleToggle(task: Task) {
    await runAction(() =>
      setTaskCompleted({ data: { id: task.id, completed: !task.completed } }),
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
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rise-in rounded-[2rem] px-6 py-8 sm:px-10">
        <p className="island-kicker mb-2">TaskFlux</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-[var(--sea-ink)]">
          Tasks
        </h1>

        <form onSubmit={handleAdd} className="mb-6 flex flex-wrap gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New task..."
            disabled={pending}
            className="min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-white/60 px-4 py-2.5 text-[var(--sea-ink)] outline-none focus:border-[rgba(50,143,151,0.5)]"
          />
          <button
            type="submit"
            disabled={pending || !newTitle.trim()}
            className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] transition hover:bg-[rgba(79,184,178,0.24)] disabled:opacity-50"
          >
            Add
          </button>
        </form>

        {error ? (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {taskList.length === 0 ? (
          <p className="text-sm text-[var(--sea-ink-soft)]">
            No tasks yet. Add one above.
          </p>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {taskList.map((task) => (
              <li
                key={task.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--line)] bg-white/40 px-4 py-3"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  disabled={pending}
                  onChange={() => handleToggle(task)}
                  className="h-4 w-4 accent-[var(--lagoon-deep)]"
                  aria-label={
                    task.completed ? 'Mark incomplete' : 'Mark complete'
                  }
                />

                {editingId === task.id ? (
                  <>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      disabled={pending}
                      className="min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-white/80 px-3 py-1.5 text-[var(--sea-ink)] outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => handleSaveEdit(task.id)}
                      className="text-sm font-semibold text-[var(--lagoon-deep)]"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => {
                        setEditingId(null)
                        setEditTitle('')
                      }}
                      className="text-sm text-[var(--sea-ink-soft)]"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      className={`min-w-0 flex-1 text-[var(--sea-ink)] ${task.completed ? 'line-through opacity-60' : ''}`}
                    >
                      {task.title}
                    </span>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => startEdit(task)}
                      className="text-sm font-semibold text-[var(--lagoon-deep)]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => handleDelete(task.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
