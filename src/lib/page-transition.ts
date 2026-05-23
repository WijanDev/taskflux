/** Time to show the success toast before starting the exit animation. */
export const SETTINGS_SAVE_TOAST_MS = 1200

/** Fade/slide duration for settings exit and tasks enter. */
export const PAGE_TRANSITION_MS = 320

export const PAGE_EXIT_CLASS = 'page-exit'
export const PAGE_ENTER_CLASS = 'page-enter'

export type SettingsSaveNavigationState = {
  fromSettingsSave?: boolean
}

export function waitMs(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}
