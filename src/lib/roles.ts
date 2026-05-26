export const APP_ROLES = ['guest', 'paid', 'invited', 'admin'] as const

export type AppRole = (typeof APP_ROLES)[number]

/** Default effective role when no `user_role` row exists. */
export const DEFAULT_APP_ROLE: AppRole = 'guest'

export type SetUserRoleInput = {
  userId: string
  role: AppRole
  note?: string | null
}

export function isAppRole(value: string): value is AppRole {
  return (APP_ROLES as readonly string[]).includes(value)
}

export function parseAppRole(value: string): AppRole {
  if (!isAppRole(value)) {
    throw new TypeError('Invalid role')
  }
  return value
}

export function parseSetUserRoleInput(data: SetUserRoleInput): SetUserRoleInput {
  parseAppRole(data.role)
  if (!data.userId.trim()) {
    throw new TypeError('Invalid user id')
  }
  return {
    userId: data.userId.trim(),
    role: data.role,
    note: data.note?.trim() ? data.note.trim() : null,
  }
}

export const ROLE_LABELS: Record<AppRole, string> = {
  guest: 'Guest',
  paid: 'Paid',
  invited: 'Invited',
  admin: 'Admin',
}
