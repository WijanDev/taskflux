import { LayoutGrid, RectangleHorizontal, Square } from 'lucide-react'
import type { ReactElement } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { TasksViewMode } from '@/lib/task-calendar'
import { isTasksViewMode } from '@/lib/tasks-search-params'
import { cn } from '@/lib/utils'

type ViewModeIconProps = Readonly<{
  className?: string
}>

function DailyViewIcon({ className }: ViewModeIconProps) {
  return <Square className={className} strokeWidth={2} aria-hidden />
}

function WeeklyViewIcon({ className }: ViewModeIconProps) {
  return <RectangleHorizontal className={className} strokeWidth={2} aria-hidden />
}

function MonthlyViewIcon({ className }: ViewModeIconProps) {
  return <LayoutGrid className={className} strokeWidth={2} aria-hidden />
}

const VIEW_OPTION_META: {
  value: TasksViewMode
  Icon: (props: ViewModeIconProps) => ReactElement
}[] = [
  { value: 'daily', Icon: DailyViewIcon },
  { value: 'weekly', Icon: WeeklyViewIcon },
  { value: 'monthly', Icon: MonthlyViewIcon },
]

type TasksViewModeMenuProps = Readonly<{
  value: TasksViewMode
  onChange: (mode: TasksViewMode) => void
  /** Compact trigger with visible label (mobile toolbar). */
  compact?: boolean
}>

export function TasksViewModeMenu({
  value,
  onChange,
  compact = false,
}: TasksViewModeMenuProps) {
  const { t } = useTranslation('tasks')

  const viewOptions = useMemo(
    () =>
      VIEW_OPTION_META.map((option) => ({
        ...option,
        label: t(`viewMode.${option.value}`),
      })),
    [t],
  )

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (isTasksViewMode(next)) {
          onChange(next)
        }
      }}
    >
      <SelectTrigger
        aria-label={t('toolbar.taskView')}
        className={cn(
          'h-9 gap-1.5',
          compact ? 'max-w-[9.5rem] px-2.5 sm:max-w-none' : 'min-w-[9rem] px-3',
        )}
      >
        <SelectValue className={cn('truncate', compact && 'text-sm')} />
      </SelectTrigger>
      <SelectContent>
        {viewOptions.map((option) => {
          const OptionIcon = option.Icon
          return (
            <SelectItem key={option.value} value={option.value}>
              <OptionIcon className="size-4 shrink-0" />
              {option.label}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
