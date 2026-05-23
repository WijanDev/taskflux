import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { PageShell } from '@/components/PageShell'
import { Button } from '@/components/ui/button'

export function NotFound() {
  const { t } = useTranslation()

  return (
    <PageShell narrow className="py-16 md:py-20">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">
          {t('notFound:eyebrow')}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {t('notFound:title')}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          {t('notFound:description')}
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button asChild>
            <Link to="/">{t('common:actions.backToHome')}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/tasks">{t('common:actions.openTasks')}</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  )
}
