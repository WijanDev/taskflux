import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'

import { Settings, Save, Loader2 } from 'lucide-react'

import type { SubmitEvent } from 'react'
import { useEffect, useState } from 'react'

import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { PageShell } from '@/components/PageShell'
import { DbReseedCard } from '@/components/settings/DbReseedCard'

import { Button } from '@/components/ui/button'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Label } from '@/components/ui/label'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { UserSettingsUpdate } from '#/lib/user-settings'
import {
  SUPPORTED_LOCALES,
  TIME_FORMATS,
  USER_THEME_MODES,
  isAppLocale,
  isTimeFormat,
  isUserThemeMode,
  toUserSettingsUpdate,
} from '#/lib/user-settings'

import {
  PAGE_EXIT_CLASS,
  PAGE_TRANSITION_MS,
  SETTINGS_SAVE_TOAST_MS,
  waitMs,
} from '@/lib/page-transition'
import { applyThemeMode } from '@/lib/theme'
import { cn } from '@/lib/utils'
import { useAppPreferences } from '@/providers/AppPreferencesProvider'
import { getUserSettings, updateUserSettings } from '#/server/user-settings'

export const Route = createFileRoute('/settings')({
  beforeLoad: async () => {
    const { getSession } = await import('#/server/session')

    const session = await getSession()

    if (!session?.user) {
      throw redirect({
        to: '/signin',
        search: { redirect: '/settings' },
      })
    }

    return { session }
  },
  loader: () => getUserSettings(),
  component: SettingsPage,
})

function SettingsPage() {
  const { t } = useTranslation(['settings', 'common'])
  const router = useRouter()
  const settingsRow = Route.useLoaderData()
  const initial = toUserSettingsUpdate(settingsRow)
  const { setPreferences } = useAppPreferences()

  const [form, setForm] = useState<UserSettingsUpdate>(initial)
  const [pending, setPending] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    applyThemeMode(initial.theme)
    globalThis.localStorage.setItem('theme', initial.theme)
  }, [initial.theme])

  function updateField<TKey extends keyof UserSettingsUpdate>(
    key: TKey,
    value: UserSettingsUpdate[TKey],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))

    if (key === 'theme') {
      const themeValue = String(value)
      if (!isUserThemeMode(themeValue)) {
        return
      }
      applyThemeMode(themeValue, { animate: true })
      globalThis.localStorage.setItem('theme', themeValue)
    }

    if (key === 'locale' || key === 'timeFormat') {
      setPreferences((prev) => ({ ...prev, [key]: value }))
    }
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    setPending(true)

    try {
      await updateUserSettings({ data: form })
      setPreferences(form)
      toast.success(t('toast.successTitle'), {
        description: t('toast.successDescription'),
      })
      await waitMs(SETTINGS_SAVE_TOAST_MS)
      setIsExiting(true)
      await waitMs(PAGE_TRANSITION_MS)
      await router.navigate({
        to: '/tasks',
        state: { fromSettingsSave: true },
      })
    } catch (err) {
      toast.error(t('toast.errorTitle'), {
        description:
          err instanceof Error ? err.message : t('toast.errorDescription'),
      })
      setPending(false)
    }
  }

  return (
    <PageShell comfortable className={cn(isExiting && PAGE_EXIT_CLASS)}>
      <div className="mb-8 flex items-center gap-3 md:mb-10">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Settings className="size-5" aria-hidden />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{t('languageRegion.title')}</CardTitle>
              <CardDescription>{t('languageRegion.description')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="settings-locale">{t('common:labels.language')}</Label>
              <Select
                value={form.locale}
                disabled={pending}
                onValueChange={(value) => {
                  if (isAppLocale(value)) {
                    updateField('locale', value)
                  }
                }}
              >
                <SelectTrigger id="settings-locale" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LOCALES.map((locale) => (
                    <SelectItem key={locale} value={locale}>
                      {t(`options.locale.${locale}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>{t('time.title')}</CardTitle>
            <CardDescription>{t('time.description')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="settings-time-format">{t('time.formatLabel')}</Label>
              <Select
                value={form.timeFormat}
                disabled={pending}
                onValueChange={(value) => {
                  if (isTimeFormat(value)) {
                    updateField('timeFormat', value)
                  }
                }}
              >
                <SelectTrigger id="settings-time-format" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_FORMATS.map((format) => (
                    <SelectItem key={format} value={format}>
                      {t(`options.timeFormat.${format}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full md:col-span-2 xl:col-span-1">
          <CardHeader>
            <CardTitle>{t('appearance.title')}</CardTitle>
            <CardDescription>{t('appearance.description')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="settings-theme">{t('appearance.themeLabel')}</Label>
              <Select
                value={form.theme}
                disabled={pending}
                onValueChange={(value) => {
                  if (isUserThemeMode(value)) {
                    updateField('theme', value)
                  }
                }}
              >
                <SelectTrigger id="settings-theme" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {USER_THEME_MODES.map((theme) => (
                    <SelectItem key={theme} value={theme}>
                      {t(`options.theme.${theme}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        </div>

        <DbReseedCard disabled={pending || isExiting} />

        <div className="flex justify-end border-t border-border pt-2 md:pt-4">
          <Button
            type="submit"
            size="icon"
            disabled={pending}
            aria-label={pending ? t('saving') : t('save')}
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Save className="size-4" aria-hidden />
            )}
          </Button>
        </div>
      </form>
    </PageShell>
  )
}
