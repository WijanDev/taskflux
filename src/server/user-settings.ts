import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'

import { userSettings } from '#/db/schema'
import {
  DEFAULT_USER_SETTINGS,
  parseUserSettingsUpdate,
  type UserSettingsUpdate,
} from '#/lib/user-settings'

import { requireUserId } from '#/server/auth'

async function db() {
  const { getDb } = await import('#/db/index.server')
  return getDb()
}

export const getUserSettings = createServerFn({ method: 'GET' }).handler(
  async () => {
    const userId = await requireUserId()
    const connection = await db()

    const [existing] = await connection
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))

    if (existing) {
      return existing
    }

    const now = new Date()
    const [created] = await connection
      .insert(userSettings)
      .values({
        userId,
        locale: DEFAULT_USER_SETTINGS.locale,
        timeFormat: DEFAULT_USER_SETTINGS.timeFormat,
        theme: DEFAULT_USER_SETTINGS.theme,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    return created
  },
)

export const updateUserSettings = createServerFn({ method: 'POST' })
  .inputValidator((data: UserSettingsUpdate) => parseUserSettingsUpdate(data))
  .handler(async ({ data }) => {
    const userId = await requireUserId()
    const connection = await db()
    const now = new Date()

    const [updated] = await connection
      .update(userSettings)
      .set({
        locale: data.locale,
        timeFormat: data.timeFormat,
        theme: data.theme,
        updatedAt: now,
      })
      .where(eq(userSettings.userId, userId))
      .returning()

    if (updated) {
      return updated
    }

    const [created] = await connection
      .insert(userSettings)
      .values({
        userId,
        locale: data.locale,
        timeFormat: data.timeFormat,
        theme: data.theme,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    return created
  })
