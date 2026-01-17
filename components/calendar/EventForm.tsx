'use client'

import { useState } from 'react'
import { CalendarEvent } from '@/types'

interface EventFormProps {
  event?: CalendarEvent
  onSave: (data: {
    title: string
    description?: string
    startTime?: string
    endTime?: string
  }) => void
  onCancel: () => void
}

export function EventForm({ event, onSave, onCancel }: EventFormProps) {
  const [title, setTitle] = useState(event?.title || '')
  const [description, setDescription] = useState(event?.description || '')
  const [startTime, setStartTime] = useState(event?.startTime || '')
  const [endTime, setEndTime] = useState(event?.endTime || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title"
          className="input-base w-full text-sm"
          autoFocus
        />
      </div>

      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="input-base w-full text-sm resize-none"
          rows={2}
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs text-text-muted mb-1">Start</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="input-base w-full text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-text-muted mb-1">End</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="input-base w-full text-sm"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button type="submit" className="btn-primary text-sm py-1.5 flex-1">
          {event ? 'Update' : 'Add Event'}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost text-sm">
          Cancel
        </button>
      </div>
    </form>
  )
}
