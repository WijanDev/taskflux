import {
  DEFAULT_USER_SETTINGS,
  isAppLocale,
  type AppLocale,
} from '#/lib/user-settings'

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
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale};path=/;max-age=31536000;SameSite=Lax`
}

export function readGuestLocale(): AppLocale {
  if (typeof window === 'undefined') {
    return DEFAULT_USER_SETTINGS.locale
  }
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  if (stored && isAppLocale(stored)) {
    return stored
  }
  return readLocaleFromCookie(document.cookie) ?? DEFAULT_USER_SETTINGS.locale
}
