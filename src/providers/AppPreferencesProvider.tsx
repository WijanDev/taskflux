import type { ReactNode } from 'react'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

import '@/lib/i18n'
import type { AppFormatters } from '@/lib/formatting'
import { createFormatters } from '@/lib/formatting'
import { readGuestLocale, persistLocale } from '@/lib/i18n/cookies'
import type { UserSettingsUpdate } from '#/lib/user-settings'

type AppPreferencesContextValue = {
  preferences: UserSettingsUpdate
  setPreferences: (
    value: UserSettingsUpdate | ((prev: UserSettingsUpdate) => UserSettingsUpdate),
  ) => void
  formatters: AppFormatters
}

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(
  null,
)

type AppPreferencesProviderProps = Readonly<{
  initial: UserSettingsUpdate
  children: ReactNode
}>

export function AppPreferencesProvider({
  initial,
  children,
}: AppPreferencesProviderProps) {
  const { i18n, t } = useTranslation()
  const [preferences, setPreferences] = useState<UserSettingsUpdate>(initial)

  useEffect(() => {
    const guestLocale = readGuestLocale()
    if (guestLocale !== preferences.locale) {
      setPreferences((prev) => ({ ...prev, locale: guestLocale }))
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = preferences.locale
    i18n.changeLanguage(preferences.locale).catch(() => {})
    persistLocale(preferences.locale)
  }, [preferences.locale, i18n])

  const formatters = useMemo(
    () => createFormatters(preferences.locale, preferences.timeFormat, t),
    [preferences.locale, preferences.timeFormat, t, i18n.language],
  )

  const value = useMemo(
    () => ({ preferences, setPreferences, formatters }),
    [preferences, formatters],
  )

  return (
    <AppPreferencesContext.Provider value={value}>
      {children}
    </AppPreferencesContext.Provider>
  )
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext)
  if (!context) {
    throw new Error('useAppPreferences must be used within AppPreferencesProvider')
  }
  return context
}

export function useFormatters() {
  return useAppPreferences().formatters
}
