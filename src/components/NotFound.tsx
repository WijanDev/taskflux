import { Link } from '@tanstack/react-router'

import { PageShell } from '@/components/PageShell'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <PageShell narrow className="py-16 md:py-20">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">
          404
        </p>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Page not found
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button asChild>
            <Link to="/">Back to home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/tasks">Open tasks</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  )
}
