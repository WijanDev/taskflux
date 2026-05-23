# UI components

## Rule: use shadcn, not custom primitives

**Do not implement custom UI primitives** (select, dialog, dropdown, tabs, etc.) unless the user **explicitly** asks for a custom component.

### Adding a component

1. Check `src/components/ui/` for an existing shadcn component.
2. If missing, add via CLI from repo root:

   ```bash
   bunx shadcn@latest add <component> --yes --overwrite
   ```

   **`--yes` is mandatory** — without it the CLI asks to confirm overwrites and the agent blocks waiting for input. Use `--overwrite` when replacing a stub (e.g. custom `select.tsx`). See [tooling.md](./tooling.md).

3. Configure in `components.json` (style: `new-york`, aliases: `@/components`, `@/lib/utils`).

### Styling

- **Tailwind v4** in `src/styles.css` (`@import "tailwindcss"`, `@theme inline`, CSS variables for light/dark).
- Use `cn()` from `@/lib/utils` for class merging.
- Match patterns in existing shadcn files (`button.tsx`, `input.tsx`, `dialog.tsx`, `popover.tsx`).
- Theme helpers: `src/lib/theme.ts` (`ThemeMode`, `applyThemeMode`, `withThemeTransition`).

### App-level components

| Area | Location |
|------|----------|
| shadcn primitives | `src/components/ui/` |
| Layout (header, shell) | `src/components/` |
| Task/calendar domain | `src/components/tasks/` |

### Icons

- **lucide-react** (same as shadcn defaults).

### Accessibility

- Keep labels associated with controls (`Label` + `htmlFor` / `id`).
- Prefer Radix-based shadcn components for keyboard and ARIA behavior.

### z-index

- Popovers/date pickers in dialogs: high z-index (e.g. `z-[250]`) — see `popover.tsx`, `dialog.tsx`.
- Dialog uses `show()` not `showModal()` so portaled content works.

### Responsive

- Tasks route uses mobile-specific layouts (`md:` breakpoints); preserve desktop behavior when changing mobile UI.
