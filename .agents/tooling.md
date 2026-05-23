# Tooling — Bun

## Package manager & CLI

**Use [Bun](https://bun.sh) for all package-manager and agent-driven CLI work** in this repo.

| Do | Don't |
|----|--------|
| `bun install` | `npm install`, `pnpm install`, `yarn` |
| `bun add <pkg>` | `npm install <pkg>` |
| `bun add -d <pkg>` | `npm install -D <pkg>` |
| `bun remove <pkg>` | `npm uninstall` |
| `bun run <script>` | `npm run <script>` (unless the user explicitly uses npm) |
| `bunx <cli>` | `npx <cli>` |

Agents must run scripts and one-off tools through **bun** / **bunx**, not npm or npx.

## Common commands

| Task | Command |
|------|---------|
| Dev server | `bun run dev` |
| Production build | `bun run build` |
| Tests | `bun run test` |
| Lint | `bun run lint` |
| Local D1 migrations | `bun run db:migrate` |
| Remote D1 migrations | `bun run db:migrate:remote` |
| Deploy | `bun run deploy` |
| shadcn component | `bunx shadcn@latest add <name> --yes` (see below) |

Scripts are defined in `package.json`; `bun run` executes them the same way npm would.

## shadcn

**Always pass `--yes`.** The shadcn CLI prompts interactively (e.g. “overwrite existing file?”). Agents cannot answer those prompts and will **hang** until the command times out.

```bash
bunx shadcn@latest add <component> --yes --overwrite
```

| Flag | Purpose |
|------|---------|
| `--yes` | **Required** — auto-accept all prompts |
| `--overwrite` | Use when replacing an existing stub (e.g. custom `select.tsx`) |

Never run `bunx shadcn@latest add …` without `--yes` in agent sessions.

## When npm might appear

- User or CI may still document `npm run …` in places—prefer **`bun run …`** for agent actions unless the user says otherwise.
- `package-lock.json` / `pnpm-lock.yaml` are not the source of truth here; use **`bun.lock`** if present after installs.

## Verification checklist (agents)

After meaningful changes:

1. `bun run db:migrate` — if schema/migrations changed  
2. `bun run build` — before considering work done  
