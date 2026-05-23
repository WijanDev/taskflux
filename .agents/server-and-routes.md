# Server functions & routes

## Server functions

- Pattern: `createServerFn` from `@tanstack/react-start` in `src/server/`.
- Auth: `requireUserId()` from `src/server/auth.ts` for protected operations.
- DB: lazy `getDb()` import inside handlers (see `tasks.ts`).
- Validate input with `.inputValidator()`; throw clear `Error` messages.

## Routes

- File-based: `src/routes/*.tsx` → `createFileRoute('/path')`.
- Generated tree: `src/routeTree.gen.ts` (do not edit manually).
- Protected pages: `beforeLoad` → `getSession()` → `redirect` to `/signin` with `search: { redirect }`.

## Loaders & mutations

- Load data in route `loader` (e.g. `listTasks()`, `getUserSettings()`).
- After mutations, `router.invalidate()` to refresh loaders.
- Search params: `validateSearch` + schemas (e.g. `tasksSearchSchema` in `src/lib/tasks-search-params.ts`).

## Tasks URL state (`nuqs`)

| Param | Purpose |
|-------|---------|
| `view` | `daily` \| `weekly` \| `monthly` |
| `date` | `YYYY-MM-DD` string (not `Date` in URL schema) |
| `task` | Task id for detail dialog |

Hook: `useTasksUrlState()`.  
Batch view+date updates: `setCalendarAnchor({ view, date })`.

## Calendar navigation transitions

- Hook: `src/hooks/use-calendar-period-navigation.ts`
- Wrapper: `CalendarPeriodTransition`
- Period prev/next and view-mode changes set slide direction (`previous` / `next`).

## 404

- `NotFound` on root route + `defaultNotFoundComponent` in `src/router.tsx`.
