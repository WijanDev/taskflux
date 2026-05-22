import { Square, SquareCheck } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useEffect, useRef, useState, type ReactNode } from 'react'

import type { Task } from '@/lib/task-calendar'
import { cn } from '@/lib/utils'

type TaskBlockContextMenuProps = {
  task: Task
  pending: boolean
  onToggle: (task: Task, completed: boolean) => void
  children: ReactNode
}

export function TaskBlockContextMenu({
  task,
  pending,
  onToggle,
  children,
}: TaskBlockContextMenuProps) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  function handleContextMenu(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    setPosition({ x: event.clientX, y: event.clientY })
    setOpen(true)
  }

  function handleMarkCompleted() {
    onToggle(task, true)
    setOpen(false)
  }

  function handleMarkIncomplete() {
    onToggle(task, false)
    setOpen(false)
  }

  const menu = open ? (
    <div
      ref={menuRef}
      role="menu"
      className="fixed z-[100] min-w-[11rem] rounded-md border border-border bg-popover p-1 shadow-md"
      style={{ left: position.x, top: position.y }}
    >
      {task.completed ? (
        <button
          type="button"
          role="menuitem"
          disabled={pending}
          className={cn(
            'flex w-full items-center gap-2 rounded-sm px-2.5 py-2 text-left text-sm',
            'hover:bg-accent disabled:pointer-events-none disabled:opacity-50',
          )}
          onClick={handleMarkIncomplete}
        >
          <Square className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          Mark as incomplete
        </button>
      ) : (
        <button
          type="button"
          role="menuitem"
          disabled={pending}
          className={cn(
            'flex w-full items-center gap-2 rounded-sm px-2.5 py-2 text-left text-sm',
            'hover:bg-accent disabled:pointer-events-none disabled:opacity-50',
          )}
          onClick={handleMarkCompleted}
        >
          <SquareCheck className="size-4 shrink-0 text-primary" aria-hidden />
          Mark as completed
        </button>
      )}
    </div>
  ) : null

  return (
    <div className="h-full w-full" onContextMenu={handleContextMenu}>
      {children}
      {typeof document !== 'undefined' && menu
        ? createPortal(menu, document.body)
        : null}
    </div>
  )
}
