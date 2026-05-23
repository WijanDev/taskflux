import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation(['tasks', 'common'])

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-start`}>{t('common:labels.start')}</Label>
        <DateTimePicker
          id={`${idPrefix}-start`}
          value={startValue}
          onChange={onStartChange}
          disabled={disabled}
          placeholder={t('tasks:schedule.startPlaceholder')}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-end`}>{t('common:labels.end')}</Label>
        <DateTimePicker
          id={`${idPrefix}-end`}
          value={endValue}
          onChange={onEndChange}
          disabled={disabled}
          placeholder={t('tasks:schedule.endPlaceholder')}
        />
      </div>
    </div>
  )
}
