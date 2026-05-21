import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'

import { tasks } from '#/db/schema'

async function db() {
  const { getDb } = await import('#/db/index.server')
  return getDb()
}

export const listTasks = createServerFn({ method: 'GET' }).handler(async () => {
  return (await db()).select().from(tasks).orderBy(desc(tasks.createdAt))
})

export const createTask = createServerFn({ method: 'POST' })
  .inputValidator((data: { title: string }) => {
    const title = data.title?.trim()
    if (!title) throw new Error('Title is required')
    return { title }
  })
  .handler(async ({ data }) => {
    const [task] = await (await db())
      .insert(tasks)
      .values({
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
    const connection = await db()
    await connection
      .update(tasks)
      .set({ title: data.title })
      .where(eq(tasks.id, data.id))

    const [task] = await connection
      .select()
      .from(tasks)
      .where(eq(tasks.id, data.id))
    return task
  })

export const setTaskCompleted = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: number; completed: boolean }) => {
    if (!Number.isInteger(data.id)) throw new Error('Invalid task id')
    return { id: data.id, completed: data.completed }
  })
  .handler(async ({ data }) => {
    const connection = await db()
    await connection
      .update(tasks)
      .set({ completed: data.completed })
      .where(eq(tasks.id, data.id))

    const [task] = await connection
      .select()
      .from(tasks)
      .where(eq(tasks.id, data.id))
    return task
  })

export const deleteTask = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: number }) => {
    if (!Number.isInteger(data.id)) throw new Error('Invalid task id')
    return { id: data.id }
  })
  .handler(async ({ data }) => {
    await (await db()).delete(tasks).where(eq(tasks.id, data.id))
    return { id: data.id }
  })
