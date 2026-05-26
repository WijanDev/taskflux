import { useEffect, useState } from 'react'

import { authClient } from '#/lib/auth-client'
import { getMyRole } from '#/server/user-roles'

export function useIsAdmin() {
  const { data: session, isPending } = authClient.useSession()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (isPending) {
      return
    }

    if (!session?.user) {
      setIsAdmin(false)
      setChecked(true)
      return
    }

    let cancelled = false
    setChecked(false)

    getMyRole()
      .then(({ role }) => {
        if (!cancelled) {
          setIsAdmin(role === 'admin')
          setChecked(true)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsAdmin(false)
          setChecked(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [isPending, session?.user?.id])

  return { isAdmin, isPending: isPending || !checked }
}
