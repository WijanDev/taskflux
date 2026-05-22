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
    <header className="z-50 shrink-0 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <Container
        fluid
        className="flex items-center justify-between gap-4 py-3 sm:py-4"
      >
        <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 pr-2 text-sm font-semibold tracking-tight text-foreground no-underline sm:pr-4"
          >
            <span className="size-2 rounded-full bg-primary shadow-[0_0_12px_var(--color-primary)]" />
            TaskFlux
          </Link>

          <nav className="flex min-w-0 items-center gap-0.5 sm:gap-1">
            <Link
              to="/"
              className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
              activeProps={{
                className: cn(
                  buttonVariants({ variant: 'secondary', size: 'sm' }),
                ),
              }}
            >
              Home
            </Link>
            <Link
              to="/tasks"
              className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
              activeProps={{
                className: cn(
                  buttonVariants({ variant: 'secondary', size: 'sm' }),
                ),
              }}
            >
              Tasks
            </Link>
            <Link
              to="/about"
              className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
              activeProps={{
                className: cn(
                  buttonVariants({ variant: 'secondary', size: 'sm' }),
                ),
              }}
            >
              About
            </Link>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          {isPending ? (
            <span className="text-sm text-muted-foreground">…</span>
          ) : session?.user ? (
            <>
              <span className="hidden max-w-48 truncate text-sm text-muted-foreground md:inline">
                {session.user.name ?? session.user.email}
              </span>
              <Button
                type="button"
                variant="outline"
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
                className={cn(buttonVariants({ variant: 'ghost' }))}
                activeProps={{
                  className: cn(buttonVariants({ variant: 'secondary' })),
                }}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className={cn(buttonVariants())}
                activeProps={{
                  className: cn(buttonVariants()),
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
