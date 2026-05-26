import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type TaskDialogHeaderProps = Readonly<{
  icon: LucideIcon
  title: string
  description?: string
  badge?: ReactNode
  titleClassName?: string
}>

export function TaskDialogHeader({
  icon: Icon,
  title,
  description,
  badge,
  titleClassName,
}: TaskDialogHeaderProps) {
  return (
    <DialogHeader>
      <div className="flex items-start gap-4 pr-14 sm:pr-16">
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary shadow-sm ring-1 ring-primary/20 sm:size-14"
          aria-hidden
        >
          <Icon className="size-5 sm:size-6" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <DialogTitle className={cn('text-xl sm:text-2xl', titleClassName)}>
              {title}
            </DialogTitle>
            {badge}
          </div>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </div>
      </div>
    </DialogHeader>
  )
}

type TaskMetaItemProps = Readonly<{
  icon: LucideIcon
  label: string
  value: ReactNode
  className?: string
}>

export function TaskMetaItem({
  icon: Icon,
  label,
  value,
  className,
}: TaskMetaItemProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border/60 bg-gradient-to-br from-muted/40 to-muted/10 p-4 sm:p-5',
        className,
      )}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
        <Icon className="size-3.5 shrink-0 text-primary/70" aria-hidden />
        {label}
      </div>
      <div className="mt-2.5 text-sm leading-relaxed font-medium text-foreground sm:text-base">
        {value}
      </div>
    </div>
  )
}

type TaskStatusBadgeProps = Readonly<{
  completed: boolean
}>

export function TaskStatusBadge({ completed }: TaskStatusBadgeProps) {
  const { t } = useTranslation('tasks')

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        completed
          ? 'bg-muted text-muted-foreground ring-1 ring-border/80'
          : 'bg-primary/15 text-primary ring-1 ring-primary/25',
      )}
    >
      {completed ? t('status.completed') : t('status.inProgress')}
    </span>
  )
}
