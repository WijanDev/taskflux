import { DateTimePicker } from '@/components/ui/datetime-picker'
import { Label } from '@/components/ui/label'

type TaskScheduleFieldsProps = {
  startValue: string
  endValue: string
  onStartChange: (value: string) => void
  onEndChange: (value: string) => void
  disabled?: boolean
  idPrefix: string
}

export function TaskScheduleFields({
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  disabled,
  idPrefix,
}: TaskScheduleFieldsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-start`}>Start</Label>
        <DateTimePicker
          id={`${idPrefix}-start`}
          value={startValue}
          onChange={onStartChange}
          disabled={disabled}
          placeholder="Start date & time"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-end`}>End</Label>
        <DateTimePicker
          id={`${idPrefix}-end`}
          value={endValue}
          onChange={onEndChange}
          disabled={disabled}
          placeholder="End date & time"
        />
      </div>
    </div>
  )
}
