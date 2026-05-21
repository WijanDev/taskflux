import { env } from 'cloudflare:workers'
import { drizzle } from 'drizzle-orm/d1'

import * as schema from './schema'

let db: ReturnType<typeof drizzle<typeof schema>> | undefined

export function getDb(d1: D1Database = env.DB) {
  if (!db) db = drizzle(d1, { schema })
  return db
}

export type Db = ReturnType<typeof getDb>
