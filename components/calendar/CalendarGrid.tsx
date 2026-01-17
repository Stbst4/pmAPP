'use client'

import { CalendarDay } from './CalendarDay'
import { getMonthDays, isSameDay, getDateAtMidnight } from '@/lib/utils'
import { CalendarEvent, Task } from '@/types'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface CalendarGridProps {
  currentDate: Date
  selectedDate: Date
  events: CalendarEvent[]
  tasks: Task[]
  onSelectDate: (date: Date) => void
}

export function CalendarGrid({
  currentDate,
  selectedDate,
  events,
  tasks,
  onSelectDate,
}: CalendarGridProps) {
  const today = new Date()
  const days = getMonthDays(currentDate.getFullYear(), currentDate.getMonth())

  const hasEventsForDate = (date: Date): boolean => {
    const dateMidnight = getDateAtMidnight(date)
    return events.some(event => event.date === dateMidnight)
  }

  const hasTasksForDate = (date: Date): boolean => {
    const dateMidnight = getDateAtMidnight(date)
    return tasks.some(task => {
      if (!task.dueDate) return false
      const taskDate = new Date(task.dueDate)
      taskDate.setHours(0, 0, 0, 0)
      return taskDate.getTime() === dateMidnight
    })
  }

  return (
    <div>
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map(day => (
          <div
            key={day}
            className="text-center text-xs text-text-muted font-medium py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => (
          <CalendarDay
            key={index}
            date={date}
            currentMonth={currentDate.getMonth()}
            isSelected={isSameDay(date, selectedDate)}
            isToday={isSameDay(date, today)}
            hasEvents={hasEventsForDate(date)}
            hasTasks={hasTasksForDate(date)}
            onClick={() => onSelectDate(date)}
          />
        ))}
      </div>
    </div>
  )
}
