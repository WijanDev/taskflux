import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

import { readLocaleFromCookie } from '@/lib/i18n/cookies'
import {
  DEFAULT_USER_SETTINGS,
  toUserSettingsUpdate,
  type UserSettingsUpdate,
} from '#/lib/user-settings'

import { getUserSettings } from '#/server/user-settings'

export const getAppPreferences = createServerFn({ method: 'GET' }).handler(
  async (): Promise<UserSettingsUpdate> => {
    const { getSession } = await import('#/server/session')
    const session = await getSession()

    if (session?.user) {
      const row = await getUserSettings()
      return toUserSettingsUpdate(row)
    }

    const cookieHeader = getRequestHeaders().get('cookie')
    const locale = readLocaleFromCookie(cookieHeader)

    if (locale) {
      return { ...DEFAULT_USER_SETTINGS, locale }
    }

    return DEFAULT_USER_SETTINGS
  },
)
