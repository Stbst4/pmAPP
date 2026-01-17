'use client'

import { useCallback } from 'react'
import { CalendarEvent } from '@/types'
import { useLocalStorage } from './useLocalStorage'
import { generateId } from '@/lib/utils'

interface AddEventOptions {
  title: string
  description?: string
  date: number
  startTime?: string
  endTime?: string
  color?: string
}

export function useCalendarEvents() {
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>('flowstate-calendar-events', [])

  const addEvent = useCallback((options: AddEventOptions) => {
    const newEvent: CalendarEvent = {
      id: generateId(),
      title: options.title,
      description: options.description,
      date: options.date,
      startTime: options.startTime,
      endTime: options.endTime,
      color: options.color,
      createdAt: Date.now(),
    }
    setEvents(prev => [...prev, newEvent])
    return newEvent
  }, [setEvents])

  const updateEvent = useCallback((id: string, updates: Partial<Omit<CalendarEvent, 'id' | 'createdAt'>>) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === id ? { ...event, ...updates } : event
      )
    )
  }, [setEvents])

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id))
  }, [setEvents])

  const getEventsForDate = useCallback((date: number) => {
    return events.filter(event => event.date === date)
  }, [events])

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
  }
}
