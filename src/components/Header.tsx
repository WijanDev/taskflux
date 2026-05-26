import { Link, useRouter } from '@tanstack/react-router'
import { LogOut, Menu, Settings, Shield } from 'lucide-react'
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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useIsAdmin } from '@/hooks/use-is-admin'
import { useAppPreferences } from '@/providers/AppPreferencesProvider'
import { authClient } from '#/lib/auth-client'
import { isAppLocale, SUPPORTED_LOCALES } from '#/lib/user-settings'
import { cn } from '@/lib/utils'

import ThemeToggle from './ThemeToggle'

const navLinkClass = cn(buttonVariants({ variant: 'ghost', size: 'sm' }))
const navLinkActiveClass = cn(buttonVariants({ variant: 'secondary', size: 'sm' }))

const NAV_ROUTES = [
  { to: '/', key: 'home' },
  { to: '/tasks', key: 'tasks' },
  { to: '/about', key: 'about' },
] as const

function getUserInitials(name?: string | null, email?: string | null): string {
  const source = name?.trim() || email?.trim() || '?'
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return source.slice(0, 2).toUpperCase()
}

function BrandLink() {
  const { t } = useTranslation('common')

  return (
    <Link
      to="/"
      className="flex min-w-0 shrink-0 items-center gap-2 text-sm font-semibold tracking-tight text-foreground no-underline"
    >
      <img
        src="/favicon.svg"
        alt=""
        className="size-7 shrink-0 sm:size-8"
        aria-hidden
      />
      <span className="truncate">{t('appName')}</span>
    </Link>
  )
}

function MainNav({ className }: Readonly<{ className?: string }>) {
  const { t } = useTranslation('common')

  return (
    <nav className={cn('flex items-center gap-0.5 sm:gap-1', className)}>
      {NAV_ROUTES.map((route) => (
        <Link
          key={route.to}
          to={route.to}
          className={navLinkClass}
          activeProps={{ className: navLinkActiveClass }}
        >
          {t(`nav.${route.key}`)}
        </Link>
      ))}
    </nav>
  )
}

function GuestLocaleSelect({
  className,
  id,
}: Readonly<{
  className?: string
  id?: string
}>) {
  const { t } = useTranslation(['common', 'settings'])
  const { preferences, setPreferences } = useAppPreferences()

  return (
    <Select
      value={preferences.locale}
      onValueChange={(value) => {
        if (isAppLocale(value)) {
          setPreferences((prev) => ({ ...prev, locale: value }))
        }
      }}
    >
      <SelectTrigger
        id={id}
        className={cn('h-9 w-full min-w-0', className)}
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
  )
}

function GuestAuthActions({
  stacked = false,
  onNavigate,
}: Readonly<{
  stacked?: boolean
  onNavigate?: () => void
}>) {
  const { t } = useTranslation('common')

  return (
    <div
      className={cn(
        'flex gap-2',
        stacked ? 'w-full flex-col' : 'items-center',
      )}
    >
      <Link
        to="/signin"
        search={{ redirect: '/signin' }}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          stacked && 'w-full justify-center',
        )}
        activeProps={{
          className: cn(
            buttonVariants({ variant: 'secondary' }),
            stacked && 'w-full justify-center',
          ),
        }}
        onClick={onNavigate}
      >
        {t('actions.signIn')}
      </Link>
      <Link
        to="/signup"
        className={cn(buttonVariants(), stacked && 'w-full justify-center')}
        activeProps={{
          className: cn(buttonVariants(), stacked && 'w-full justify-center'),
        }}
        onClick={onNavigate}
      >
        {t('actions.signUp')}
      </Link>
    </div>
  )
}

function MenuNavLink({
  to,
  label,
  onNavigate,
}: Readonly<{
  to: string
  label: string
  onNavigate: () => void
}>) {
  return (
    <DropdownMenuItem asChild className="cursor-pointer">
      <Link
        to={to}
        className="w-full cursor-pointer"
        onClick={onNavigate}
      >
        {label}
      </Link>
    </DropdownMenuItem>
  )
}

type HeaderUser = {
  name?: string | null
  email?: string | null
  image?: string | null
}

type MobileNavMenuProps = Readonly<{
  user: HeaderUser | null | undefined
  signingOut: boolean
  onSignOut: () => void | Promise<void>
  showAdminLink: boolean
}>

