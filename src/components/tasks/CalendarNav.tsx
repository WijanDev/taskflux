import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

type CalendarNavProps = {
  title: string
  onPrevious: () => void
  onNext: () => void
  previousLabel: string
  nextLabel: string
}

export function CalendarNav({
  title,
  onPrevious,
  onNext,
  previousLabel,
  nextLabel,
}: CalendarNavProps) {
  return (
    <div className="flex min-w-0 max-w-full items-center justify-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="shrink-0"
        onClick={onPrevious}
        aria-label={previousLabel}
      >
        <ChevronLeft className="size-4" />
      </Button>
      <h2 className="mx-4 min-w-0 truncate text-center text-base font-semibold tracking-tight sm:mx-6 sm:text-lg">
        {title}
      </h2>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="shrink-0"
        onClick={onNext}
        aria-label={nextLabel}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}
