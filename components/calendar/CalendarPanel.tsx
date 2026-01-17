'use client'

import { useState, useMemo } from 'react'
import { CalendarHeader } from './CalendarHeader'
import { CalendarGrid } from './CalendarGrid'
import { EventList } from './EventList'
import { useCalendarEvents } from '@/hooks/useCalendarEvents'
import { useTasks } from '@/hooks/useTasks'
import { getDateAtMidnight } from '@/lib/utils'

export function CalendarPanel() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const { events, addEvent, updateEvent, deleteEvent } = useCalendarEvents()
  const { tasks } = useTasks()

  const selectedDateMidnight = useMemo(() => getDateAtMidnight(selectedDate), [selectedDate])

  const eventsForSelectedDate = useMemo(() => {
    return events.filter(event => event.date === selectedDateMidnight)
  }, [events, selectedDateMidnight])

  const tasksForSelectedDate = useMemo(() => {
    return tasks.filter(task => {
      if (!task.dueDate) return false
      const taskDate = new Date(task.dueDate)
      taskDate.setHours(0, 0, 0, 0)
      return taskDate.getTime() === selectedDateMidnight
    })
  }, [tasks, selectedDateMidnight])

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const handleToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date)
    // If selecting a date from a different month, navigate to that month
    if (date.getMonth() !== currentDate.getMonth()) {
      setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1))
    }
  }

  const handleAddEvent = (data: { title: string; description?: string; startTime?: string; endTime?: string }) => {
    addEvent({
      ...data,
      date: selectedDateMidnight,
    })
  }

  const handleUpdateEvent = (id: string, data: { title: string; description?: string; startTime?: string; endTime?: string }) => {
    updateEvent(id, data)
  }

  return (
    <div className="p-4">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      <CalendarGrid
        currentDate={currentDate}
        selectedDate={selectedDate}
        events={events}
        tasks={tasks}
        onSelectDate={handleSelectDate}
      />

      <EventList
        selectedDate={selectedDate}
        events={eventsForSelectedDate}
        tasks={tasksForSelectedDate}
        onAddEvent={handleAddEvent}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={deleteEvent}
      />
    </div>
  )
}
