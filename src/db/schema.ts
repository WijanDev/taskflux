import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { user } from './auth-schema'

export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  taskStartAt: integer('task_start_at', { mode: 'timestamp_ms' }),
  taskEndsAt: integer('task_ends_at', { mode: 'timestamp_ms' }),
})

export * from './auth-schema'
export * from './user-settings-schema'