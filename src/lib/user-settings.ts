import type { userSettings } from '#/db/user-settings-schema'
import type { ThemeMode } from '@/lib/theme'

export const SUPPORTED_LOCALES = ['en', 'es'] as const
export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export const TIME_FORMATS = ['12h', '24h'] as const
export type TimeFormat = (typeof TIME_FORMATS)[number]

export const USER_THEME_MODES = ['light', 'dark', 'auto'] as const
export type UserThemeMode = ThemeMode

export type UserSettings = typeof userSettings.$inferSelect
export type NewUserSettings = typeof userSettings.$inferInsert

export type UserSettingsUpdate = {
  locale: AppLocale
  timeFormat: TimeFormat
  theme: UserThemeMode
}

export const DEFAULT_USER_SETTINGS: UserSettingsUpdate = {
  locale: 'en',
  timeFormat: '12h',
  theme: 'auto',
}

export function isAppLocale(value: string): value is AppLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

export function isTimeFormat(value: string): value is TimeFormat {
  return (TIME_FORMATS as readonly string[]).includes(value)
}

export function isUserThemeMode(value: string): value is UserThemeMode {
  return (USER_THEME_MODES as readonly string[]).includes(value)
}

export function parseUserSettingsUpdate(data: UserSettingsUpdate): UserSettingsUpdate {
  if (!isAppLocale(data.locale)) {
    throw new TypeError('Invalid language')
  }
  if (!isTimeFormat(data.timeFormat)) {
    throw new TypeError('Invalid time format')
  }
  if (!isUserThemeMode(data.theme)) {
    throw new TypeError('Invalid theme')
  }
  return data
}

export function toUserSettingsUpdate(row: UserSettings): UserSettingsUpdate {
  return {
    locale: isAppLocale(row.locale) ? row.locale : DEFAULT_USER_SETTINGS.locale,
    timeFormat: isTimeFormat(row.timeFormat)
      ? row.timeFormat
      : DEFAULT_USER_SETTINGS.timeFormat,
    theme: isUserThemeMode(row.theme) ? row.theme : DEFAULT_USER_SETTINGS.theme,
  }
}
