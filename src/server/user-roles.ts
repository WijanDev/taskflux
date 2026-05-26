import { createServerFn } from '@tanstack/react-start'

import { parseListAdminUsersQuery } from '#/server/admin-users-query'
import type { ListAdminUsersQuery } from '#/lib/admin-users-query'
import {
  ROLE_LABELS,
  parseAppRole,
  parseSetUserRoleInput
  
} from '#/lib/roles'
import type { AppRole, SetUserRoleInput } from '#/lib/roles'

import { requireAdmin, requireUserId } from '#/server/auth'
import {
  assignUserRole,
  getAdminUserDetail,
  getEffectiveRole,
  getUserRoleRow,
  listUserRoleHistory,
  listUsersWithRolesPaged,
} from '#/server/user-role-store'
import type { AdminUserDetailRecord, UserWithRole } from '#/server/user-role-store'

export const getMyRole = createServerFn({ method: 'GET' }).handler(async () => {
  const userId = await requireUserId()
  const role = await getEffectiveRole(userId)
  const row = await getUserRoleRow(userId)

  return {
    userId,
    role,
    label: ROLE_LABELS[role],
    updatedAt: row?.updatedAt ?? null,
  }
})

export const getMyRoleHistory = createServerFn({ method: 'GET' }).handler(
  async () => {
    const userId = await requireUserId()
    const history = await listUserRoleHistory(userId)

    return history.map((entry) => ({
      id: entry.id,
      userId: entry.userId,
      role: parseAppRole(entry.role),
      label: ROLE_LABELS[parseAppRole(entry.role)],
      effectiveAt: entry.effectiveAt,
      changedByUserId: entry.changedByUserId,
      note: entry.note,
    }))
  },
)

export type AdminUserRow = UserWithRole & { label: string }

export type ListUsersForRoleAdminPage = {
  items: AdminUserRow[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export const listUsersForRoleAdmin = createServerFn({ method: 'GET' })
  .inputValidator((data: ListAdminUsersQuery) => parseListAdminUsersQuery(data))
  .handler(async ({ data }) => {
    await requireAdmin()
    const page = await listUsersWithRolesPaged(data)

    return {
      ...page,
      items: page.items.map((entry) => ({
        ...entry,
        label: ROLE_LABELS[entry.role],
      })),
    } satisfies ListUsersForRoleAdminPage
  })

export type AdminUserDetail = AdminUserDetailRecord & {
  label: string
  history: Array<{
    id: number
    role: AppRole
    label: string
    effectiveAt: Date
    changedByUserId: string | null
    note: string | null
  }>
}

type GetUserForAdminInput = {
  userId: string
}

function parseGetUserForAdminInput(data: GetUserForAdminInput) {
  const trimmed = data.userId.trim()
  if (!trimmed) {
    throw new TypeError('Invalid user id')
  }
  return { userId: trimmed }
}

export const getUserForAdmin = createServerFn({ method: 'GET' })
  .inputValidator((data: GetUserForAdminInput) => parseGetUserForAdminInput(data))
  .handler(async ({ data: { userId: targetUserId } }) => {
    await requireAdmin()
    const userRow = await getAdminUserDetail(targetUserId)

    if (!userRow) {
      throw new Error('User not found')
    }

    const history = await listUserRoleHistory(targetUserId)

    return {
      ...userRow,
      label: ROLE_LABELS[userRow.role],
      history: history.map((entry) => ({
        id: entry.id,
        role: parseAppRole(entry.role),
        label: ROLE_LABELS[parseAppRole(entry.role)],
        effectiveAt: entry.effectiveAt,
        changedByUserId: entry.changedByUserId,
        note: entry.note,
      })),
    } satisfies AdminUserDetail
  })

export const setUserRole = createServerFn({ method: 'POST' })
  .inputValidator((data: SetUserRoleInput) => parseSetUserRoleInput(data))
  .handler(async ({ data }) => {
    const adminId = await requireAdmin()
    const updated = await assignUserRole({
      userId: data.userId,
      role: data.role,
      changedByUserId: adminId,
      note: data.note,
    })

    const role = parseAppRole(updated.role)

    return {
      userId: updated.userId,
      role,
      label: ROLE_LABELS[role],
      updatedAt: updated.updatedAt,
    }
  })
