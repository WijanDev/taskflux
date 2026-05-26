import { isBrowser } from '@/lib/runtime'

export type ThemeMode = 'light' | 'dark' | 'auto'

export type ResolvedTheme = 'light' | 'dark'

export const THEME_TRANSITION_MS = 200

export function setRootThemeDataset(root: HTMLElement, mode: ThemeMode) {
  if (mode === 'auto') {
    delete root.dataset.theme
  } else {
    root.dataset.theme = mode
  }
}

export function resolveThemeAppearance(
  mode: ThemeMode,
  prefersDark: boolean,
): ResolvedTheme {
  if (mode === 'auto') {
    return prefersDark ? 'dark' : 'light'
  }
  return mode
}

export function getNextThemeMode(mode: ThemeMode): ThemeMode {
  if (mode === 'light') {
    return 'dark'
  }
  if (mode === 'dark') {
    return 'auto'
  }
  return 'light'
}

export function getThemeToggleLabel(mode: ThemeMode): string {
  if (mode === 'auto') {
    return 'Theme: system. Click for light.'
  }
  if (mode === 'dark') {
    return 'Theme: dark. Click for auto.'
  }
  return 'Theme: light. Click for dark.'
}

export function getInitialMode(): ThemeMode {
  if (!isBrowser()) {
    return 'auto'
  }

  const stored = globalThis.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored
  }

  return 'auto'
}

export function applyThemeMode(mode: ThemeMode, options?: { animate?: boolean }) {
  const run = () => {
    const prefersDark = globalThis.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
    const resolved = resolveThemeAppearance(mode, prefersDark)

    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolved)

    setRootThemeDataset(root, mode)

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
      globalThis.setTimeout(() => {
        root.classList.remove('theme-transition')
      }, THEME_TRANSITION_MS)
    })
  })
}
