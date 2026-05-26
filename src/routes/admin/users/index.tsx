import { createFileRoute } from '@tanstack/react-router'
import { Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AdminUsersTable } from '@/components/admin/AdminUsersTable'
import { PageShell } from '@/components/PageShell'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/admin/users/')({
  component: AdminUsersPage,
})

function AdminUsersPage() {
  const { t } = useTranslation(['admin', 'common'])

  return (
    <PageShell wide fluid className="flex min-h-0 flex-1 flex-col py-6 md:py-8">
      <header className="mb-6 flex shrink-0 items-center gap-3 px-6 md:mb-8 md:px-8">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Users className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {t('admin:title')}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            {t('admin:description')}
          </p>
        </div>
      </header>

      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden py-0">
        <CardHeader className="shrink-0 gap-1 border-b border-border/60 p-0 px-6 pt-4 pb-3 md:px-8">
          <CardTitle>{t('admin:users.title')}</CardTitle>
          <CardDescription className="max-w-3xl">
            {t('admin:users.listDescription')}
          </CardDescription>
        </CardHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <AdminUsersTable />
        </div>
      </Card>
    </PageShell>
  )
}
