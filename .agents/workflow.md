# Workflow & collaboration

## Scope

- Implement **only what was asked**. No drive-by refactors, extra features, or doc files unless requested.
- Prefer the **smallest correct change** over abstractions or “future-proofing.”

## Git

- **Do not commit** unless the user explicitly asks.
- **Do not push** unless explicitly asked.
- Never use destructive git commands (`push --force`, `reset --hard`) without explicit approval.

## Tooling (Bun)

- Use **Bun** for installs, scripts, and CLIs — see [tooling.md](./tooling.md).
- `bun install` / `bun add` / `bun run` / `bunx` — not `npm`, `npx`, or `pnpm`.

## Dependencies

- Add packages only when needed (`bun add …`).
- For UI primitives, use **shadcn CLI** with **`--yes`** (and `--overwrite` if needed) — see [ui-components.md](./ui-components.md). Omitting `--yes` blocks the agent on interactive prompts.

## Verification

- Run `bun run build` after non-trivial changes.
- Run `bun run db:migrate` when adding migrations (local).
- Do not add tests unless the user asks or they clearly add meaningful coverage.

## Communication

- Use **code citations** (`startLine:endLine:path`) when referencing existing code.
- Keep responses proportional to task size.
- If requirements are ambiguous, ask **one focused question** rather than guessing large behavior.

## User-stated preferences (keep in sync)

| Preference | Detail |
|------------|--------|
| Package manager / CLI | **Bun** (`bun`, `bunx`, `bun run`) for all agent-driven installs and scripts |
| UI components | Use **shadcn**; do not hand-roll primitives unless the user explicitly allows it |
| shadcn CLI | Always `bunx shadcn@latest add … --yes` (non-interactive); add `--overwrite` when replacing files |
| Commits / PRs | Only when requested; use `gh` for GitHub when creating PRs |

Update this table when the user adds new standing instructions.
