import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  parseDatetimeLocalValue,
  toDatetimeLocalValue,
} from '@/lib/dates'
import { cn } from '@/lib/utils'

type DateTimePickerProps = {
  id?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
}

function mergeDateAndTime(date: Date, timeSource: Date): Date {
  const merged = new Date(date)
  merged.setHours(timeSource.getHours(), timeSource.getMinutes(), 0, 0)
  return merged
}

export function DateTimePicker({
  id,
  value,
  onChange,
  disabled,
  placeholder = 'Pick date & time',
}: DateTimePickerProps) {
  const selected = parseDatetimeLocalValue(value)
  const timeValue = selected ? format(selected, 'HH:mm') : ''

  function handleDateSelect(date: Date | undefined) {
    if (!date) {
      onChange('')
      return
    }
    const merged = selected
      ? mergeDateAndTime(date, selected)
      : mergeDateAndTime(date, new Date())
    onChange(toDatetimeLocalValue(merged))
  }

  function handleTimeChange(time: string) {
    if (!time) return
    const [hours, minutes] = time.split(':').map(Number)
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return

    const base = selected ?? new Date()
    const merged = new Date(base)
    merged.setHours(hours, minutes, 0, 0)
    onChange(toDatetimeLocalValue(merged))
  }

  function handleClear() {
    onChange('')
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            'h-10 w-full justify-start px-3 text-left font-normal',
            !selected && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 size-4 shrink-0 opacity-70" />
          <span className="truncate">
            {selected ? format(selected, 'PPp') : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleDateSelect}
          defaultMonth={selected}
        />
        <div className="space-y-2 border-t border-border px-3 py-3">
          <p className="text-xs font-medium text-muted-foreground">Time</p>
          <Input
            type="time"
            value={timeValue}
            onChange={(e) => handleTimeChange(e.target.value)}
            disabled={disabled}
            className="h-9 bg-background"
            aria-label="Time"
          />
        </div>
        {selected ? (
          <div className="border-t border-border p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full"
              disabled={disabled}
              onClick={handleClear}
            >
              Clear
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
