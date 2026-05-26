# Database (D1 + Drizzle)

## Schema

- **App tables:** `src/db/schema.ts` (re-exports modules)
- **Auth tables:** `src/db/auth-schema.ts` (Better Auth; do not rename casually)
- **User settings:** `src/db/user-settings-schema.ts` → table `user_settings`
- **User roles:** `src/db/user-roles-schema.ts` → tables `user_role`, `user_role_history`

## Access

- Server-only: `getDb()` in `src/db/index.server.ts`
- Never import `index.server.ts` from client components.

## Migrations

1. Update Drizzle schema file(s).
2. Add SQL under `drizzle/NNNN_description.sql`.
3. Append entry to `drizzle/meta/_journal.json`.
4. Run `bun run db:migrate` (local) or `bun run db:migrate:remote` (deploy).

Follow existing migration style (`--> statement-breakpoint` where used).

## Conventions

- SQLite on D1: `integer` with `{ mode: 'timestamp_ms' }` for dates.
- `user_id` on user-owned rows → `references(() => user.id, { onDelete: 'cascade' })`.
- One settings row per user: `user_settings.user_id` is **primary key**.

## Tasks table (reference)

`tasks`: `id`, `userId`, `title`, `completed`, `createdAt`, `updatedAt`, `taskStartAt`, `taskEndsAt`.

## User settings (reference)

| Column | Values |
|--------|--------|
| `locale` | `en`, `es` (extend in `src/lib/user-settings.ts`) |
| `time_format` | `12h`, `24h` |
| `theme` | `light`, `dark`, `auto` |

Types and validation: `src/lib/user-settings.ts`.  
Server: `src/server/user-settings.ts` (`getUserSettings`, `updateUserSettings`).

## User roles (reference)

| Table | Purpose |
|-------|---------|
| `user_role` | Current role per user (`guest`, `paid`, `invited`, `admin`) |
| `user_role_history` | Audit trail of role assignments |

Types and validation: `src/lib/roles.ts`.  
Store: `src/server/user-role-store.ts`.  
Server: `src/server/user-roles.ts`.  
Business rules: `.agents/bussiness/roles.md`.

Migration `0005_user_roles` grants **admin** to all users that existed at apply time.
