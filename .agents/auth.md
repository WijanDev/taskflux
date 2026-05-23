# Authentication & user scoping

## Better Auth

- Server config: `src/lib/auth.server.ts` (Drizzle adapter on D1).
- Client: `src/lib/auth-client.ts` (`authClient.useSession()`, `signIn`, `signOut`).
- API route: `src/routes/api/auth/$.ts`.

## Session in routes

```ts
const { getSession } = await import('#/server/session')
const session = await getSession()
```

Use in `beforeLoad` for guards; return `session` from `beforeLoad` when needed in the route.

## Data isolation

- All task queries **must** filter by `userId` from `requireUserId()`.
- `user_settings` rows are keyed by `userId` (PK).

## Sign-in / sign-up

- Routes: `src/routes/signin.tsx`, `signup.tsx`
- Shared form: `src/components/AuthForm.tsx`
- Default redirect after sign-in: `/tasks`

## Header

- Shows user name + Sign out when `session?.user` exists.
- Settings link only when authenticated (`/settings`).
