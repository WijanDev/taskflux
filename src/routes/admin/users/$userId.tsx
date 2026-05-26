import { useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, Loader2, Save, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

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
import { useAdminUserDetail } from '@/hooks/use-admin-user-detail'
import { ensureAdminRouteAccess } from '@/lib/admin-route'
import { adminUsersQueryKeys } from '@/lib/admin-users-queries'
import { APP_ROLES, ROLE_LABELS, isAppRole } from '@/lib/roles'
import type { AppRole } from '@/lib/roles'
import { useFormatters } from '@/providers/AppPreferencesProvider'
import { setUserRole } from '#/server/user-roles'

export const Route = createFileRoute('/admin/users/$userId')({
  beforeLoad: async ({ params }) => {
    await ensureAdminRouteAccess(`/admin/users/${params.userId}`)
  },
  component: AdminUserDetailPage,
})

function AdminUserDetailPage() {
  const { t } = useTranslation(['admin', 'common'])
  const { userId } = Route.useParams()
  const queryClient = useQueryClient()
  const { formatTaskTimestamp } = useFormatters()
  const { data: user, isPending, error, isError } = useAdminUserDetail(userId)
  const [draftRole, setDraftRole] = useState<AppRole | null>(null)
  const [savePending, setSavePending] = useState(false)

  useEffect(() => {
    if (user) {
      setDraftRole(user.role)
    }
  }, [user])

  if (!isPending && (isError || !user)) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'User not found' || !user) {
      throw notFound()
    }

    return (
      <PageShell wide className="py-6 md:py-8">
        <p className="px-6 text-sm text-destructive md:px-8" role="alert">
          {message || t('admin:userDetail.loadFailed')}
        </p>
      </PageShell>
    )
  }

  const role = draftRole ?? user?.role
  const unchanged = user && role === user.role

  async function handleSaveRole() {
    if (!user || !role) {
      return
    }

    setSavePending(true)
    try {
      await setUserRole({ data: { userId: user.id, role } })
      toast.success(t('admin:toast.roleUpdated'))
      await queryClient.invalidateQueries({ queryKey: adminUsersQueryKeys.all })
    } catch (err) {
      const raw =
        err instanceof Error ? err.message : t('admin:toast.roleUpdateFailed')
      const toastMessage =
        raw === 'Cannot remove the last admin'
          ? t('admin:toast.lastAdmin')
          : raw
      toast.error(toastMessage)
    } finally {
      setSavePending(false)
    }
  }

  if (isPending || !user || !role) {
    return (
      <PageShell wide className="flex items-center justify-center py-16">
        <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden />
        <span className="sr-only">{t('admin:userDetail.loading')}</span>
      </PageShell>
    )
  }

  const roleUpdatedLabel = user.roleUpdatedAt
    ? formatTaskTimestamp(user.roleUpdatedAt)
    : t('admin:users.roleNeverSet')

  return (
    <PageShell wide className="py-6 md:py-8">
      <div className="mb-6 px-6 md:px-8">
        <Button variant="ghost" size="sm" className="-ml-2 gap-2" asChild>
          <Link to="/admin/users">
            <ArrowLeft className="size-4" aria-hidden />
            {t('admin:userDetail.backToUsers')}
          </Link>
        </Button>
      </div>

      <div className="mb-8 flex items-center gap-3 px-6 md:px-8">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <User className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight md:text-3xl">
            {user.name}
          </h1>
          <p className="mt-2 truncate text-sm text-muted-foreground md:text-base">
            {user.email}
          </p>
        </div>
      </div>

      <div className="grid gap-6 px-6 md:px-8 lg:grid-cols-[1fr_minmax(0,22rem)]">
        <Card>
          <CardHeader>
            <CardTitle>{t('admin:userDetail.profileTitle')}</CardTitle>
            <CardDescription>{t('admin:userDetail.profileDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailItem label={t('admin:users.columns.name')} value={user.name} />
              <DetailItem label={t('admin:users.columns.email')} value={user.email} />
              <DetailItem
                label={t('admin:userDetail.emailVerified')}
                value={
                  user.emailVerified
                    ? t('admin:userDetail.yes')
                    : t('admin:userDetail.no')
                }
              />
              <DetailItem
                label={t('admin:users.columns.joined')}
                value={formatTaskTimestamp(user.createdAt)}
              />
              <DetailItem
                label={t('admin:userDetail.accountUpdated')}
                value={formatTaskTimestamp(user.updatedAt)}
              />
              <DetailItem
                label={t('admin:users.columns.roleUpdated')}
                value={roleUpdatedLabel}
              />
              <DetailItem
                label={t('admin:userDetail.userId')}
                value={user.id}
                mono
              />
            </dl>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin:userDetail.tasksTitle')}</CardTitle>
              <CardDescription>
                {t('admin:userDetail.tasksDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums">{user.taskCount}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t('admin:userDetail.taskCountLabel', { count: user.taskCount })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('admin:userDetail.roleTitle')}</CardTitle>
              <CardDescription>{t('admin:userDetail.roleDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="admin-user-role">{t('admin:users.roleLabel')}</Label>
                <Select
                  value={role}
                  onValueChange={(value) => {
                    if (isAppRole(value)) {
                      setDraftRole(value)
                    }
                  }}
                >
                  <SelectTrigger id="admin-user-role" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {APP_ROLES.map((appRole) => (
                      <SelectItem key={appRole} value={appRole}>
                        {t(`admin:roles.${appRole}`, {
                          defaultValue: ROLE_LABELS[appRole],
                        })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                className="w-full gap-2"
                disabled={unchanged || savePending}
                onClick={() => void handleSaveRole()}
              >
                {savePending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Save className="size-4" aria-hidden />
                )}
                {savePending
                  ? t('admin:users.savingRole')
                  : t('admin:userDetail.saveRole')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {user.history.length > 0 && (
        <Card className="mx-6 mt-6 md:mx-8">
          <CardHeader>
            <CardTitle>{t('admin:userDetail.historyTitle')}</CardTitle>
            <CardDescription>{t('admin:userDetail.historyDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border text-sm">
              {user.history.map((entry) => (
                <li
                  key={entry.id}
                  className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-medium">
                    {t(`admin:roles.${entry.role}`, {
                      defaultValue: entry.label,
                    })}
                  </span>
                  <span className="text-muted-foreground">
                    {formatTaskTimestamp(entry.effectiveAt)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </PageShell>
  )
}

type DetailItemProps = Readonly<{
  label: string
  value: string
  mono?: boolean
}>

function DetailItem({ label, value, mono = false }: DetailItemProps) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className={mono ? 'mt-1 truncate font-mono text-sm' : 'mt-1 truncate text-sm'}>
        {value}
      </dd>
    </div>
  )
}
