import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, CheckSquare, Shield, Zap } from 'lucide-react'
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

export const Route = createFileRoute('/')({ component: App })

const featureKeys = ['private', 'fast', 'secure'] as const
const featureIcons = {
  private: CheckSquare,
  fast: Zap,
  secure: Shield,
} as const

function App() {
  const { t } = useTranslation(['home', 'common'])

  return (
    <PageShell wide className="py-16 md:py-24">
      <div className="flex flex-col gap-20 md:gap-28">
        <section className="max-w-2xl space-y-8 md:space-y-10">
          <Link
            to="/"
            className="flex w-fit items-center gap-3 text-foreground no-underline"
          >
            <img
              src="/favicon.svg"
              alt=""
              className="size-10 shrink-0 sm:size-12"
              aria-hidden
            />
            <span className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {t('common:appName')}
            </span>
          </Link>
          <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">
            {t('home:eyebrow')}
          </p>
          <h1 className="text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
            {t('home:title')}{' '}
            <span className="text-primary">{t('home:titleAccent')}</span>
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            {t('home:description')}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button asChild size="lg">
              <Link to="/tasks">
                {t('home:openTasks')}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/about">{t('home:about')}</Link>
            </Button>
          </div>
        </section>

        <section className="space-y-8">
          <div className="max-w-xl space-y-2">
            <h2 className="text-sm font-medium tracking-wide text-foreground uppercase">
              {t('home:builtForClarity')}
            </h2>
            <p className="text-muted-foreground">
              {t('home:builtForClarityDescription')}
            </p>
          </div>
          <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {featureKeys.map((key) => {
              const Icon = featureIcons[key]
              return (
                <li key={key}>
                  <Card className="h-full border-border/80 py-2 shadow-none">
                    <CardHeader className="gap-4 px-6 py-8">
                      <div className="flex size-10 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
                        <Icon className="size-4" />
                      </div>
                      <CardTitle className="text-base">
                        {t(`home:features.${key}.title`)}
                      </CardTitle>
                      <CardDescription className="leading-relaxed">
                        {t(`home:features.${key}.description`)}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </li>
              )
            })}
          </ul>
        </section>

        <section>
          <Card className="border-dashed border-primary/30 bg-accent/20 shadow-none">
            <CardContent className="px-8 py-10 text-sm leading-relaxed text-muted-foreground md:text-base">
              {t('home:cta')}{' '}
              <Link
                to="/signup"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {t('home:createAccount')}
              </Link>
              .
            </CardContent>
          </Card>
        </section>
      </div>
    </PageShell>
  )
}
