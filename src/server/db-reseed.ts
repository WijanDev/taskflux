import { generateId } from '@better-auth/core/utils/id'
import { createServerFn } from '@tanstack/react-start'
import { hashPassword } from 'better-auth/crypto'
import { ne } from 'drizzle-orm'

import { account, tasks, user, userSettings } from '#/db/schema'
import {
  assertNonProductionEnvironment,
  isProductionEnvironment,
} from '#/lib/environment'
import type { AppRole } from '#/lib/roles'
import { buildSeedUserIdentity } from '#/lib/seed-names'
import { DEFAULT_USER_SETTINGS } from '#/lib/user-settings'
import { requireAdmin } from '#/server/auth'
import { assignUserRole } from '#/server/user-role-store'

const SEED_USER_COUNT = 100
const SEED_PASSWORD = 'Test1234!'
const SEED_EMAIL_DOMAIN = 'taskflux.test'
const NON_ADMIN_ROLES = ['guest', 'paid', 'invited'] as const satisfies readonly AppRole[]

async function db() {
  const { getDb } = await import('#/db/index.server')
  return getDb()
}

function randomInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

function nextWeekScheduledRange(now: Date): { taskStartAt: Date; taskEndsAt: Date } {
  const start = new Date(now)
  start.setDate(start.getDate() + randomInt(1, 7))
  start.setHours(randomInt(8, 17), randomInt(0, 3) * 15, 0, 0)

  const end = new Date(start)
  end.setHours(start.getHours() + randomInt(1, 3), 0, 0, 0)

  return { taskStartAt: start, taskEndsAt: end }
}

function buildTasksForUser(userId: string, now: Date) {
  const taskCount = randomInt(5, 10)
  const scheduledCount = Math.round(taskCount * 0.8)
  const rows: (typeof tasks.$inferInsert)[] = []

  for (let index = 0; index < taskCount; index += 1) {
    const scheduled = index < scheduledCount
    const range = scheduled ? nextWeekScheduledRange(now) : null

    rows.push({
      userId,
      title: `Seed task ${index + 1}`,
      completed: Math.random() < 0.15,
      createdAt: now,
      updatedAt: now,
      taskStartAt: range?.taskStartAt ?? null,
      taskEndsAt: range?.taskEndsAt ?? null,
    })
  }

  return rows
}

export const getDbReseedAccess = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    await requireAdmin()
  } catch {
    return { canReseedDb: false as const }
  }

  return { canReseedDb: !isProductionEnvironment() }
})

export const reseedDatabase = createServerFn({ method: 'POST' }).handler(async () => {
  const adminUserId = await requireAdmin()
  assertNonProductionEnvironment('Database reseed')

  const connection = await db()
  const now = new Date()
  const passwordHash = await hashPassword(SEED_PASSWORD)
  const usedEmails = new Set<string>()

  await connection.delete(user).where(ne(user.id, adminUserId))

  let tasksCreated = 0
  let sampleSeedEmail = `maria_garcia@${SEED_EMAIL_DOMAIN}`

  for (let index = 0; index < SEED_USER_COUNT; index += 1) {
    const { name, email } = buildSeedUserIdentity(usedEmails, SEED_EMAIL_DOMAIN)
    if (index === 0) {
      sampleSeedEmail = email
    }

    const userId = generateId()
    const role = NON_ADMIN_ROLES[index % NON_ADMIN_ROLES.length]

    await connection.insert(user).values({
      id: userId,
      name,
      email,
      emailVerified: true,
      image: null,
      createdAt: now,
      updatedAt: now,
    })

    await connection.insert(account).values({
      id: generateId(),
      accountId: userId,
      providerId: 'credential',
      userId,
      password: passwordHash,
      createdAt: now,
      updatedAt: now,
    })

    await connection.insert(userSettings).values({
      userId,
      locale: DEFAULT_USER_SETTINGS.locale,
      timeFormat: DEFAULT_USER_SETTINGS.timeFormat,
      theme: DEFAULT_USER_SETTINGS.theme,
      createdAt: now,
      updatedAt: now,
    })

    await assignUserRole({
      userId,
      role,
      changedByUserId: adminUserId,
      note: 'db-reseed',
    })

    const taskRows = buildTasksForUser(userId, now)
    if (taskRows.length > 0) {
      await connection.insert(tasks).values(taskRows)
      tasksCreated += taskRows.length
    }
  }

  return {
    usersCreated: SEED_USER_COUNT,
    tasksCreated,
    seedPassword: SEED_PASSWORD,
    seedEmailPattern: sampleSeedEmail,
  }
})
