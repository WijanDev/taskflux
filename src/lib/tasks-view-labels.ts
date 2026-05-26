import type { TFunction } from 'i18next'

import type { AppFormatters } from '@/lib/formatting'
import type { TasksViewMode } from '@/lib/task-calendar'

type TasksViewNavAnchors = Readonly<{
  viewYear: number
  viewMonth: number
  viewWeekStart: Date
  viewDay: Date
}>

export function getTasksViewNavLabels(
  viewMode: TasksViewMode,
  t: TFunction<['tasks']>,
  formatters: Pick<
    AppFormatters,
    'formatMonthYear' | 'formatWeekRange' | 'formatDayTitle'
  >,
  anchors: TasksViewNavAnchors,
) {
  if (viewMode === 'monthly') {
    return {
      periodTitle: formatters.formatMonthYear(anchors.viewYear, anchors.viewMonth),
      previousLabel: t('tasks:nav.previousMonth'),
      nextLabel: t('tasks:nav.nextMonth'),
    }
  }

  if (viewMode === 'weekly') {
    return {
      periodTitle: formatters.formatWeekRange(anchors.viewWeekStart),
      previousLabel: t('tasks:nav.previousWeek'),
      nextLabel: t('tasks:nav.nextWeek'),
    }
  }

  return {
    periodTitle: formatters.formatDayTitle(anchors.viewDay),
    previousLabel: t('tasks:nav.previousDay'),
    nextLabel: t('tasks:nav.nextDay'),
  }
}
