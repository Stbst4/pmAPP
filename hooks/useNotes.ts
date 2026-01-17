'use client'

import { useCallback, useEffect } from 'react'
import { Note } from '@/types'
import { useLocalStorage } from './useLocalStorage'
import { generateId } from '@/lib/utils'

// Convert plain text content to TipTap JSON format
function convertPlainTextToTipTap(text: string): string {
  if (!text) {
    return JSON.stringify({
      type: 'doc',
      content: [{ type: 'paragraph' }]
    })
  }

  const paragraphs = text.split('\n').map(line => {
    if (line.trim() === '') {
      return { type: 'paragraph' }
    }
    return {
      type: 'paragraph',
      content: [{ type: 'text', text: line }]
    }
  })

  return JSON.stringify({
    type: 'doc',
    content: paragraphs.length > 0 ? paragraphs : [{ type: 'paragraph' }]
  })
}

// Migrate notes from plain text (v1) to TipTap JSON (v2)
function migrateNotes(notes: Note[]): Note[] {
  return notes.map(note => {
    if (note.contentVersion === 2) {
      return note // Already migrated
    }

    // Check if content is already valid TipTap JSON
    try {
      const parsed = JSON.parse(note.content)
      if (parsed.type === 'doc') {
        return { ...note, contentVersion: 2 }
      }
    } catch {
      // Not JSON, needs migration
    }

    // Migrate plain text to TipTap JSON
    return {
      ...note,
      content: convertPlainTextToTipTap(note.content),
      contentVersion: 2
    }
  })
}

export function useNotes() {
  const [notes, setNotes] = useLocalStorage<Note[]>('flowstate-notes', [])
  const [activeNoteId, setActiveNoteId] = useLocalStorage<string | null>('flowstate-active-note', null)

  // Migrate existing notes on load
  useEffect(() => {
    if (notes.length > 0) {
      const needsMigration = notes.some(note => note.contentVersion !== 2)
      if (needsMigration) {
        setNotes(migrateNotes(notes))
      }
    }
  }, []) // Only run once on mount

  // Ensure there's always at least one note
  useEffect(() => {
    if (notes.length === 0) {
      const defaultNote: Note = {
        id: generateId(),
        title: 'Untitled',
        content: JSON.stringify({
          type: 'doc',
          content: [{ type: 'paragraph' }]
        }),
        contentVersion: 2,
        updatedAt: Date.now(),
      }
      setNotes([defaultNote])
      setActiveNoteId(defaultNote.id)
    } else if (!activeNoteId || !notes.find(n => n.id === activeNoteId)) {
      setActiveNoteId(notes[0].id)
    }
  }, [notes, activeNoteId, setNotes, setActiveNoteId])

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0]

  const addNote = useCallback(() => {
    const newNote: Note = {
      id: generateId(),
      title: 'Untitled',
      content: JSON.stringify({
        type: 'doc',
        content: [{ type: 'paragraph' }]
      }),
      contentVersion: 2,
      updatedAt: Date.now(),
    }
    setNotes(prev => [...prev, newNote])
    setActiveNoteId(newNote.id)
    return newNote
  }, [setNotes, setActiveNoteId])

  const updateNote = useCallback((id: string, updates: Partial<Omit<Note, 'id'>>) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, ...updates, updatedAt: Date.now() }
          : note
      )
    )
  }, [setNotes])

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => {
      const filtered = prev.filter(note => note.id !== id)
      // If deleting the active note, switch to another
      if (id === activeNoteId && filtered.length > 0) {
        setActiveNoteId(filtered[0].id)
      }
      return filtered
    })
  }, [setNotes, activeNoteId, setActiveNoteId])

  const selectNote = useCallback((id: string) => {
    setActiveNoteId(id)
  }, [setActiveNoteId])

  return {
    notes,
    activeNote,
    activeNoteId,
    addNote,
    updateNote,
    deleteNote,
    selectNote,
  }
}
