import { useTranslation } from 'react-i18next'

import { Container } from '@/components/Container'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="shrink-0 border-t border-border/60 py-8">
      <Container
        fluid
        className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center"
      >
        <p className="m-0 text-sm text-muted-foreground">
          &copy; {year} {t('common:appName')}
        </p>
        <p className="m-0 text-xs text-muted-foreground sm:text-right">
          {t('footer:stack')}
        </p>
      </Container>
    </footer>
  )
}
