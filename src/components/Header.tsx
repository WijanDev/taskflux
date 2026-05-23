import { Link, useRouter } from '@tanstack/react-router'
import { LogOut, Settings } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Container } from '@/components/Container'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppPreferences } from '@/providers/AppPreferencesProvider'
import { authClient } from '#/lib/auth-client'
import { SUPPORTED_LOCALES, type AppLocale } from '#/lib/user-settings'
import { cn } from '@/lib/utils'

import ThemeToggle from './ThemeToggle'

function getUserInitials(name?: string | null, email?: string | null): string {
  const source = name?.trim() || email?.trim() || '?'
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0]![0]!}${parts[1]![0]!}`.toUpperCase()
  }
  return source.slice(0, 2).toUpperCase()
}

export default function Header() {
  const { t } = useTranslation()
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const [signingOut, setSigningOut] = useState(false)
  const { preferences, setPreferences } = useAppPreferences()

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await authClient.signOut()
      await router.navigate({ to: '/' })
    } finally {
      setSigningOut(false)
    }
  }

  function handleGuestLocaleChange(locale: AppLocale) {
    setPreferences((prev) => ({ ...prev, locale }))
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
            {t('common:appName')}
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
              {t('common:nav.home')}
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
              {t('common:nav.tasks')}
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
              {t('common:nav.about')}
            </Link>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          {isPending ? (
            <span className="text-sm text-muted-foreground">
              {t('common:loading')}
            </span>
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-full p-0"
                  aria-label={t('common:accountMenu')}
                >
                  <Avatar className="size-9">
                    {session.user.image ? (
                      <AvatarImage
                        src={session.user.image}
                        alt=""
                        className="object-cover"
                      />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                      {getUserInitials(session.user.name, session.user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-0.5">
                    {session.user.name ? (
                      <span className="truncate text-sm font-medium">
                        {session.user.name}
                      </span>
                    ) : null}
                    <span className="truncate text-xs text-muted-foreground">
                      {session.user.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    to="/settings"
                    className="flex w-full cursor-pointer items-center gap-2"
                  >
                    <Settings className="size-4" aria-hidden />
                    {t('common:nav.settings')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                  disabled={signingOut}
                  onClick={() => void handleSignOut()}
                >
                  <LogOut className="size-4" aria-hidden />
                  {signingOut
                    ? t('common:actions.signingOut')
                    : t('common:actions.signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Select
                value={preferences.locale}
                onValueChange={(value) =>
                  handleGuestLocaleChange(value as AppLocale)
                }
              >
                <SelectTrigger
                  className="h-9 w-[7.5rem]"
                  aria-label={t('common:guestLanguage')}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LOCALES.map((locale) => (
                    <SelectItem key={locale} value={locale}>
                      {t(`settings:options.locale.${locale}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Link
                to="/signin"
                className={cn(buttonVariants({ variant: 'ghost' }))}
                activeProps={{
                  className: cn(buttonVariants({ variant: 'secondary' })),
                }}
              >
                {t('common:actions.signIn')}
              </Link>
              <Link
                to="/signup"
                className={cn(buttonVariants())}
                activeProps={{
                  className: cn(buttonVariants()),
                }}
              >
                {t('common:actions.signUp')}
              </Link>
              <ThemeToggle />
            </>
          )}
        </div>
      </Container>
    </header>
  )
}
