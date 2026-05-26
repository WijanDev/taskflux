import { redirect } from '@tanstack/react-router'

import { getMyRole } from '#/server/user-roles'
import { getSession } from '#/server/session'

/** Shared guard for `/admin/*` routes. */
export async function ensureAdminRouteAccess(redirectPath: string) {
  const session = await getSession()
  if (!session?.user) {
    throw redirect({
      to: '/signin',
      search: { redirect: redirectPath },
    })
  }

  const { role } = await getMyRole()
  if (role !== 'admin') {
    throw redirect({ to: '/tasks' })
  }

  return { session }
}
