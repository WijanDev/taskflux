# Agent guidance (TaskFlux)

This folder contains **project-specific instructions for AI coding agents**. Read the relevant files before implementing changes.

## How to use

| When you work on… | Read |
|-------------------|------|
| Any change | [overview.md](./overview.md), [workflow.md](./workflow.md), [tooling.md](./tooling.md) |
| UI, styling, forms, dialogs | [ui-components.md](./ui-components.md) |
| D1, Drizzle, migrations | [database.md](./database.md) |
| Routes, loaders, server functions | [server-and-routes.md](./server-and-routes.md) |
| Sign-in, sessions, per-user data | [auth.md](./auth.md) |
| Tasks calendar, URL state, settings | [tasks-and-settings.md](./tasks-and-settings.md) |

## Keeping this up to date

When you establish a new convention or the user states a preference (e.g. “always use shadcn”), **add or update a file here** so future sessions stay consistent.

## Cursor / IDE

- Reference files with `@.agents/ui-components.md` (or the whole `.agents` folder) in prompts.
- Optionally symlink or copy key rules into `.cursor/rules/` if your setup supports it—these files remain the **source of truth** for TaskFlux.
