import { useEffect, useState } from 'react'

import type { AppRouter } from '@/router'

import {
  isSettingsSaveNavigationState,
  PAGE_TRANSITION_MS,
} from '@/lib/page-transition'

export function useEnterFromSettings(router: AppRouter) {
  const [enterFromSettings, setEnterFromSettings] = useState(false)

  useEffect(() => {
    const state = router.state.location.state
    if (!isSettingsSaveNavigationState(state)) {
      return
    }

    setEnterFromSettings(true)

    router
      .navigate({
        to: '/tasks',
        search: router.state.location.search,
        replace: true,
        state: {},
      })
      .catch(() => {})

    const timer = globalThis.setTimeout(() => {
      setEnterFromSettings(false)
    }, PAGE_TRANSITION_MS)

    return () => globalThis.clearTimeout(timer)
    // Only check navigation state on mount (avoids hydration mismatch).
  }, [])

  return enterFromSettings
}
