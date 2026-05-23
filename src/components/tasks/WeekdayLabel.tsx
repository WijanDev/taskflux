import { WEEKDAY_LABELS, WEEKDAY_LABELS_SHORT } from '@/lib/task-calendar'

type WeekdayLabelProps = {
  index: number
  className?: string
}

export function WeekdayLabel({ index, className }: WeekdayLabelProps) {
  return (
    <span className={className}>
      <span className="sm:hidden">{WEEKDAY_LABELS_SHORT[index]}</span>
      <span className="hidden sm:inline">{WEEKDAY_LABELS[index]}</span>
    </span>
  )
}
