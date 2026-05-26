import { useRouter } from '@tanstack/react-router'
import { Database, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useIsAdmin } from '@/hooks/use-is-admin'
import { getDbReseedAccess, reseedDatabase } from '#/server/db-reseed'

type DbReseedCardProps = Readonly<{
  disabled?: boolean
}>

export function DbReseedCard({ disabled = false }: DbReseedCardProps) {
  const { t } = useTranslation(['settings', 'common'])
  const router = useRouter()
  const { isAdmin, isPending: isAdminPending } = useIsAdmin()
  const [canReseedDb, setCanReseedDb] = useState(false)
  const [accessChecked, setAccessChecked] = useState(false)
  const [reseedPending, setReseedPending] = useState(false)

  useEffect(() => {
    if (isAdminPending || !isAdmin) {
      setCanReseedDb(false)
      setAccessChecked(!isAdminPending)
      return
    }

    let cancelled = false
    setAccessChecked(false)

    getDbReseedAccess()
      .then((access) => {
        if (!cancelled) {
          setCanReseedDb(access.canReseedDb)
          setAccessChecked(true)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCanReseedDb(false)
          setAccessChecked(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [isAdmin, isAdminPending])

  if (!accessChecked || !canReseedDb) {
    return null
  }

  async function handleReseed() {
    const confirmed = globalThis.confirm(t('settings:dev.reseedConfirm'))
    if (!confirmed) {
      return
    }

    setReseedPending(true)
    try {
      const result = await reseedDatabase()
      toast.success(t('settings:dev.reseedSuccessTitle'), {
        description: t('settings:dev.reseedSuccessDescription', {
          users: result.usersCreated,
          tasks: result.tasksCreated,
          email: result.seedEmailPattern,
          password: result.seedPassword,
        }),
      })
      await router.invalidate()
    } catch (err) {
      toast.error(t('settings:dev.reseedErrorTitle'), {
        description:
          err instanceof Error
            ? err.message
            : t('settings:dev.reseedErrorDescription'),
      })
    } finally {
      setReseedPending(false)
    }
  }

  return (
    <Card className="border-destructive/30 md:col-span-2 xl:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="size-5 text-destructive" aria-hidden />
          {t('settings:dev.title')}
        </CardTitle>
        <CardDescription>{t('settings:dev.description')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">{t('settings:dev.hint')}</p>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          disabled={disabled || reseedPending}
          aria-label={
            reseedPending
              ? t('common:actions.pleaseWait')
              : t('settings:dev.reseedButton')
          }
          onClick={() => void handleReseed()}
        >
          {reseedPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Database className="size-4" aria-hidden />
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
