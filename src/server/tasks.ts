import { createServerFn } from '@tanstack/react-start'
import { and, desc, eq } from 'drizzle-orm'

import { tasks } from '#/db/schema'

import { requireUserId } from '#/server/auth'

async function db() {
  const { getDb } = await import('#/db/index.server')
  return getDb()
}

export const listTasks = createServerFn({ method: 'GET' }).handler(async () => {
  const userId = await requireUserId()
  return (await db())
    .select()
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .orderBy(desc(tasks.createdAt))
})

export const createTask = createServerFn({ method: 'POST' })
  .inputValidator((data: { title: string }) => {
    const title = data.title?.trim()
    if (!title) throw new Error('Title is required')
    return { title }
  })
  .handler(async ({ data }) => {
    const userId = await requireUserId()
    const [task] = await (await db())
      .insert(tasks)
      .values({
        userId,
        title: data.title,
        completed: false,
        createdAt: new Date(),
      })
      .returning()
    return task
  })

export const updateTask = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: number; title: string }) => {
    const title = data.title?.trim()
    if (!title) throw new Error('Title is required')
    if (!Number.isInteger(data.id)) throw new Error('Invalid task id')
    return { id: data.id, title }
  })
  .handler(async ({ data }) => {
    const userId = await requireUserId()
    const connection = await db()
    await connection
      .update(tasks)
      .set({ title: data.title })
      .where(and(eq(tasks.id, data.id), eq(tasks.userId, userId)))

    const [task] = await connection
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, data.id), eq(tasks.userId, userId)))

    if (!task) throw new Error('Task not found')
    return task
  })

export const setTaskCompleted = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: number; completed: boolean }) => {
    if (!Number.isInteger(data.id)) throw new Error('Invalid task id')
    return { id: data.id, completed: data.completed }
  })
  .handler(async ({ data }) => {
    const userId = await requireUserId()
    const connection = await db()
    await connection
      .update(tasks)
      .set({ completed: data.completed })
      .where(and(eq(tasks.id, data.id), eq(tasks.userId, userId)))

    const [task] = await connection
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, data.id), eq(tasks.userId, userId)))

    if (!task) throw new Error('Task not found')
    return task
  })

export const deleteTask = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: number }) => {
    if (!Number.isInteger(data.id)) throw new Error('Invalid task id')
    return { id: data.id }
  })
  .handler(async ({ data }) => {
    const userId = await requireUserId()
    const deleted = await (await db())
      .delete(tasks)
      .where(and(eq(tasks.id, data.id), eq(tasks.userId, userId)))
      .returning({ id: tasks.id })

    if (deleted.length === 0) throw new Error('Task not found')
    return { id: data.id }
  })
