import { getRequestHeaders } from '@tanstack/react-start/server'

import type { AppRole } from '#/lib/roles'

export async function requireUserId(): Promise<string> {
  const { auth } = await import('#/lib/auth.server')
  const session = await auth.api.getSession({
    headers: getRequestHeaders(),
  })

  const userId = session?.user?.id
  if (!userId) {
    throw new Error('Unauthorized')
  }

  return userId
}

export async function getCurrentUserRole(): Promise<AppRole> {
  const userId = await requireUserId()
  const { getEffectiveRole } = await import('#/server/user-role-store')
  return getEffectiveRole(userId)
}

export async function requireAdmin(): Promise<string> {
  const userId = await requireUserId()
  const { getEffectiveRole } = await import('#/server/user-role-store')
  const role = await getEffectiveRole(userId)

  if (role !== 'admin') {
    throw new Error('Forbidden')
  }

  return userId
}
