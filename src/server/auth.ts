import { getRequestHeaders } from '@tanstack/react-start/server'

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