function MobileNavMenu({
  user,
  signingOut,
  onSignOut,
  showAdminLink,
}: MobileNavMenuProps) {
  const { t } = useTranslation(['common', 'settings'])
  const [open, setOpen] = useState(false)
  const isLoggedIn = user != null

  function closeMenu() {
    setOpen(false)
  }

  function handleSignOut() {
    closeMenu()
    onSignOut()
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9 shrink-0"
          aria-label={t('common:nav.menu')}
        >
          <Menu className="size-5" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[min(18rem,calc(100vw-1.5rem))] p-2"
      >
        {isLoggedIn ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-3">
                <Avatar className="size-9 shrink-0">
                  {user.image ? (
                    <AvatarImage
                      src={user.image}
                      alt=""
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                    {getUserInitials(user.name, user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  {user.name ? (
                    <span className="block truncate text-sm font-medium">
                      {user.name}
                    </span>
                  ) : null}
                  <span className="block truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-2" />
          </>
        ) : null}

        {NAV_ROUTES.map((route) => (
          <MenuNavLink
            key={route.to}
            to={route.to}
            label={t(`common:nav.${route.key}`)}
            onNavigate={closeMenu}
          />
        ))}

        {isLoggedIn ? (
          <>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link
                to="/settings"
                className="flex w-full cursor-pointer items-center gap-2"
                onClick={closeMenu}
              >
                <Settings className="size-4" aria-hidden />
                {t('common:nav.settings')}
              </Link>
            </DropdownMenuItem>
            {showAdminLink ? (
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link
                  to="/admin/users"
                  className="flex w-full cursor-pointer items-center gap-2"
                  onClick={closeMenu}
                >
                  <Shield className="size-4" aria-hidden />
                  {t('common:nav.userRoles')}
                </Link>
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              disabled={signingOut}
              onClick={handleSignOut}
            >
              <LogOut className="size-4" aria-hidden />
              {signingOut
                ? t('common:actions.signingOut')
                : t('common:actions.signOut')}
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuSeparator className="my-2" />
            <div className="space-y-2 px-2 py-1">
              <Label
                htmlFor="header-mobile-locale"
                className="text-xs text-muted-foreground"
              >
                {t('common:labels.language')}
              </Label>
              <GuestLocaleSelect id="header-mobile-locale" />
            </div>
            <DropdownMenuSeparator className="my-2" />
            <GuestAuthActions stacked onNavigate={closeMenu} />
            <DropdownMenuSeparator className="my-2" />
            <div className="flex items-center justify-between gap-3 px-2 py-1">
              <span className="text-sm text-muted-foreground">
                {t('common:nav.theme')}
              </span>
              <ThemeToggle />
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AccountMenu({
  signingOut,
  onSignOut,
  showAdminLink,
}: Readonly<{
  signingOut: boolean
  onSignOut: () => void | Promise<void>
  showAdminLink: boolean
}>) {
  const { t } = useTranslation('common')
  const { data: session } = authClient.useSession()

  if (!session?.user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9 shrink-0 rounded-full p-0"
          aria-label={t('accountMenu')}
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
            {t('nav.settings')}
          </Link>
        </DropdownMenuItem>
        {showAdminLink ? (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link
              to="/admin/users"
              className="flex w-full cursor-pointer items-center gap-2"
            >
              <Shield className="size-4" aria-hidden />
              {t('nav.userRoles')}
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          disabled={signingOut}
          onClick={onSignOut}
        >
          <LogOut className="size-4" aria-hidden />
          {signingOut ? t('actions.signingOut') : t('actions.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function HeaderActions({
  isPending,
  signingOut,
  onSignOut,
  user,
  showAdminLink,
}: Readonly<{
  isPending: boolean
  signingOut: boolean
  onSignOut: () => void | Promise<void>
  user: HeaderUser | null | undefined
  showAdminLink: boolean
}>) {
  const { t } = useTranslation('common')

  if (isPending) {
    return (
      <span className="text-sm text-muted-foreground">{t('loading')}</span>
    )
  }

  return (
    <>
      <div className="hidden items-center gap-2 md:flex">
        {user ? (
          <AccountMenu
            signingOut={signingOut}
            onSignOut={onSignOut}
            showAdminLink={showAdminLink}
          />
        ) : (
          <>
            <GuestLocaleSelect className="w-[7.5rem] sm:w-[8.5rem]" />
            <GuestAuthActions />
            <ThemeToggle />
          </>
        )}
      </div>
      <div className="md:hidden">
        <MobileNavMenu
          user={user}
          signingOut={signingOut}
          onSignOut={onSignOut}
          showAdminLink={showAdminLink}
        />
      </div>
    </>
  )
}

export default function Header() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const { isAdmin } = useIsAdmin()
  const [signingOut, setSigningOut] = useState(false)
  const showAdminLink = Boolean(session?.user && isAdmin)

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
      <Container fluid className="py-0">
        <div className="flex items-center justify-between gap-3 py-3 md:hidden">
          <BrandLink />
          <HeaderActions
            isPending={isPending}
            signingOut={signingOut}
            user={session?.user}
            onSignOut={handleSignOut}
            showAdminLink={showAdminLink}
          />
        </div>

        <div className="hidden items-center justify-between gap-4 py-4 md:flex">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <BrandLink />
            <MainNav className="ml-2" />
          </div>
          <HeaderActions
            isPending={isPending}
            signingOut={signingOut}
            user={session?.user}
            onSignOut={handleSignOut}
            showAdminLink={showAdminLink}
          />
        </div>
      </Container>
    </header>
  )
}
