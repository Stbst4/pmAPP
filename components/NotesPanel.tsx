'use client'

import { useState, useEffect, useRef } from 'react'
import { useNotes } from '@/hooks/useNotes'
import { cn, formatDate } from '@/lib/utils'

export function NotesPanel() {
  const {
    notes,
    activeNote,
    activeNoteId,
    addNote,
    updateNote,
    deleteNote,
    selectNote,
  } = useNotes()

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [activeNote?.content])

  // Debounced save
  const saveTimeoutRef = useRef<NodeJS.Timeout>()

  const handleContentChange = (content: string) => {
    if (!activeNoteId) return

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      updateNote(activeNoteId, { content })
    }, 300)
  }

  const handleTitleSave = () => {
    if (activeNoteId && editTitle.trim()) {
      updateNote(activeNoteId, { title: editTitle.trim() })
    }
    setIsEditingTitle(false)
  }

  if (!activeNote) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <p className="text-text-muted text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border-subtle">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-sm font-medium text-text-secondary uppercase tracking-wider">
            Notes
          </h2>
          <button
            onClick={addNote}
            className="text-text-muted hover:text-accent-amber transition-colors p-1"
            title="New note"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Note Tabs */}
      <div className="flex-shrink-0 border-b border-border-subtle overflow-x-auto">
        <div className="flex p-2 gap-1">
          {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => selectNote(note.id)}
              className={cn(
                'group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs',
                'transition-colors whitespace-nowrap',
                note.id === activeNoteId
                  ? 'bg-bg-hover text-text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover/50'
              )}
            >
              <span className="max-w-[80px] truncate">{note.title}</span>
              {notes.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNote(note.id)
                  }}
                  className={cn(
                    'opacity-0 group-hover:opacity-100',
                    'text-text-muted hover:text-red-400',
                    'transition-opacity'
                  )}
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Note Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Note Title */}
        <div className="p-4 pb-2">
          {isEditingTitle ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSave()
                if (e.key === 'Escape') setIsEditingTitle(false)
              }}
              className="w-full bg-transparent text-base font-medium text-text-primary focus:outline-none border-b border-accent-amber pb-1"
              autoFocus
            />
          ) : (
            <h3
              onClick={() => {
                setEditTitle(activeNote.title)
                setIsEditingTitle(true)
              }}
              className="text-base font-medium text-text-primary cursor-pointer hover:text-accent-amber transition-colors"
            >
              {activeNote.title}
            </h3>
          )}
          <p className="text-xs text-text-muted mt-1">
            {formatDate(activeNote.updatedAt)}
          </p>
        </div>

        {/* Textarea */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <textarea
            ref={textareaRef}
            value={activeNote.content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Start writing..."
            className={cn(
              'w-full min-h-full bg-transparent text-sm text-text-primary',
              'placeholder:text-text-muted resize-none focus:outline-none',
              'leading-relaxed'
            )}
          />
        </div>
      </div>
    </div>
  )
}
