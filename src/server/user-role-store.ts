import { and, count, desc, eq, isNull, like, or, sql } from 'drizzle-orm'

import { tasks, user, userRole, userRoleHistory } from '#/db/schema'
import type { ListAdminUsersQuery } from '#/lib/admin-users-query'
import { sanitizeAdminUsersSearch } from '#/server/admin-users-query'
import {
  DEFAULT_APP_ROLE,
  parseAppRole
  
} from '#/lib/roles'
import type {AppRole} from '#/lib/roles';

async function db() {
  const { getDb } = await import('#/db/index.server')
  return getDb()
}

export async function getEffectiveRole(userId: string): Promise<AppRole> {
  const connection = await db()
  const [row] = await connection
    .select({ role: userRole.role })
    .from(userRole)
    .where(eq(userRole.userId, userId))

  if (!row) {
    return DEFAULT_APP_ROLE
  }

  return parseAppRole(row.role)
}

export async function getUserRoleRow(userId: string) {
  const connection = await db()
  const [row] = await connection
    .select()
    .from(userRole)
    .where(eq(userRole.userId, userId))

  return row ?? null
}

export async function listUserRoleHistory(userId: string) {
  const connection = await db()
  return connection
    .select()
    .from(userRoleHistory)
    .where(eq(userRoleHistory.userId, userId))
    .orderBy(desc(userRoleHistory.effectiveAt), desc(userRoleHistory.id))
}

export type UserWithRole = {
  id: string
  name: string
  email: string
  createdAt: Date
  role: AppRole
  roleUpdatedAt: Date | null
}

export async function countAdminUsers(): Promise<number> {
  const connection = await db()
  const rows = await connection
    .select({ id: userRole.userId })
    .from(userRole)
    .where(eq(userRole.role, 'admin'))

  return rows.length
}

function mapUserWithRoleRow(row: {
  id: string
  name: string
  email: string
  createdAt: Date
  role: string | null
  roleUpdatedAt: Date | null
}): UserWithRole {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.createdAt,
    role: row.role ? parseAppRole(row.role) : DEFAULT_APP_ROLE,
    roleUpdatedAt: row.roleUpdatedAt ?? null,
  }
}

const userWithRoleSelect = {
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  role: userRole.role,
  roleUpdatedAt: userRole.updatedAt,
} as const

function buildAdminUsersWhere(query: ListAdminUsersQuery) {
  const conditions = []

  const search = sanitizeAdminUsersSearch(query.search)
  if (search) {
    const pattern = `%${search.toLowerCase()}%`
    conditions.push(
      or(
        like(sql`lower(${user.name})`, pattern),
        like(sql`lower(${user.email})`, pattern),
      ),
    )
  }

  if (query.role !== 'all') {
    if (query.role === DEFAULT_APP_ROLE) {
      conditions.push(or(isNull(userRole.role), eq(userRole.role, DEFAULT_APP_ROLE)))
    } else {
      conditions.push(eq(userRole.role, query.role))
    }
  }

  return conditions.length > 0 ? and(...conditions) : undefined
}

export type PagedUsersWithRoles = {
  items: UserWithRole[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export async function listUsersWithRolesPaged(
  query: ListAdminUsersQuery,
): Promise<PagedUsersWithRoles> {
  const connection = await db()
  const where = buildAdminUsersWhere(query)
  const offset = (query.page - 1) * query.pageSize

  const baseFrom = connection
    .select(userWithRoleSelect)
    .from(user)
    .leftJoin(userRole, eq(user.id, userRole.userId))

  const countFrom = connection
    .select({ total: count(user.id) })
    .from(user)
    .leftJoin(userRole, eq(user.id, userRole.userId))

  const [countRow] = where
    ? await countFrom.where(where)
    : await countFrom

  const total = countRow?.total ?? 0
  const totalPages = total === 0 ? 0 : Math.ceil(total / query.pageSize)

  const rows = where
    ? await baseFrom
        .where(where)
        .orderBy(user.email)
        .limit(query.pageSize)
        .offset(offset)
    : await baseFrom.orderBy(user.email).limit(query.pageSize).offset(offset)

  return {
    items: rows.map(mapUserWithRoleRow),
    total,
    page: query.page,
    pageSize: query.pageSize,
    totalPages,
  }
}

export async function assignUserRole({
  userId,
  role,
  changedByUserId,
  note,
}: {
  userId: string
  role: AppRole
  changedByUserId: string | null
  note?: string | null
}) {
  const connection = await db()
  const [existing] = await connection
    .select()
    .from(userRole)
    .where(eq(userRole.userId, userId))

  if (existing?.role === role) {
    return existing
  }

  if (existing?.role === 'admin' && role !== 'admin') {
    const adminCount = await countAdminUsers()
    if (adminCount <= 1) {
      throw new Error('Cannot remove the last admin')
    }
  }

  const now = new Date()

  if (existing) {
    const [updated] = await connection
      .update(userRole)
      .set({ role, updatedAt: now })
      .where(eq(userRole.userId, userId))
      .returning()

    await connection.insert(userRoleHistory).values({
      userId,
      role,
      effectiveAt: now,
      changedByUserId,
      note: note ?? null,
    })

    return updated
  }

  const [created] = await connection
    .insert(userRole)
    .values({ userId, role, updatedAt: now })
    .returning()

  await connection.insert(userRoleHistory).values({
    userId,
    role,
    effectiveAt: now,
    changedByUserId,
    note: note ?? null,
  })

  return created
}

export type AdminUserDetailRecord = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  createdAt: Date
  updatedAt: Date
  role: AppRole
  roleUpdatedAt: Date | null
  taskCount: number
}

export async function getAdminUserDetail(
  userId: string,
): Promise<AdminUserDetailRecord | null> {
  const connection = await db()

  const [row] = await connection
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      role: userRole.role,
      roleUpdatedAt: userRole.updatedAt,
    })
    .from(user)
    .leftJoin(userRole, eq(user.id, userRole.userId))
    .where(eq(user.id, userId))

  if (!row) {
    return null
  }

  const [taskCountRow] = await connection
    .select({ count: count() })
    .from(tasks)
    .where(eq(tasks.userId, userId))

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    emailVerified: row.emailVerified,
    image: row.image,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    role: row.role ? parseAppRole(row.role) : DEFAULT_APP_ROLE,
    roleUpdatedAt: row.roleUpdatedAt ?? null,
    taskCount: taskCountRow?.count ?? 0,
  }
}
