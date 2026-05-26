# SonarLint / SonarQube rules (TaskFlux)

Sonar issues appear in the IDE as **sonarqube** diagnostics (SonarQube for IDE / SonarLint). This file lists rules **currently reported in this repo** and how to fix them. Agents must follow these conventions on every change and must not introduce new errors while fixing Sonar issues.

> **Note:** `bun run lint` runs **ESLint** (`@tanstack/eslint-config`), not Sonar. Several rules overlap (see [Overlap with ESLint](#overlap-with-eslint)). Fix Sonar warnings in touched files even when ESLint passes.

> **Do not introduce an error when fixing an error.** A Sonar fix must not create new TypeScript, ESLint, runtime, or behavioral problems. After each change, verify touched files (`bunx tsc --noEmit`, IDE diagnostics, `bun run lint` where relevant). If the obvious Sonar fix breaks something, use an equivalent approach that stays correct, or leave the warning and note why.

---

## General principles

### No regressions while fixing Sonar issues

**Intent:** Clearing a Sonar warning is not success if the codebase is worse afterward.

**Do:**

- Run `bunx tsc --noEmit` (or confirm no new errors in the IDE) on files you changed.
- Re-read lints/Sonar on the same file — the original issue should be gone and no new ones added.
- Prefer minimal, behavior-preserving diffs; extract helpers only when complexity/readability truly need it.
- When a rule fix conflicts with types or product behavior, find another compliant pattern (e.g. local `GithubIcon` instead of deprecated lucide `Github`) rather than forcing a broken change.

**Don’t:**

- Apply a mechanical fix that introduces `TS` errors, broken imports, or changed UX without checking.
- Silence or disable rules to “fix” Sonar without addressing the underlying issue.
- Refactor unrelated code in the same pass unless the user asked for it.

---

## Rules active in this codebase

Scan source: Sonar diagnostics on `src/**/*.ts(x)` (excluding `routeTree.gen.ts`).

| Rule key | Name | Severity | Message (typical) | Files with findings |
|----------|------|----------|-------------------|---------------------|
| `typescript:S6759` | prefer-read-only-props | Minor | Mark the props of the component as read-only. | All component props in `src/**` — named `*Props` or inline destructuring — use `Readonly<{ ... }>` |
| `typescript:S4325` | no-unnecessary-type-assertion | Minor | This assertion is unnecessary… | `MonthCalendarView.tsx`, `TasksViewModeMenu.tsx` (see rule section) |
| `typescript:S1874` | deprecation | Minor | Deprecated APIs (e.g. `FormEvent`, lucide brand icons). | `SubmitEvent` for forms; `GithubIcon` instead of lucide `Github` |
| `typescript:S3776` | cognitive-complexity | Critical | Cognitive Complexity of functions should not be too high | `tasks.tsx` (`TasksPage`), `TaskDetailDialog.tsx` (refactored — keep new helpers low) |
| `typescript:S6582` | prefer-optional-chain | Minor | Optional chaining should be preferred | `tasks.tsx` (`TaskDetailDialog` props), `dates.ts` (empty string checks) |
| `typescript:S7764` | use-global-this | Minor | Use `globalThis` instead of `window`, `self`, or `global` | `theme.ts`, `cookies.ts`, `MonthCalendarView.tsx`, hooks, `__root.tsx` init scripts, etc. |
| `typescript:S7741` | no-typeof-undefined | Minor | `"typeof" should not be used to check for "undefined"` | Use `isBrowser()` / `hasDocument()` from `@/lib/runtime` (not `typeof x === 'undefined'`) |
| `typescript:S6819` | prefer-tag-over-role | Minor | Prefer tag over ARIA role | `alert.tsx`, `TasksViewModeMenu.tsx` (use semantic elements / Radix Select, not `role="listbox"` on `<ul>`) |
| `typescript:S1128` | unused-import | Minor | Remove this unused import of '…'. | Delete unused named/default/type imports; verify with `tsc` (`TS6133`) or IDE Sonar |
| `typescript:S7735` | no-inverted-boolean-check | Minor | Unexpected negated condition. | Prefer positive `if` / ternary when an `else` (or `: …`) branch exists — e.g. `setCalendarAnchor` spreads in `tasks-search-params.ts` |
| `typescript:S6850` | heading-has-content | Minor | Heading elements should have accessible content. | `DialogTitle` in `dialog.tsx` — explicit `children`, not self-closing `<h2 />` |
| `typescript:S3735` | no-void | Minor | Remove this use of the "void" operator. | Use `.catch(() => {})`, `commitSearch` helper, or pass async handlers — not `void promise()` |
| `typescript:S7786` | use-type-error | Minor | Use `TypeError` after type/value checks. | `dates.ts`, `roles.ts`, `user-settings.ts`, `server/tasks.ts` (`Number.isInteger`), validators |
| `typescript:S3358` | no-nested-conditional | Minor | Extract nested ternary. | `ThemeToggle.tsx`, `theme.ts`, `__root.tsx` init scripts — use `if` / helpers |
| `typescript:S7761` | prefer-dataset | Minor | Use `.dataset` for `data-*` attributes. | `theme.ts` (`setRootThemeDataset`), `theme-init-script.ts` — not `setAttribute('data-theme')` |
| `typescript:S7721` | move-function-to-outer-scope | Minor | Move function '…' to the outer scope. | Nested helpers that do not close over locals → module scope; reuse existing exports (e.g. `formatWeekRange` from `task-calendar`) |
| `typescript:S7765` | prefer-includes | Minor | Use `.includes()` instead of `.indexOf()` / `.lastIndexOf()` / `.some(…===…)`. | `roles.ts`, `user-settings.ts`, `tasks-search-params.ts` type guards on `as const` arrays |
| `typescript:S6564` | redundant-type-alias | Minor | Remove redundant type alias; use underlying type. | `CalendarDateParam` → `string` in `tasks-search-params.ts` |

**Fixed in prior passes (keep pattern):** readonly props, `SubmitEvent`, complexity extractions (`useTasksPageActions`, `TasksCalendarViews`, etc.).

---

## Rule details & fixes

### `typescript:S6819` — Prefer tag over ARIA role

**Intent:** Use native HTML elements (or library primitives built on them) instead of `role="..."` on generic tags like `<div>` or `<ul>`.

**Do:**

```typescript
// Bad — custom listbox
<ul role="listbox">
  <li role="option"><button role="menuitem">…</button></li>
</ul>

// Good — shadcn Select (Radix uses native combobox/listbox semantics)
<Select value={value} onValueChange={onChange}>
  <SelectTrigger aria-label="…"><SelectValue /></SelectTrigger>
  <SelectContent>
    <SelectItem value="daily">…</SelectItem>
  </SelectContent>
</Select>

// Bad — alert role on div
<div role="alert">…</div>

// Good — assertive live region without redundant role (no HTML <alert> element)
<div aria-live="assertive" aria-atomic="true">…</div>
```

**Apply to:** Pickers → `Select`; actions → `button` / `a`; menus → Radix/shadcn primitives. Use `Button`, `Link`, not `div` + `role="button"`.

**Don’t:** Add ARIA roles that duplicate semantics already provided by a component or element.

---

### `typescript:S7741` — Do not use `typeof` for `undefined`

**Intent:** Prefer direct `undefined` checks (`x === undefined`, `x !== undefined`) over `typeof x === 'undefined'`. The `typeof` form is verbose and can be wrong for non-declared bindings.

**Do:**

```typescript
// Bad
if (typeof window === 'undefined') return
if (typeof document !== 'undefined') { ... }

// Good — browser / DOM guards (SSR-safe, uses globalThis per S7764)
import { isBrowser, hasDocument } from '@/lib/runtime'

if (!isBrowser()) return
if (hasDocument()) { ... }

// Good — when the value is already in scope
if (value === undefined) return
```

**Runtime helpers:** `src/lib/runtime.ts` exports `isBrowser()` (`'localStorage' in globalThis`) and `hasDocument()` (`'document' in globalThis`). Use these instead of `typeof` guards or bare `document` / `window` checks on the server.

**Don’t:** Use bare `document === undefined` in modules — `document` may be undeclared on the server and throw; go through `globalThis`.

---

### `typescript:S7764` — Use `globalThis`

**Intent:** Access globals in a way that works in browsers, workers, and Node without assuming `window`.

**Do:**

```typescript
// Bad
window.setTimeout(fn, 200)
window.localStorage.setItem('theme', mode)

// Good
globalThis.setTimeout(fn, 200)
globalThis.localStorage.setItem('theme', mode)
```

**SSR / browser detection:** Use `isBrowser()` from `@/lib/runtime` (see S7741), not `typeof globalThis.window`.

**Apply to:** Timers, `localStorage`, `matchMedia`, `addEventListener`, and inline `<script>` snippets in `__root.tsx`.

**Don’t:** Use `window` / `self` / `global` in application TypeScript.

---

### `typescript:S6582` — Prefer optional chaining

**Intent:** Replace `a && a.b`, `a && a.method()`, and `a != null && a.b` with `a?.b` / `a?.method()` when safe. Optional chaining short-circuits on `null`/`undefined` instead of relying on truthiness (so `0` or `''` are handled correctly on the receiver).

**Do:**

```typescript
// Bad
selectedTask != null && actions.editingId === selectedTask.id
value == null || value.trim() === ''

// Good
actions.editingId === selectedTask?.id
!value?.trim()

// Chained access
foo && foo.bar && foo.bar.baz  →  foo?.bar?.baz

// Optional call
obj && obj.dispose()  →  obj?.dispose()
```

**Don’t:** Rewrite when the left side is a different object than the property source (`selectedTask && actions.startEdit(selectedTask)` — use an early return or `selectedTask?.id` guard, not `actions?.startEdit`).

**Don’t:** Use `?.` when the context type excludes `undefined` and `strictNullChecks` would break (Sonar suppresses those cases).

---

### `typescript:S3776` — Cognitive complexity

**Intent:** Functions should stay easy to follow. Sonar’s default threshold is **15**.

**Do:** Extract hooks, pure helpers (`getTasksViewNavLabels`), subcomponents, early returns.

**Don’t:** Grow route components with many handlers, nested ternaries, and inline dialogs in one function.

---

### `typescript:S1128` — Remove unnecessary imports

**Intent:** Every import must be used in the file. Dead imports add noise and can hide real dependencies.

**Do:**

```typescript
// Bad — leftover after refactor
import { toDatetimeLocalValue } from '@/lib/dates'

// Good — remove the line entirely (including type-only imports you no longer reference)
```

**Verify:** `bunx tsc --noEmit` reports `TS6133` for unused locals (includes unused imports with `verbatimModuleSyntax`). Sonar shows `Remove this unused import of '…'` in the IDE.

**Don’t:** Keep “just in case” imports; re-add when you actually use the symbol.

---

### `typescript:S6850` — Headings must have accessible content

**Intent:** Every `h1`–`h6` must expose a name to assistive tech (visible text, or `aria-label` / `aria-labelledby`). Self-closing headings or headings with only decorative content fail this rule.

**Do:**

```typescript
// Bad — Sonar sees an empty heading (children only via spread)
function DialogTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return <h2 className={className} {...props} />
}

// Good — required children, explicit body
type DialogTitleProps = Readonly<
  Omit<React.ComponentProps<'h2'>, 'children'> & { children: ReactNode }
>

function DialogTitle({ className, children, ...props }: DialogTitleProps) {
  return (
    <h2 className={className} {...props}>
      {children}
    </h2>
  )
}
```

**Apply to:** `DialogTitle`, page `<h1>` / `<h2>` (always include text or `t('…')`), not icon-only headings without `aria-label`.

**Don’t:** Use `CardTitle` (`div`) when you need a document heading — use real `h*` elements or Radix Dialog `Title`.

---

### `typescript:S7735` — Avoid negated conditions with else

**Intent:** When both branches are present (`else` or ternary `: …`), avoid leading with `!condition` — swap branches or reorder `if` / `else if` so the condition in the branch that has an `else` reads positively.

**Do:**

```typescript
// Bad — else follows negated if
if (open && !dialog.open) {
  dialog.show()
} else if (!open && dialog.open) {
  dialog.close()
}

// Good — reorder; same behavior, positive else-if
if (!open && dialog.open) {
  dialog.close()
} else if (open && !dialog.open) {
  dialog.show()
}

// Bad — ternary
className={!hasSchedule ? 'sm:col-span-2' : undefined}

// Good — swap arms
className={hasSchedule ? undefined : 'sm:col-span-2'}

// Bad
error={detailDialogOpen && !actions.addDialogOpen ? actions.error : null}

// Good — assign without else (avoids nested ternary / S7735)
let taskDetailError: string | null = null
if (detailDialogOpen && !actions.addDialogOpen) {
  taskDetailError = actions.error
}

// Bad — optional spread patch
...(options.view !== undefined ? { view: options.view } : {})

// Good — swap arms (empty object is the “else”)
...(options.view === undefined ? {} : { view: options.view })
```

**Don’t:** Change early-return guards (`if (!x) return`) with no `else`. Prefer `if` + assignment over nested ternaries when Sonar also flags complexity.

---

### `typescript:S6759` — React props should be read-only

**Intent:** Props types must be immutable.

**Do:** `type FooProps = Readonly<{ ... }>` on every component props type (including inline destructuring like `function Badge({ x }: { x: string })` — extract a `Readonly<{ ... }>` alias).

**Gaps to watch:** `TaskStatusBadge` in `TaskDialogChrome.tsx`, route helpers (`RootDocument`, `AboutBadge`).

---

### `typescript:S4325` — Redundant type assertions / non-null assertions

**Intent:** Remove `!` and `as` that TypeScript already proves, or replace with guards / branching.

**Do:**

```typescript
// Bad — non-null assertion
let start = task.taskStartAt ?? startOfDay(task.taskEndsAt!)

// Good — explicit branches after overlap check
if (startsAt && endsAt) {
  start = startsAt
  end = endsAt
} else if (startsAt) { ... }

// Bad — redundant cast on Select value
onValueChange={(next) => onChange(next as TasksViewMode)}

// Good — type guard
onValueChange={(next) => {
  if (isTasksViewMode(next)) onChange(next)
}}

// Bad — cast for readonly tuple .includes
return (APP_ROLES as readonly string[]).includes(value)

// Good
return APP_ROLES.some((role) => role === value)
```

**Apply to:** `task-calendar.ts`, `formatting.ts`, Select handlers (`Header`, `settings`, `TasksViewModeMenu`, `admin/roles`), router state (`isSettingsSaveNavigationState` in `page-transition.ts`).

**Don’t:** Remove `as const` on literals or necessary `as` for CSS custom properties on `sonner` when types require it.

---

### `typescript:S3735` — Do not use the `void` operator

**Intent:** The `void` operator is used to discard promise return values (`void setSearch(...)`, `void router.navigate(...)`). Sonar prefers explicit handling.

**Do:**

```typescript
// Bad
void setSearch({ view: mode })
void router.navigate({ to: '/tasks' })
onSignOut={() => void handleSignOut()}

// Good — explicit rejection handler
setSearch({ view: mode }).catch(() => {})

// Good — local helper in hooks with many updates
function commitSearch(...args: Parameters<typeof setSearch>) {
  setSearch(...args).catch(() => {})
}

// Good — widen handler type and pass async function
onSignOut: () => void | Promise<void>
onSignOut={handleSignOut}
```

**Note:** `() => void` in **type annotations** (callbacks) is fine — the rule targets the **`void` operator**, not the `void` type.

---

### `typescript:S7761` — Use `.dataset` for data attributes

**Intent:** Prefer the DOM `dataset` API over `getAttribute` / `setAttribute` / `removeAttribute` for `data-*` attributes.

**Do:**

```typescript
// Bad
root.setAttribute('data-theme', mode)
root.removeAttribute('data-theme')

// Good — data-theme → dataset.theme
root.dataset.theme = mode
delete root.dataset.theme
```

**Apply to:** `setRootThemeDataset` / `applyThemeMode` in `theme.ts` and `THEME_INIT_SCRIPT` in `theme-init-script.ts` (imported by `__root.tsx`).

**Note:** JSX `data-slot="…"` props are fine; this rule targets imperative DOM APIs.

---

### `typescript:S3358` — Do not nest ternary operators

**Intent:** Nested `a ? b : c ? d : e` is hard to read. Prefer `if`/`else`, early return, or named helpers.

**Do:**

```typescript
// Bad
const next = mode === 'light' ? 'dark' : mode === 'dark' ? 'auto' : 'light'
const resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode

// Good — helpers in theme.ts
const next = getNextThemeMode(mode)
const resolved = resolveThemeAppearance(mode, prefersDark)

// Good — subcomponent instead of nested JSX ternary
function ThemeModeIcon({ mode }: ThemeModeIconProps) {
  if (mode === 'dark') return <Moon ... />
  if (mode === 'auto') return <Computer ... />
  return <Sun ... />
}
```

**Apply to:** theme cycling, labels, inline `__root.tsx` boot scripts (use `if`/`else if` chains).

---

### `typescript:S7786` — Use `TypeError` after type checking

**Intent:** When code validates types or values (`isAppRole`, `Number.isNaN`, `Number.isInteger`, type guards) and then throws, use `TypeError` instead of generic `Error`.

**Do:**

```typescript
// Bad — after type guard / NaN check
if (!isAppLocale(data.locale)) {
  throw new Error('Invalid language')
}
if (Number.isNaN(ms)) {
  throw new Error('Invalid date')
}
if (!Number.isInteger(data.id)) {
  throw new Error('Invalid task id')
}

// Good
throw new TypeError('Invalid language')
throw new TypeError('Invalid date')
throw new TypeError('Invalid task id')
```

**Keep `Error` for:** auth (`Unauthorized`), not-found (`Task not found`), business rules (`Title is required`, `End must be on or after start`), React context misuse, API/auth failures.

---

### `typescript:S6564` — No redundant type aliases

**Intent:** Do not alias a type to itself (e.g. `type Foo = string` with no added structure). Use the underlying type and document format in JSDoc on functions/constants instead.

**Do:**

```typescript
// Bad — alias adds nothing
export type CalendarDateParam = string
export function formatCalendarDateParam(date: Date): CalendarDateParam { ... }

// Good
/** URL calendar date (`YYYY-MM-DD`). */
export function formatCalendarDateParam(date: Date): string { ... }
serialize(value: string | Date) { ... }
```

**Keep aliases when:** they narrow or compose types (`type AppRole = (typeof APP_ROLES)[number]`, unions with literals, branded types with distinct runtime checks).

---

### `typescript:S7765` — Prefer `.includes()` for existence checks

**Intent:** Use `.includes()` when checking whether a value exists in an array or string — not `.indexOf(x) !== -1`, `.lastIndexOf`, or `.some((item) => item === x)`.

**Do:**

```typescript
// Bad
if (roles.indexOf(value) !== -1) { ... }
return MODES.some((mode) => mode === value)

// Good — `as const` tuples: cast for `string` membership + type predicate
export function isAppRole(value: string): value is AppRole {
  return (APP_ROLES as readonly string[]).includes(value)
}
```

**Keep `.some()` when:** the predicate is not simple equality (e.g. `tasks.some((t) => t.done && t.due < now)`).

---

### `typescript:S7721` — Move function to the highest possible scope

**Intent:** Nested functions that do not use variables from an enclosing scope should live at module (or outer) scope — easier to test, reuse, and tree-shake.

**Do:**

```typescript
// Bad — nested helper does not use locale / formatters from createFormatters
export function createFormatters(locale: AppLocale) {
  function formatWeekRange(weekStart: Date): string {
    return `${formatCalendarDate(start)} - ${formatCalendarDate(end)}`
  }
  return { formatWeekRange }
}

// Good — reuse existing module export
import { formatWeekRange } from '@/lib/task-calendar'

export function createFormatters(locale: AppLocale) {
  return { formatWeekRange, /* locale-bound formatters stay nested */ }
}
```

**Keep nested when:** the function closes over hook state (`setSearch`, `setOpen`), component props, or factory locals (`dateTimeFormatter`, `t`, `timeFormat`).

**Don’t:** Duplicate a module-level helper inside a factory just to return it — import and re-export in the return object instead.

---

### `typescript:S1874` — Deprecated APIs

**Do:**

```typescript
// Bad — React 19 deprecates FormEvent for form handlers
function handleSubmit(e: React.FormEvent) { ... }

// Good
import type { SubmitEvent } from 'react'
function handleSubmit(e: SubmitEvent) { ... }

// Bad — lucide-react brand icons (e.g. Github) are @deprecated
import { Github } from 'lucide-react'

// Good — local SVG component
import { GithubIcon } from '@/components/icons/GithubIcon'
```

**Apply to:** `AuthForm`, `settings`, `NewTaskDialog`, `use-tasks-page-actions` (`SubmitEvent`); `about.tsx` (`GithubIcon`).

---

## Accessibility & DOM rules (follow proactively)

| Rule key | Name | Guidance |
|----------|------|----------|
| `typescript:S6848` | Avoid non-native interactive elements | Use `<button>`, `<a>`, or Radix/shadcn primitives—not `<div onClick>`. |
| `typescript:S1082` | Mouse events need keyboard support | Clickable UI must be keyboard-operable. |

---

## Overlap with ESLint

| Sonar | ESLint (TanStack config) | Topic |
|-------|--------------------------|--------|
| S6582 | `@typescript-eslint/prefer-optional-chain` | `?.` instead of `&&` chains |
| S4325 | `@typescript-eslint/no-unnecessary-type-assertion` | Redundant `as` / `!` |
| S1128 | `tsc` `noUnusedLocals` / IDE Sonar | Unused imports |
| S7735 | (Sonar-only in IDE today) | Negated conditions with else |
| S6850 | (Sonar-only in IDE today) | Heading accessible content |
| S3735 | (Sonar-only in IDE today) | No `void` operator on promises |
| S7786 | (Sonar-only in IDE today) | `TypeError` after type checks |
| S3358 | (Sonar-only in IDE today) | No nested ternaries |
| S7761 | (Sonar-only in IDE today) | `dataset` for `data-*` |
| S7721 | (Sonar-only in IDE today) | Hoist nested functions without closure |
| S7765 | (Sonar-only in IDE today) | `.includes()` for membership |
| S6564 | (Sonar-only in IDE today) | No `type X = string` aliases |
| S6759 | (Sonar-only in IDE today) | Readonly props |
| S1874 | TypeScript / IDE deprecation | Deprecated types |
| S3776 | (Sonar-only in IDE today) | Cognitive complexity |
| S7764 | (Sonar-only in IDE today) | `globalThis` vs `window` |
| S7741 | (Sonar-only in IDE today) | No `typeof` for `undefined` |
| S6819 | (Sonar-only in IDE today) | Semantic tags over `role=` |
| — | `@typescript-eslint/no-unnecessary-condition` | Useless `?.`, `??`, `if` |

Run before PR: `bun run lint` and resolve Sonar warnings in changed files.

---

## Agent checklist (required)

When editing TypeScript/React code:

1. **No regressions** — Do not introduce an error when fixing a Sonar issue; verify with `tsc`, IDE diagnostics, and lint on touched files (see [General principles](#general-principles)).
2. **Imports** — Remove unused imports in touched files (`S1128`).
3. **Conditions** — No negated `if` / ternary when an `else` branch exists (`S7735`).
4. **Headings** — `h1`–`h6` and `DialogTitle` must have accessible text (`S6850`).
5. **Promises** — No `void` operator; use `.catch()` or async handlers (`S3735`).
6. **Validation throws** — `TypeError` after type/value checks (`S7786`).
7. **Ternaries** — No nested `? :` chains; extract helpers (`S3358`).
8. **Data attributes** — Use `element.dataset.*` in DOM code (`S7761`).
9. **New or updated components** — `Readonly<{ ... }>` props (`S6759`).
10. **Assertions** — Remove redundant `!` / `as`; use guards (`S4325`).
11. **Event handler types** — `SubmitEvent`, not `FormEvent` (`S1874`).
12. **Function scope** — Hoist nested helpers that do not close over locals; reuse module exports (`S7721`).
13. **Membership checks** — `.includes()` on arrays/strings, not `indexOf !== -1` or `.some(===)` (`S7765`).
14. **Type aliases** — No redundant `type X = string` (etc.); use underlying type + JSDoc (`S6564`).
15. **Large functions** — Extract before complexity hits 15 (`S3776`).
16. **Nullish access** — Prefer `?.` / `??` over `a && a.b` (`S6582`).
17. **Globals** — Use `globalThis`, not `window` / `self` / `global` (`S7764`); browser guards via `isBrowser()` / `hasDocument()` (`S7741`).
18. **Undefined checks** — `x === undefined`, not `typeof x === 'undefined'` (`S7741`).
19. **Interactive UI** — Buttons/links only; semantic controls over ARIA roles (`S6819`, `S6848`, `S1082`).
20. **Touched files** — Clear Sonar warnings in the IDE for that file.

---

## References

- [Sonar rule S6819](https://rules.sonarsource.com/typescript/RSPEC-6819)
- [Sonar rule S7741](https://rules.sonarsource.com/typescript/RSPEC-7741)
- [Sonar rule S7764](https://rules.sonarsource.com/typescript/RSPEC-7764)
- [Sonar rule S6582](https://rules.sonarsource.com/typescript/RSPEC-6582)
- [Sonar rule S3776](https://rules.sonarsource.com/typescript/RSPEC-3776)
- [Sonar rule S1128](https://rules.sonarsource.com/typescript/RSPEC-1128)
- [Sonar rule S7735](https://rules.sonarsource.com/typescript/RSPEC-7735)
- [Sonar rule S6850](https://rules.sonarsource.com/typescript/RSPEC-6850)
- [Sonar rule S3735](https://rules.sonarsource.com/typescript/RSPEC-3735)
- [Sonar rule S7786](https://rules.sonarsource.com/typescript/RSPEC-7786)
- [Sonar rule S3358](https://rules.sonarsource.com/typescript/RSPEC-3358)
- [Sonar rule S7761](https://rules.sonarsource.com/typescript/RSPEC-7761)
- [Sonar rule S7721](https://rules.sonarsource.com/typescript/RSPEC-7721)
- [Sonar rule S7765](https://rules.sonarsource.com/typescript/RSPEC-7765)
- [Sonar rule S6564](https://rules.sonarsource.com/typescript/RSPEC-6564)
- [Sonar rule S6759](https://rules.sonarsource.com/typescript/RSPEC-6759)
- [Sonar rule S4325](https://rules.sonarsource.com/typescript/RSPEC-4325)
- [Sonar rule S1874](https://rules.sonarsource.com/typescript/RSPEC-1874)
