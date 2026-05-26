import { useFormatters } from '@/providers/AppPreferencesProvider'

type WeekdayLabelProps = Readonly<{
  index: number
  className?: string
}>

export function WeekdayLabel({ index, className }: WeekdayLabelProps) {
  const { formatWeekday } = useFormatters()

  return (
    <span className={className}>
      <span className="sm:hidden">{formatWeekday(index, true)}</span>
      <span className="hidden sm:inline">{formatWeekday(index, false)}</span>
    </span>
  )
}
