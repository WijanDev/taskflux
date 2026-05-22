import { CalendarDays, ChevronDown, LayoutGrid } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { TasksViewMode } from '@/lib/task-calendar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const VIEW_OPTIONS: { value: TasksViewMode; label: string; icon: typeof LayoutGrid }[] =
  [
    { value: 'daily', label: 'Daily', icon: CalendarDays },
    { value: 'weekly', label: 'Weekly', icon: CalendarDays },
    { value: 'monthly', label: 'Monthly', icon: LayoutGrid },
  ]

type MenuPosition = {
  top: number
  left: number
  minWidth: number
}

type TasksViewModeMenuProps = {
  value: TasksViewMode
  onChange: (mode: TasksViewMode) => void
}

export function TasksViewModeMenu({ value, onChange }: TasksViewModeMenuProps) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<MenuPosition>({ top: 0, left: 0, minWidth: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const active = VIEW_OPTIONS.find((o) => o.value === value) ?? VIEW_OPTIONS[0]

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
        {VIEW_OPTIONS.map((option) => (
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
              <option.icon className="size-4 shrink-0" aria-hidden />
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    ) : null

  return (
    <div ref={triggerRef} className="relative z-30 shrink-0">
      <Button
        type="button"
        variant="outline"
        className="h-9 gap-1.5 px-3"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggleOpen}
      >
        <active.icon className="size-4" aria-hidden />
        {active.label}
        <ChevronDown
          className={cn('size-4 transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </Button>
      {menu ? createPortal(menu, document.body) : null}
    </div>
  )
}
