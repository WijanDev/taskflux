import {
  keepPreviousData,
  queryOptions,
  type QueryClient,
} from '@tanstack/react-query'

import type { ListAdminUsersQuery } from '#/lib/admin-users-query'
import { getUserForAdmin, listUsersForRoleAdmin } from '#/server/user-roles'

export const adminUsersQueryKeys = {
  all: ['admin', 'users'] as const,
  list: (params: ListAdminUsersQuery) =>
    [...adminUsersQueryKeys.all, 'list', params] as const,
  detail: (userId: string) =>
    [...adminUsersQueryKeys.all, 'detail', userId] as const,
}

export function adminUsersListQueryOptions(params: ListAdminUsersQuery) {
  return queryOptions({
    queryKey: adminUsersQueryKeys.list(params),
    queryFn: () => listUsersForRoleAdmin({ data: params }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

export function adminUserDetailQueryOptions(userId: string) {
  return queryOptions({
    queryKey: adminUsersQueryKeys.detail(userId),
    queryFn: () => getUserForAdmin({ data: { userId } }),
    staleTime: 30_000,
  })
}

export function getAdjacentAdminUsersPageNumbers(
  currentPage: number,
  totalPages: number,
): number[] {
  if (totalPages <= 1) {
    return []
  }

  const targets = new Set<number>()

  if (currentPage > 1) {
    targets.add(1)
    targets.add(currentPage - 1)
  }

  if (currentPage < totalPages) {
    targets.add(currentPage + 1)
    targets.add(totalPages)
  }

  targets.delete(currentPage)

  return [...targets].sort((a, b) => a - b)
}

export function prefetchAdjacentAdminUsersPages(
  queryClient: QueryClient,
  params: ListAdminUsersQuery,
  totalPages: number,
) {
  for (const targetPage of getAdjacentAdminUsersPageNumbers(
    params.page,
    totalPages,
  )) {
    void queryClient.prefetchQuery(
      adminUsersListQueryOptions({ ...params, page: targetPage }),
    )
  }
}
