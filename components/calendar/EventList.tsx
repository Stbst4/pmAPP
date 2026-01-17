'use client'

import { useState } from 'react'
import { CalendarEvent, Task } from '@/types'
import { EventForm } from './EventForm'
import { cn } from '@/lib/utils'

interface EventListProps {
  selectedDate: Date
  events: CalendarEvent[]
  tasks: Task[]
  onAddEvent: (data: { title: string; description?: string; startTime?: string; endTime?: string }) => void
  onUpdateEvent: (id: string, data: { title: string; description?: string; startTime?: string; endTime?: string }) => void
  onDeleteEvent: (id: string) => void
}

export function EventList({
  selectedDate,
  events,
  tasks,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
}: EventListProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const handleAdd = (data: { title: string; description?: string; startTime?: string; endTime?: string }) => {
    onAddEvent(data)
    setIsAdding(false)
  }

  const handleUpdate = (id: string, data: { title: string; description?: string; startTime?: string; endTime?: string }) => {
    onUpdateEvent(id, data)
    setEditingId(null)
  }

  const sortedEvents = [...events].sort((a, b) => {
    if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime)
    if (a.startTime) return -1
    if (b.startTime) return 1
    return a.createdAt - b.createdAt
  })

  return (
    <div className="border-t border-border-primary pt-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-text-primary">{formattedDate}</h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-text-secondary hover:text-accent-amber transition-colors"
            title="Add event"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {/* Events */}
        {sortedEvents.map(event => (
          <div key={event.id}>
            {editingId === event.id ? (
              <div className="card p-3">
                <EventForm
                  event={event}
                  onSave={(data) => handleUpdate(event.id, data)}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <div className="group card p-2 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-amber mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm text-text-primary">{event.title}</p>
                      {(event.startTime || event.endTime) && (
                        <p className="text-xs text-text-muted">
                          {event.startTime && event.endTime
                            ? `${event.startTime} - ${event.endTime}`
                            : event.startTime || event.endTime}
                        </p>
                      )}
                      {event.description && (
                        <p className="text-xs text-text-secondary mt-0.5">{event.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={() => setEditingId(event.id)}
                        className="text-text-muted hover:text-accent-amber p-1"
                        title="Edit"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDeleteEvent(event.id)}
                        className="text-text-muted hover:text-red-400 p-1"
                        title="Delete"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Tasks with due date */}
        {tasks.map(task => (
          <div key={task.id} className="card p-2 flex items-start gap-2 opacity-75">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-sage mt-1.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary">{task.title}</p>
              <p className="text-xs text-text-muted">Task due</p>
            </div>
          </div>
        ))}

        {/* Add form */}
        {isAdding && (
          <div className="card p-3">
            <EventForm
              onSave={handleAdd}
              onCancel={() => setIsAdding(false)}
            />
          </div>
        )}

        {/* Empty state */}
        {!isAdding && sortedEvents.length === 0 && tasks.length === 0 && (
          <p className="text-sm text-text-muted text-center py-4">
            No events or tasks
          </p>
        )}
      </div>
    </div>
  )
}
