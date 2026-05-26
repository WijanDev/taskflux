import { useQuery } from '@tanstack/react-query'

import { adminUserDetailQueryOptions } from '#/lib/admin-users-queries'

export function useAdminUserDetail(userId: string) {
  return useQuery(adminUserDetailQueryOptions(userId))
}
