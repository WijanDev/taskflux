import { Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'

import { Container } from '@/components/Container'
import { Button, buttonVariants } from '@/components/ui/button'
import { authClient } from '#/lib/auth-client'
import { cn } from '@/lib/utils'

import ThemeToggle from './ThemeToggle'

export default function Header() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await authClient.signOut()
      await router.navigate({ to: '/' })
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <Container className="flex flex-wrap items-center gap-3 py-4">
        <Link
          to="/"
          className="mr-2 flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground no-underline"
        >
          <span className="size-2 rounded-full bg-primary shadow-[0_0_12px_var(--color-primary)]" />
          TaskFlux
        </Link>

        <nav className="flex flex-wrap items-center gap-1">
          <Link
            to="/"
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
            activeProps={{
              className: cn(buttonVariants({ variant: 'secondary', size: 'sm' })),
            }}
          >
            Home
          </Link>
          <Link
            to="/tasks"
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
            activeProps={{
              className: cn(buttonVariants({ variant: 'secondary', size: 'sm' })),
            }}
          >
            Tasks
          </Link>
          <Link
            to="/about"
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
            activeProps={{
              className: cn(buttonVariants({ variant: 'secondary', size: 'sm' })),
            }}
          >
            About
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {isPending ? (
            <span className="text-sm text-muted-foreground">…</span>
          ) : session?.user ? (
            <>
              <span className="hidden max-w-40 truncate text-sm text-muted-foreground sm:inline">
                {session.user.name ?? session.user.email}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                disabled={signingOut}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                activeProps={{
                  className: cn(
                    buttonVariants({ variant: 'secondary', size: 'sm' }),
                  ),
                }}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className={cn(buttonVariants({ size: 'sm' }))}
                activeProps={{
                  className: cn(buttonVariants({ size: 'sm' })),
                }}
              >
                Sign up
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </Container>
    </header>
  )
}
