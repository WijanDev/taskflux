import { createFileRoute, Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import {
  ArrowRight,
  Cloud,
  Database,
  Github,
  Layers,
  Lock,
  Sparkles,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { DeployToCloudflareLink } from '@/components/DeployToCloudflareLink'
import { PageShell } from '@/components/PageShell'
import { Button } from '@/components/ui/button'
import { GITHUB_REPO } from '@/lib/site'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/about')({
  component: About,
})

const principleKeys = ['private', 'simple', 'edge'] as const

const stackMeta = [
  { key: 'tanstack', icon: Layers },
  { key: 'cloudflare', icon: Cloud },
  { key: 'd1', icon: Database },
  { key: 'auth', icon: Lock },
  { key: 'ui', icon: Sparkles },
] as const

function AboutBadge({
  children,
  className,
  href,
}: {
  children: ReactNode
  className?: string
  href?: string
}) {
  const classes = cn(
    'inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary',
    href && 'no-underline transition-colors hover:bg-primary/20',
    className,
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    )
  }

  return <span className={classes}>{children}</span>
}

function About() {
  const { t } = useTranslation('about')

  return (
    <PageShell wide className="py-16 md:py-24">
      <div className="flex flex-col gap-20 md:gap-28">
        <section className="max-w-2xl space-y-8 md:space-y-10">
          <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">
            {t('eyebrow')}
          </p>
          <h1 className="text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">
            {t('heroTitle')}{' '}
            <span className="text-primary">{t('heroTitleAccent')}</span>
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            {t('heroDescription')}
          </p>
        </section>

        <section>
          <Card className="overflow-hidden border-border/80 shadow-none">
            <div className="h-1 w-full bg-gradient-to-r from-primary/80 via-primary to-primary/40" />
            <CardContent className="px-8 py-10 md:px-10 md:py-12">
              <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
                <div className="flex shrink-0 flex-col items-center text-center lg:items-start lg:text-left">
                  <div
                    className="flex size-20 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 text-2xl font-semibold tracking-tight text-primary"
                    aria-hidden
                  >
                    WR
                  </div>
                  <p className="mt-5 text-lg font-semibold text-foreground">
                    Wijan Ruiz
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t('profileRole')}
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
                    <AboutBadge href={GITHUB_REPO}>
                      <Github className="mr-1.5 size-3" />
                      {t('badgeSource')}
                    </AboutBadge>
                    <AboutBadge>
                      <Cloud className="mr-1.5 size-3" />
                      {t('badgeSelfHost')}
                    </AboutBadge>
                    <AboutBadge>{t('badgeHosted')}</AboutBadge>
                  </div>
                  <div className="mt-6 flex flex-col items-center gap-3 lg:items-start">
                    <DeployToCloudflareLink />
                    <Button variant="ghost" size="sm" className="h-auto px-0" asChild>
                      <a
                        href={GITHUB_REPO}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="size-4" />
                        {t('viewRepository')}
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-5 border-border/60 lg:border-l lg:pl-14">
                  <p className="text-base leading-relaxed text-foreground md:text-lg">
                    {t('story1')}
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    {t('story2')}
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    {t('story3Before')}{' '}
                    <a
                      href={GITHUB_REPO}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {t('story3Link')}
                    </a>
                    {t('story3Middle')}{' '}
                    <span className="font-medium text-foreground">
                      {t('story3Emphasis')}
                    </span>{' '}
                    {t('story3After')}
                  </p>
                  <p className="border-l-2 border-primary/40 pl-4 text-sm leading-relaxed text-muted-foreground italic">
                    {t('storyQuote')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-8">
          <div className="max-w-xl space-y-2">
            <h2 className="text-sm font-medium tracking-wide text-foreground uppercase">
              {t('principlesTitle')}
            </h2>
            <p className="text-muted-foreground">{t('principlesDescription')}</p>
          </div>
          <ul className="m-0 grid list-none gap-6 p-0 md:grid-cols-3 md:gap-8">
            {principleKeys.map((key) => (
              <li key={key}>
                <Card className="h-full border-border/80 shadow-none">
                  <CardHeader className="gap-3 px-6 py-8">
                    <CardTitle className="text-base">
                      {t(`principles.${key}.title`)}
                    </CardTitle>
                    <CardDescription className="leading-relaxed">
                      {t(`principles.${key}.description`)}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-8">
          <div className="max-w-xl space-y-2">
            <h2 className="text-sm font-medium tracking-wide text-foreground uppercase">
              {t('stackTitle')}
            </h2>
            <p className="text-muted-foreground">{t('stackDescription')}</p>
          </div>
          <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:gap-5">
            {stackMeta.map(({ key, icon: Icon }) => (
              <li key={key}>
                <div className="flex gap-4 rounded-xl border border-border/80 bg-card px-5 py-5 transition-colors hover:border-primary/25 hover:bg-accent/20">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      {t(`stack.${key}.name`)}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {t(`stack.${key}.role`)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <Card className="overflow-hidden border-primary/20 shadow-none">
            <CardContent className="flex flex-col gap-8 px-8 py-10 md:py-12">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="max-w-md space-y-2">
                  <p className="text-lg font-semibold text-foreground">
                    {t('ctaTitle')}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {t('ctaDescription')}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button asChild size="lg">
                    <Link to="/tasks">
                      {t('openTasks')}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/signup">{t('signUp')}</Link>
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-4 border-t border-border/60 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {t('selfHostTitle')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('selfHostDescription')}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <DeployToCloudflareLink />
                  <Button variant="outline" asChild>
                    <a
                      href={GITHUB_REPO}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="size-4" />
                      {t('sourceOnGithub')}
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageShell>
  )
}
