import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'

import { Settings } from 'lucide-react'

import { useEffect, useState } from 'react'

import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { PageShell } from '@/components/PageShell'

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

import {
  SUPPORTED_LOCALES,
  TIME_FORMATS,
  USER_THEME_MODES,
  toUserSettingsUpdate,
  type UserSettingsUpdate,
} from '#/lib/user-settings'

import {
  PAGE_EXIT_CLASS,
  PAGE_TRANSITION_MS,
  SETTINGS_SAVE_TOAST_MS,
  waitMs,
  type SettingsSaveNavigationState,
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
    window.localStorage.setItem('theme', initial.theme)
  }, [initial.theme])

  function updateField<K extends keyof UserSettingsUpdate>(
    key: K,
    value: UserSettingsUpdate[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))

    if (key === 'theme') {
      applyThemeMode(value, { animate: true })
      window.localStorage.setItem('theme', value)
    }

    if (key === 'locale' || key === 'timeFormat') {
      setPreferences((prev) => ({ ...prev, [key]: value }))
    }
  }

  async function handleSubmit(event: React.FormEvent) {
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
        state: { fromSettingsSave: true } satisfies SettingsSaveNavigationState,
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
    <PageShell narrow className={cn(isExiting && PAGE_EXIT_CLASS)}>
      <div className="mb-8 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Settings className="size-5" aria-hidden />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Card>
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
                onValueChange={(value) =>
                  updateField('locale', value as UserSettingsUpdate['locale'])
                }
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

        <Card>
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
                onValueChange={(value) =>
                  updateField(
                    'timeFormat',
                    value as UserSettingsUpdate['timeFormat'],
                  )
                }
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

        <Card>
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
                onValueChange={(value) =>
                  updateField('theme', value as UserSettingsUpdate['theme'])
                }
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

        <div className="flex justify-end">
          <Button type="submit" disabled={pending}>
            {pending ? t('saving') : t('save')}
          </Button>
        </div>
      </form>
    </PageShell>
  )
}
