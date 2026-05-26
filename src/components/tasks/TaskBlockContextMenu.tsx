import { Square, SquareCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import type { Task } from '@/lib/task-calendar'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

type TaskBlockContextMenuProps = Readonly<{
  task: Task
  pending: boolean
  onToggle: (task: Task, completed: boolean) => void
  children: ReactNode
}>

export function TaskBlockContextMenu({
  task,
  pending,
  onToggle,
  children,
}: TaskBlockContextMenuProps) {
  const { t } = useTranslation('tasks')

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
            {t('contextMenu.markIncomplete')}
          </ContextMenuItem>
        ) : (
          <ContextMenuItem
            disabled={pending}
            onSelect={() => onToggle(task, true)}
          >
            <SquareCheck className="size-4 text-primary" aria-hidden />
            {t('contextMenu.markCompleted')}
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
