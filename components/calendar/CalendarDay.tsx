'use client'

import { cn, isSameDay } from '@/lib/utils'

interface CalendarDayProps {
  date: Date
  currentMonth: number
  isSelected: boolean
  isToday: boolean
  hasEvents: boolean
  hasTasks: boolean
  onClick: () => void
}

export function CalendarDay({
  date,
  currentMonth,
  isSelected,
  isToday,
  hasEvents,
  hasTasks,
  onClick,
}: CalendarDayProps) {
  const isCurrentMonth = date.getMonth() === currentMonth

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative h-10 w-full flex flex-col items-center justify-center rounded-md transition-colors',
        'hover:bg-bg-hover',
        !isCurrentMonth && 'text-text-muted',
        isCurrentMonth && 'text-text-primary',
        isSelected && 'bg-accent-amber/20',
        isToday && !isSelected && 'ring-1 ring-accent-amber'
      )}
    >
      <span className={cn(
        'text-sm',
        isToday && 'font-semibold text-accent-amber'
      )}>
        {date.getDate()}
      </span>
      {(hasEvents || hasTasks) && (
        <div className="flex gap-0.5 mt-0.5">
          {hasEvents && (
            <span className="w-1 h-1 rounded-full bg-accent-amber" />
          )}
          {hasTasks && (
            <span className="w-1 h-1 rounded-full bg-accent-sage" />
          )}
        </div>
      )}
    </button>
  )
}
