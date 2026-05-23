import { Square, SquareCheck } from 'lucide-react'
import type { ReactNode } from 'react'

import type { Task } from '@/lib/task-calendar'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

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
  return (
    <ContextMenu>
      <ContextMenuTrigger
        asChild
        disabled={pending}
        className="block h-full w-full"
      >
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="min-w-[11rem]">
        {task.completed ? (
          <ContextMenuItem
            disabled={pending}
            onSelect={() => onToggle(task, false)}
          >
            <Square className="size-4 text-muted-foreground" aria-hidden />
            Mark as incomplete
          </ContextMenuItem>
        ) : (
          <ContextMenuItem
            disabled={pending}
            onSelect={() => onToggle(task, true)}
          >
            <SquareCheck className="size-4 text-primary" aria-hidden />
            Mark as completed
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
