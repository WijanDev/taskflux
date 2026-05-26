import { env } from 'cloudflare:workers'

export type AppEnvironment = 'production' | 'development' | 'staging' | 'test'

/** Cloudflare binding `ENVIRONMENT` (see wrangler.jsonc / `.dev.vars`). */
export function getEnvironment(): AppEnvironment {
  const raw = env.ENVIRONMENT?.trim().toLowerCase()

  if (raw === 'development' || raw === 'dev') {
    return 'development'
  }
  if (raw === 'staging') {
    return 'staging'
  }
  if (raw === 'test') {
    return 'test'
  }

  return 'production'
}

export function isProductionEnvironment(): boolean {
  return getEnvironment() === 'production'
}

export function assertNonProductionEnvironment(action: string) {
  if (isProductionEnvironment()) {
    throw new Error(`${action} is disabled in production`)
  }
}
