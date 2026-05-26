import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronRight as RowChevron,
  Loader2,
  Search,
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ADMIN_USERS_DEFAULT_PAGE_SIZE,
  ADMIN_USERS_PAGE_SIZES,
  isAdminUsersPageSize,
  type AdminUsersPageSize,
} from '@/lib/admin-users-query'
import { APP_ROLES, ROLE_LABELS, isAppRole } from '@/lib/roles'
import type { AppRole } from '@/lib/roles'
import { cn } from '@/lib/utils'
import { useAdminUsersList } from '@/hooks/use-admin-users-list'
import { useFormatters } from '@/providers/AppPreferencesProvider'

const ALL_ROLES = 'all' as const
type RoleFilter = typeof ALL_ROLES | AppRole

const SEARCH_DEBOUNCE_MS = 300

export function AdminUsersTable() {
  const { t } = useTranslation(['admin', 'common'])
  const navigate = useNavigate()
  const { formatTaskTimestamp } = useFormatters()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>(ALL_ROLES)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<AdminUsersPageSize>(
    ADMIN_USERS_DEFAULT_PAGE_SIZE,
  )

  const listParams = useMemo(
    () => ({
      page,
      pageSize,
      search: debouncedSearch,
      role: roleFilter,
    }),
    [page, pageSize, debouncedSearch, roleFilter],
  )

  const {
    data: pageData,
    error: queryError,
    isPending,
    isFetching,
    isPlaceholderData,
  } = useAdminUsersList(listParams)

  useEffect(() => {
    const timer = globalThis.setTimeout(() => {
      setDebouncedSearch(search)
    }, SEARCH_DEBOUNCE_MS)

    return () => globalThis.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, roleFilter, pageSize])

  const users = pageData?.items ?? []
  const total = pageData?.total ?? 0
  const totalPages = pageData?.totalPages ?? 0
  const activePageSize = pageData?.pageSize ?? pageSize
  const rangeStart = total === 0 ? 0 : (page - 1) * activePageSize + 1
  const rangeEnd = total === 0 ? 0 : Math.min(page * activePageSize, total)

  let error: string | null = null
  if (queryError) {
    error =
      queryError instanceof Error
        ? queryError.message
        : t('admin:users.loadFailed')
  }

  const isInitialLoad = isPending
  const isRefreshing = isFetching && (isPlaceholderData || !isPending)
  const showTable = users.length > 0
  const showFooter = total > 0

  function openUser(userId: string) {
    void navigate({ to: '/admin/users/$userId', params: { userId } })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 flex-col gap-3 border-b border-border/60 px-6 py-4 md:px-8 md:py-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end">
            <div className="relative min-w-0 flex-1 sm:max-w-sm">
              <Label htmlFor="admin-users-search" className="sr-only">
                {t('admin:users.searchLabel')}
              </Label>
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="admin-users-search"
                type="search"
                value={search}
                placeholder={t('admin:users.searchPlaceholder')}
                className="pl-9"
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="w-full space-y-1.5 sm:w-[11rem]">
              <Label
                htmlFor="admin-users-role-filter"
                className="text-xs text-muted-foreground"
              >
                {t('admin:users.filterRole')}
              </Label>
              <Select
                value={roleFilter}
                onValueChange={(value) => {
                  if (value === ALL_ROLES || isAppRole(value)) {
                    setRoleFilter(value)
                  }
                }}
              >
                <SelectTrigger id="admin-users-role-filter" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_ROLES}>
                    {t('admin:users.filterRoleAll')}
                  </SelectItem>
                  {APP_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {t(`admin:roles.${role}`, {
                        defaultValue: ROLE_LABELS[role],
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
            {isInitialLoad && t('admin:users.loading')}
            {isRefreshing && (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-3.5 animate-spin" aria-hidden />
                {t('admin:users.loadingPage')}
              </span>
            )}
            {!isFetching &&
              t('admin:users.resultsRange', {
                from: rangeStart,
                to: rangeEnd,
                total,
              })}
          </p>
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>

      {isInitialLoad && (
        <div className="flex min-h-0 flex-1 items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" aria-hidden />
          <span className="text-sm">{t('admin:users.loading')}</span>
        </div>
      )}

      {!isInitialLoad && total === 0 && !error && !isFetching && (
        <p className="px-6 py-10 text-sm text-muted-foreground md:px-8">
          {debouncedSearch || roleFilter !== ALL_ROLES
            ? t('admin:users.noResults')
            : t('admin:users.empty')}
        </p>
      )}

      {showTable && (
        <div
          className="relative min-h-0 flex-1 overflow-auto px-6 py-4 md:px-8 md:py-5"
          aria-busy={isRefreshing}
        >
          {isRefreshing && (
            <div
              className="absolute inset-0 z-20 flex items-center justify-center bg-background/50 backdrop-blur-[1px]"
              role="status"
            >
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 shadow-sm">
                <Loader2 className="size-4 animate-spin text-primary" aria-hidden />
                <span className="text-sm font-medium">
                  {t('admin:users.loadingPage')}
                </span>
              </div>
            </div>
          )}
          <Table
            className={cn(
              isRefreshing && 'pointer-events-none select-none opacity-50',
            )}
          >
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="sticky top-0 z-10 bg-card">
                  {t('admin:users.columns.name')}
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-card">
                  {t('admin:users.columns.email')}
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-card">
                  {t('admin:users.columns.joined')}
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-card">
                  {t('admin:users.columns.roleUpdated')}
                </TableHead>
                <TableHead className="sticky top-0 z-10 bg-card">
                  {t('admin:users.roleLabel')}
                </TableHead>
                <TableHead className="sticky top-0 z-10 w-10 bg-card">
                  <span className="sr-only">{t('admin:users.viewUser')}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((entry) => {
                const roleUpdatedLabel = entry.roleUpdatedAt
                  ? formatTaskTimestamp(entry.roleUpdatedAt)
                  : t('admin:users.roleNeverSet')

                return (
                  <TableRow
                    key={entry.id}
                    className="cursor-pointer"
                    tabIndex={0}
                    aria-label={t('admin:users.openUser', { name: entry.name })}
                    onClick={() => openUser(entry.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        openUser(entry.id)
                      }
                    }}
                  >
                    <TableCell className="max-w-[12rem] font-medium">
                      <span className="block truncate">{entry.name}</span>
                    </TableCell>
                    <TableCell className="max-w-[16rem] text-muted-foreground">
                      <span className="block truncate">{entry.email}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatTaskTimestamp(entry.createdAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {roleUpdatedLabel}
                    </TableCell>
                    <TableCell>
                      {t(`admin:roles.${entry.role}`, {
                        defaultValue: entry.label,
                      })}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      <RowChevron className="ml-auto size-4" aria-hidden />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {showFooter && (
        <div className="flex shrink-0 flex-col gap-4 border-t border-border/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8 md:py-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="admin-users-page-size"
                className="text-sm text-muted-foreground"
              >
                {t('admin:users.pageSize')}
              </Label>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  const parsed = Number.parseInt(value, 10)
                  if (isAdminUsersPageSize(parsed)) {
                    setPageSize(parsed)
                  }
                }}
              >
                <SelectTrigger
                  id="admin-users-page-size"
                  className="w-[5.5rem]"
                  aria-label={t('admin:users.pageSize')}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ADMIN_USERS_PAGE_SIZES.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {totalPages > 1 && (
              <p className="text-sm text-muted-foreground">
                {t('admin:users.pageOf', { page, totalPages })}
              </p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1 || isFetching}
                aria-label={t('admin:users.firstPage')}
                onClick={() => setPage(1)}
              >
                <ChevronsLeft className="size-4" aria-hidden />
                {t('admin:users.firstPage')}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1 || isFetching}
                aria-label={t('admin:users.previousPage')}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                <ChevronLeft className="size-4" aria-hidden />
                {t('admin:users.previousPage')}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= totalPages || isFetching}
                aria-label={t('admin:users.nextPage')}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
              >
                {t('admin:users.nextPage')}
                <ChevronRight className="size-4" aria-hidden />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= totalPages || isFetching}
                aria-label={t('admin:users.lastPage')}
                onClick={() => setPage(totalPages)}
              >
                {t('admin:users.lastPage')}
                <ChevronsRight className="size-4" aria-hidden />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
