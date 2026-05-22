import { Input } from '@/components/ui/input'
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
        <Input
          id={`${idPrefix}-start`}
          type="datetime-local"
          value={startValue}
          onChange={(e) => onStartChange(e.target.value)}
          disabled={disabled}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-end`}>End</Label>
        <Input
          id={`${idPrefix}-end`}
          type="datetime-local"
          value={endValue}
          onChange={(e) => onEndChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
