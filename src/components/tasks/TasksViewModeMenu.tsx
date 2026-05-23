import { ChevronDown, LayoutGrid, RectangleHorizontal, Square } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react'
import { createPortal } from 'react-dom'

import type { TasksViewMode } from '@/lib/task-calendar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ViewModeIconProps = {
  readonly className?: string
}

function DailyViewIcon({ className }: ViewModeIconProps) {
  return <Square className={className} strokeWidth={2} aria-hidden />
}

function WeeklyViewIcon({ className }: ViewModeIconProps) {
  return (
    <RectangleHorizontal className={className} strokeWidth={2} aria-hidden />
  )
}

function MonthlyViewIcon({ className }: ViewModeIconProps) {
  return <LayoutGrid className={className} strokeWidth={2} aria-hidden />
}

const VIEW_OPTIONS: {
  value: TasksViewMode
  label: string
  Icon: (props: ViewModeIconProps) => ReactElement
}[] = [
  { value: 'daily', label: 'Daily', Icon: DailyViewIcon },
  { value: 'weekly', label: 'Weekly', Icon: WeeklyViewIcon },
  { value: 'monthly', label: 'Monthly', Icon: MonthlyViewIcon },
]

type MenuPosition = {
  top: number
  left: number
  minWidth: number
}

type TasksViewModeMenuProps = {
  readonly value: TasksViewMode
  readonly onChange: (mode: TasksViewMode) => void
  /** Compact trigger with visible label (mobile toolbar). */
  readonly compact?: boolean
}

export function TasksViewModeMenu({
  value,
  onChange,
  compact = false,
}: TasksViewModeMenuProps) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<MenuPosition>({ top: 0, left: 0, minWidth: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const active = VIEW_OPTIONS.find((o) => o.value === value) ?? VIEW_OPTIONS[0]
  const ActiveIcon = active.Icon

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return

    const rect = trigger.getBoundingClientRect()
    setPosition({
      top: rect.bottom + 4,
      left: rect.left,
      minWidth: rect.width,
    })
  }, [])

  useEffect(() => {
    if (!open) return

    updatePosition()

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    function handleReposition() {
      updatePosition()
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    window.addEventListener('resize', handleReposition)
    window.addEventListener('scroll', handleReposition, true)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('resize', handleReposition)
      window.removeEventListener('scroll', handleReposition, true)
    }
  }, [open, updatePosition])

  function toggleOpen() {
    setOpen((prev) => {
      const next = !prev
      if (next) {
        updatePosition()
      }
      return next
    })
  }

  const menu =
    open && typeof document !== 'undefined' ? (
      <ul
        ref={menuRef}
        role="listbox"
        aria-label="Task view"
        className="fixed z-[200] min-w-[9rem] rounded-md border border-border bg-popover p-1 shadow-lg"
        style={{
          top: position.top,
          left: position.left,
          minWidth: position.minWidth,
        }}
      >
        {VIEW_OPTIONS.map((option) => {
          const OptionIcon = option.Icon
          return (
            <li key={option.value} role="option" aria-selected={value === option.value}>
              <button
                type="button"
                role="menuitem"
                className={cn(
                  'flex h-9 w-full items-center gap-2 rounded-sm px-2.5 text-left text-sm hover:bg-accent',
                  value === option.value && 'bg-accent font-medium',
                )}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
              >
                <OptionIcon className="size-4 shrink-0" />
                {option.label}
              </button>
            </li>
          )
        })}
      </ul>
    ) : null

  return (
    <div ref={triggerRef} className="relative z-30 shrink-0">
      <Button
        type="button"
        variant="outline"
        className={cn(
          'h-9 gap-1.5',
          compact ? 'max-w-[9.5rem] px-2.5 sm:max-w-none' : 'px-3',
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggleOpen}
      >
        <ActiveIcon className="size-4 shrink-0" />
        <span className={cn('truncate', compact && 'text-sm')}>{active.label}</span>
        <ChevronDown
          className={cn('size-4 shrink-0 transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </Button>
      {menu ? createPortal(menu, document.body) : null}
    </div>
  )
}
