export type ThemeMode = 'light' | 'dark' | 'auto'

export const THEME_TRANSITION_MS = 200

export function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'auto'
  }

  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored
  }

  return 'auto'
}

export function applyThemeMode(mode: ThemeMode, options?: { animate?: boolean }) {
  const run = () => {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
    const resolved =
      mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode

    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolved)

    if (mode === 'auto') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', mode)
    }

    root.style.colorScheme = resolved
  }

  if (options?.animate) {
    withThemeTransition(run)
    return
  }

  run()
}

export function withThemeTransition(action: () => void) {
  const root = document.documentElement
  root.classList.add('theme-transition')

  // Let the browser register transition styles before swapping theme classes.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      action()
      window.setTimeout(() => {
        root.classList.remove('theme-transition')
      }, THEME_TRANSITION_MS)
    })
  })
}
