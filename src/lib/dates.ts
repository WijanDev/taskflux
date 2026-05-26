/** Parse `datetime-local` value or ISO string; empty → null. */
export function parseOptionalTimestamp(
  value: string | null | undefined,
): Date | null {
  if (!value?.trim()) {
    return null
  }
  const ms = Date.parse(value)
  if (Number.isNaN(ms)) {
    throw new TypeError('Invalid date')
  }
  return new Date(ms)
}

export function assertValidTaskRange(
  taskStartAt: Date | null,
  taskEndsAt: Date | null,
) {
  if (taskStartAt && taskEndsAt && taskEndsAt < taskStartAt) {
    throw new Error('End must be on or after start')
  }
}

/** `YYYY-MM-DDTHH:mm` for forms and API payloads. */
export function toDatetimeLocalValue(date: Date | null | undefined): string {
  if (!date) {
    return ''
  }
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** Parse `YYYY-MM-DDTHH:mm` (or ISO) from date pickers; empty → undefined. */
export function parseDatetimeLocalValue(
  value: string | null | undefined,
): Date | undefined {
  if (!value?.trim()) {
    return undefined
  }
  const ms = Date.parse(value)
  if (Number.isNaN(ms)) {
    return undefined
  }
  return new Date(ms)
}

