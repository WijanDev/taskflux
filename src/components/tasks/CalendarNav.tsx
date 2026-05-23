import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CalendarNavProps = {
  title: string
  onPrevious: () => void
  onNext: () => void
  previousLabel: string
  nextLabel: string
  className?: string
}

export function CalendarNav({
  title,
  onPrevious,
  onNext,
  previousLabel,
  nextLabel,
  className,
}: CalendarNavProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 max-w-full items-center justify-center gap-1 sm:gap-2',
        className,
      )}
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-9 shrink-0 sm:size-9"
        onClick={onPrevious}
        aria-label={previousLabel}
      >
        <ChevronLeft className="size-4" />
      </Button>
      <h2 className="min-w-0 flex-1 truncate px-1 text-center text-sm font-semibold tracking-tight sm:mx-4 sm:text-base md:text-lg">
        {title}
      </h2>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-9 shrink-0"
        onClick={onNext}
        aria-label={nextLabel}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}
