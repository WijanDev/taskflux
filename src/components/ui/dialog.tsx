import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type DialogProps = Readonly<{
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}>

function Dialog({ open, onOpenChange, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return

    if (!open && dialog.open) {
      dialog.close()
    } else if (open && !dialog.open) {
      // Use show() so portaled popovers (date picker) can stack above via z-index.
      // showModal() renders in the browser top layer, which sits above all portals.
      dialog.show()
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={() => onOpenChange(false)}
      onCancel={(e) => {
        e.preventDefault()
        onOpenChange(false)
      }}
      className={cn(
        'fixed top-1/2 left-1/2 z-50 w-[calc(100%-2.5rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2',
        'overflow-hidden rounded-2xl border border-border/70 bg-card p-0 text-card-foreground',
        'shadow-2xl shadow-black/15 ring-1 ring-black/5 dark:shadow-black/40 dark:ring-white/10',
        'backdrop:bg-black/55 open:backdrop:backdrop-blur-sm',
        'open:animate-in open:fade-in-0 open:zoom-in-95 open:duration-200',
      )}
    >
      {children}
    </dialog>
  )
}

function DialogContent({
  className,
  children,
  onClose,
}: Readonly<{
  className?: string
  children: ReactNode
  onClose?: () => void
}>) {
  return (
    <div className={cn('relative flex w-full min-w-0 flex-col', className)}>
      {onClose ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-end p-3 sm:p-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="pointer-events-auto size-9 shrink-0 rounded-full bg-background/90 text-muted-foreground shadow-sm ring-1 ring-border/60 hover:bg-muted hover:text-foreground"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : null}
      {children}
    </div>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'relative border-b border-border/50 bg-gradient-to-b from-primary/[0.07] to-transparent px-8 pt-6 pb-6 sm:px-10 sm:pt-7 sm:pb-7',
        'before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-primary/50 before:via-primary before:to-primary/30',
        className,
      )}
      {...props}
    />
  )
}

type DialogTitleProps = Readonly<
  Omit<React.ComponentProps<'h2'>, 'children'> & {
    children: ReactNode
  }
>

function DialogTitle({ className, children, ...props }: DialogTitleProps) {
  return (
    <h2
      className={cn('text-lg leading-tight font-semibold tracking-tight', className)}
      {...props}
    >
      {children}
    </h2>
  )
}

function DialogDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn('text-sm leading-relaxed text-muted-foreground', className)}
      {...props}
    />
  )
}

function DialogBody({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('px-8 py-6 sm:px-10 sm:py-7', className)} {...props} />
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-3 border-t border-border/50 bg-muted/20 px-8 py-5 sm:flex-row sm:justify-end sm:px-10 sm:py-6',
        className,
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
}
