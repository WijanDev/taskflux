import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { user } from './auth-schema'

export const userRole = sqliteTable('user_role', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
})

export const userRoleHistory = sqliteTable('user_role_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  effectiveAt: integer('effective_at', { mode: 'timestamp_ms' }).notNull(),
  changedByUserId: text('changed_by_user_id').references(() => user.id, {
    onDelete: 'set null',
  }),
  note: text('note'),
})

export type UserRoleRow = typeof userRole.$inferSelect
export type UserRoleHistoryRow = typeof userRoleHistory.$inferSelect
