import {
  ADMIN_USERS_DEFAULT_PAGE_SIZE,
  isAdminUsersPageSize,
} from '#/lib/admin-users-query'
import type { ListAdminUsersQuery } from '#/lib/admin-users-query'
import { isAppRole } from '#/lib/roles'

export function parseListAdminUsersQuery(
  data: ListAdminUsersQuery,
): ListAdminUsersQuery {
  const page =
    typeof data.page === 'number' && Number.isFinite(data.page)
      ? Math.max(1, Math.floor(data.page))
      : 1

  const rawPageSize =
    typeof data.pageSize === 'number' && Number.isFinite(data.pageSize)
      ? Math.floor(data.pageSize)
      : ADMIN_USERS_DEFAULT_PAGE_SIZE

  const pageSize = isAdminUsersPageSize(rawPageSize)
    ? rawPageSize
    : ADMIN_USERS_DEFAULT_PAGE_SIZE

  const search = typeof data.search === 'string' ? data.search.trim() : ''

  const role =
    data.role === 'all' || isAppRole(data.role) ? data.role : ('all' as const)

  return { page, pageSize, search, role }
}

export function sanitizeAdminUsersSearch(value: string): string {
  return value.replace(/[%_]/g, '')
}
