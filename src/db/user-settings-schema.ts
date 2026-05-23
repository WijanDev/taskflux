import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { user } from './auth-schema'

export const userSettings = sqliteTable('user_settings', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  locale: text('locale').notNull().default('en'),
  timeFormat: text('time_format').notNull().default('12h'),
  theme: text('theme').notNull().default('auto'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
})
