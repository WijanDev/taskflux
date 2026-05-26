import type { AppRole } from '#/lib/roles'

export const ADMIN_USERS_PAGE_SIZES = [10, 20, 50, 100] as const
export type AdminUsersPageSize = (typeof ADMIN_USERS_PAGE_SIZES)[number]
export const ADMIN_USERS_DEFAULT_PAGE_SIZE: AdminUsersPageSize = 10

export type AdminUsersRoleFilter = AppRole | 'all'

export type ListAdminUsersQuery = {
  page: number
  pageSize: AdminUsersPageSize
  search: string
  role: AdminUsersRoleFilter
}

export function isAdminUsersPageSize(value: number): value is AdminUsersPageSize {
  return (ADMIN_USERS_PAGE_SIZES as readonly number[]).includes(value)
}
