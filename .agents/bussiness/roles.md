# User roles (business definition)

TaskFlux distinguishes four **application roles** for signed-in users. Anonymous visitors are not assigned a role in the database; they use the product without a persisted role until they create an account.

Roles describe **billing and access tier**, not Better Auth session mechanics. Feature gates (invoices, invitations, admin tools) will be implemented in later steps; this document is the source of truth for role meaning and data rules.

## Roles

### Guest (`guest`)

Users on the **free tier**.

- Default role for new accounts (unless assigned otherwise).
- Full product access within free-tier limits (to be defined in feature work).
- No monthly invoice or paid billing history.

### Paid (`paid`)

Users who **pay for usage** of the app.

- Billed monthly; each billing period is tied to an invoice record (future work).
- Can view their own **payment and invoice history**.
- Same product capabilities as the paid tier definition (invited users mirror this for access, not billing).

### Invited (`invited`)

Users who joined via a **special invitation link**.

- **Same feature access as Paid** while their invited status is active.
- **No monthly payment** while an admin confirms they remain invited.
- An admin must periodically affirm (or revoke) invited status; revocation or expiry moves them to another role (typically `guest` or `paid`), recorded in role history.

### Admin (`admin`)

Users who **operate the platform**.

- Invite users as **Invited**.
- Manage user roles and permissions.
- Access admin routes and server functions (e.g. `/admin/roles`).
- Broader operational capabilities will be added incrementally.

## Data model

| Table | Purpose |
|-------|---------|
| `user_role` | Current role per user (one row per `user_id`, PK). |
| `user_role_history` | Append-only audit of role assignments over time. |

### `user_role`

- `user_id` → `user.id` (cascade on delete).
- `role` → one of: `guest`, `paid`, `invited`, `admin`.
- `updated_at` → when the current role row was last changed.

### `user_role_history`

Each row is one **assignment event** (when a user entered a role):

- `user_id` — subject user.
- `role` — role assigned at `effective_at`.
- `effective_at` — timestamp when this assignment took effect.
- `changed_by_user_id` — admin who made the change, or `NULL` (system / migration).
- `note` — optional reason (e.g. migration, invitation revoked).

**Current role** is read from `user_role`. If no row exists, the effective role is **`guest`** (read-only default; no row is created until an explicit assignment).

**History** is never updated or deleted in normal operation; new assignments insert a new history row and upsert `user_role`.

## Assignment rules (current implementation)

1. Only **admins** may change another user’s role via `setUserRole`.
2. Assigning the same role again is a no-op (no duplicate history row).
3. Migration `0005_user_roles` grants **`admin`** to every user that existed at migration time, with a history note explaining the bootstrap.

## Out of scope (follow-up tasks)

- Sign-up hook defaulting new users to `guest` in `user_role` (optional; default read works without a row).
- Invitation links and invited-user approval workflow.
- Invoices and paid-user billing.
- Permission matrix per feature.
- UI copy and i18n for role names.

## Code references

| Area | Location |
|------|----------|
| Role constants & validation | `src/lib/roles.ts` |
| Drizzle schema | `src/db/user-roles-schema.ts` |
| DB operations | `src/server/user-role-store.ts` |
| Server functions | `src/server/user-roles.ts` |
| Admin guard | `src/server/auth.ts` (`requireAdmin`) |
| Admin UI route | `src/routes/admin/roles.tsx` |
| SQL migration | `drizzle/0005_user_roles.sql` |
