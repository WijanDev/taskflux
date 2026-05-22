import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { defineConfig } from 'drizzle-kit'

function getLocalD1SqlitePath(): string {
  const fromEnv = process.env.D1_LOCAL_PATH
  if (fromEnv && existsSync(fromEnv)) return fromEnv

  const d1Dir = join(
    process.cwd(),
    '.wrangler/state/v3/d1/miniflare-D1DatabaseObject',
  )
  if (!existsSync(d1Dir)) {
    throw new Error(
      'Local D1 not found. Run `bun run db:migrate` (or `bun run dev`) first.',
    )
  }

  const sqliteFiles = readdirSync(d1Dir)
    .filter((name) => name.endsWith('.sqlite') && name !== 'metadata.sqlite')
    .map((name) => ({
      name,
      mtime: statSync(join(d1Dir, name)).mtimeMs,
    }))
    .sort((a, b) => b.mtime - a.mtime)

  if (sqliteFiles.length === 0) {
    throw new Error(
      'No local D1 database file found. Run `bun run db:migrate` first.',
    )
  }

  const filePath = join(d1Dir, sqliteFiles[0].name).replaceAll('\\', '/')
  return `file:${filePath}`
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: getLocalD1SqlitePath(),
  },
})
