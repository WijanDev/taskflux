import type { AppLocale } from '#/lib/user-settings'
import { DEFAULT_USER_SETTINGS, isAppLocale } from '#/lib/user-settings'
import { isBrowser } from '@/lib/runtime'

export const LOCALE_STORAGE_KEY = 'taskflux-locale'
export const LOCALE_COOKIE_NAME = 'taskflux_locale'

export function readLocaleFromCookie(cookieHeader: string | null): AppLocale | null {
  if (!cookieHeader) {
    return null
  }
  const match = new RegExp(`${LOCALE_COOKIE_NAME}=([^;]+)`).exec(cookieHeader)
  const value = match?.[1]?.trim()
  if (value && isAppLocale(value)) {
    return value
  }
  return null
}

export function persistLocale(locale: AppLocale) {
  if (!isBrowser()) {
    return
  }
  globalThis.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale};path=/;max-age=31536000;SameSite=Lax`
}

export function readGuestLocale(): AppLocale {
  if (!isBrowser()) {
    return DEFAULT_USER_SETTINGS.locale
  }
  const stored = globalThis.localStorage.getItem(LOCALE_STORAGE_KEY)
  if (stored && isAppLocale(stored)) {
    return stored
  }
  return readLocaleFromCookie(document.cookie) ?? DEFAULT_USER_SETTINGS.locale
}
