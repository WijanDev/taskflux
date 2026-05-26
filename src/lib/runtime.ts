/** True in browser-like environments (has `localStorage` on `globalThis`). Safe during SSR. */
export function isBrowser(): boolean {
  return 'localStorage' in globalThis
}

/** True when `document` exists on `globalThis` (e.g. for portals). Safe during SSR. */
export function hasDocument(): boolean {
  return 'document' in globalThis
}
