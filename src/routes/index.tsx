import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, CheckSquare, Shield, Zap } from 'lucide-react'

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

const features = [
  {
    icon: CheckSquare,
    title: 'Your tasks only',
    description: 'Every task is scoped to your account. Private by default.',
  },
  {
    icon: Zap,
    title: 'Fast edge stack',
    description: 'TanStack Start on Cloudflare Workers with D1 at the edge.',
  },
  {
    icon: Shield,
    title: 'Secure auth',
    description: 'Email and password via Better Auth with session cookies.',
  },
] as const

function App() {
  return (
    <PageShell wide className="py-16 md:py-24">
      <div className="flex flex-col gap-20 md:gap-28">
        <section className="max-w-2xl space-y-8 md:space-y-10">
          <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">
            Task management
          </p>
          <h1 className="text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
            Minimal tasks.{' '}
            <span className="text-primary">Electric focus.</span>
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            TaskFlux is a lightweight task list with authentication, built for
            speed on Cloudflare and styled with shadcn/ui.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button asChild size="lg">
              <Link to="/tasks">
                Open tasks
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/about">About</Link>
            </Button>
          </div>
        </section>

        <section className="space-y-8">
          <div className="max-w-xl space-y-2">
            <h2 className="text-sm font-medium tracking-wide text-foreground uppercase">
              Built for clarity
            </h2>
            <p className="text-muted-foreground">
              Everything you need, nothing you don&apos;t.
            </p>
          </div>
          <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title}>
                <Card className="h-full border-border/80 py-2 shadow-none">
                  <CardHeader className="gap-4 px-6 py-8">
                    <div className="flex size-10 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription className="leading-relaxed">
                      {description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <Card className="border-dashed border-primary/30 bg-accent/20 shadow-none">
            <CardContent className="px-8 py-10 text-sm leading-relaxed text-muted-foreground md:text-base">
              Sign in to sync tasks across devices. New here?{' '}
              <Link
                to="/signup"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Create an account
              </Link>
              .
            </CardContent>
          </Card>
        </section>
      </div>
    </PageShell>
  )
}
