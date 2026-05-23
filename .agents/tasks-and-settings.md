# Tasks calendar & user settings

## Calendar views

| View | Component | Notes |
|------|-----------|--------|
| Daily | `DayTasksView` + `TimeGrid` | Single day time grid |
| Weekly | `WeekCalendarView` + `TimeGrid` | Horizontal scroll on mobile |
| Monthly | `MonthCalendarView` | Mobile: day list; Desktop: 7×5 grid |

Domain logic: `src/lib/task-calendar.ts` (partition, overlap, formatting).  
Main route: `src/routes/tasks.tsx`.

## Task UI patterns

- **Context menu:** shadcn `ContextMenu` in `TaskBlockContextMenu.tsx` (not custom portal menus).
- **Dialogs:** `NewTaskDialog`, `TaskDetailDialog` + `TaskDialogChrome`.
- **Schedule inputs:** `TaskScheduleFields` + `datetime-picker` / `calendar` (popover z-index).
- **Month mobile:** scrollable day cards (`md:hidden`), auto-scroll to today; tap day → daily view.
- **Month desktop:** 7×5 grid with up to 3 tasks per cell and “+N more”.
- **Month item:** `TaskCalendarItem` — schedule time on first line, title on second (locale-aware).

## Unscheduled panel

- `UnscheduledTasksPanel` — collapsible on mobile, sidebar on `lg+`.

## User settings & i18n

**Route:** `/settings` (`src/routes/settings.tsx`)

**Stored per user:** `locale` (`en` | `es`), `time_format` (`12h` | `24h`), `theme`.

**i18n stack:** `i18next` + `react-i18next`

- Locale files: `src/locales/en.json`, `src/locales/es.json` (namespaced keys)
- Init: `src/lib/i18n/index.ts`
- Root loader: `getAppPreferences` (`src/server/app-preferences.ts`) — DB for signed-in users, cookie for guests
- Provider: `AppPreferencesProvider` — `useAppPreferences()`, `useFormatters()`, syncs `html[lang]`, cookie, `localStorage`
- Guest language: header `Select` when signed out; signed-in users change locale in Settings
- Formatting: `createFormatters()` in `src/lib/formatting.ts` — `Intl` uses `locale` + `hour12` from preferences

**Theme:** still applied via `localStorage` + `applyThemeMode`; logged-in users set theme in Settings (no header toggle).

## View mode menu & transitions

- `TasksViewModeMenu.tsx` — Daily: `Square`; Weekly: `RectangleHorizontal`; Monthly: `LayoutGrid`; mobile shows **icon + label**.
- `use-calendar-period-navigation.ts` + `CalendarPeriodTransition` — slide transitions on period/view changes.

## Date / time helpers

- `src/lib/dates.ts` — parsing and validation only (display formatting lives in `formatting.ts`).
