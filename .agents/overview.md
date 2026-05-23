# TaskFlux — project overview

## Stack

- **Runtime:** Cloudflare Workers (via `@cloudflare/vite-plugin`)
- **App framework:** TanStack Start + TanStack Router (file-based routes in `src/routes/`)
- **UI:** React 19, Tailwind CSS v4, **shadcn/ui** (`components.json`, style: `new-york`)
- **Database:** Cloudflare D1 + **Drizzle ORM**
- **Auth:** Better Auth (`src/lib/auth.server.ts`, `src/routes/api/auth/$.ts`)
- **URL state (tasks):** `nuqs` (`src/lib/tasks-search-params.ts`)

## Layout

```
src/
  routes/          # Pages (createFileRoute)
  components/      # React components
    ui/            # shadcn primitives only
    tasks/         # Calendar / task UI
  server/          # createServerFn handlers
  db/              # Drizzle schema + index.server.ts
  lib/             # Shared utilities, types, clients
  hooks/           # React hooks
drizzle/           # SQL migrations + meta journal
.agents/           # Agent instructions (this folder)
```

## Path aliases

- `@/…` → `src/…` (components, lib, hooks)
- `#/…` → `src/…` (server, db, lib in server context)

## Tooling

**Bun** is the package manager and default CLI for agents — see [tooling.md](./tooling.md).

## Commands

| Command | Purpose |
|---------|---------|
| `bun run dev` | Dev server (runs `db:migrate` first) |
| `bun run build` | Production build |
| `bun run db:migrate` | Apply migrations locally |
| `bun run db:migrate:remote` | Apply migrations on remote D1 |

## Do not assume

- This repo is **not** the .NET solution referenced in workspace `rules.md` unless you are explicitly in that repo.
- Prefer **minimal diffs**; match existing patterns in the file you edit.
