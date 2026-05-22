import { Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'

import { authClient } from '#/lib/auth-client'
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
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm text-[var(--sea-ink)] no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2"
          >
            <span className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]" />
            TaskFlux
          </Link>
        </h2>

        <div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-none sm:w-auto sm:flex-nowrap sm:pb-0">
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Home
          </Link>
          <Link
            to="/tasks"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Tasks
          </Link>
          <Link
            to="/about"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            About
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {isPending ? (
            <span className="hidden text-sm text-[var(--sea-ink-soft)] sm:inline">
              …
            </span>
          ) : session?.user ? (
            <>
              <span className="hidden max-w-[10rem] truncate text-sm text-[var(--sea-ink-soft)] sm:inline">
                {session.user.name ?? session.user.email}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="rounded-full border border-[var(--line)] px-3 py-1.5 text-sm font-semibold text-[var(--sea-ink)] transition hover:bg-[var(--link-bg-hover)] disabled:opacity-50"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="nav-link"
                activeProps={{ className: 'nav-link is-active' }}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-3 py-1.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:bg-[rgba(79,184,178,0.24)]"
                activeProps={{
                  className:
                    'rounded-full border border-[rgba(50,143,151,0.45)] bg-[rgba(79,184,178,0.24)] px-3 py-1.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline',
                }}
              >
                Sign up
              </Link>
            </>
          )}

          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
