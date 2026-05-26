import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import {
  adminUsersListQueryOptions,
  prefetchAdjacentAdminUsersPages,
} from '#/lib/admin-users-queries'
import type { ListAdminUsersQuery } from '#/lib/admin-users-query'

export function useAdminUsersList(params: ListAdminUsersQuery) {
  const queryClient = useQueryClient()
  const query = useQuery(adminUsersListQueryOptions(params))
  const { data, isFetching } = query

  useEffect(() => {
    if (isFetching || !data) {
      return
    }

    if (data.page !== params.page || data.pageSize !== params.pageSize) {
      return
    }

    prefetchAdjacentAdminUsersPages(queryClient, params, data.totalPages)
  }, [data, isFetching, params, queryClient])

  return query
}
