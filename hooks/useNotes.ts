'use client'

import { useCallback, useState, useEffect } from 'react'
import { Note } from '@/types'
import { useLocalStorage } from './useLocalStorage'
import { generateId } from '@/lib/utils'

export function useNotes() {
  const [notes, setNotes] = useLocalStorage<Note[]>('flowstate-notes', [])
  const [activeNoteId, setActiveNoteId] = useLocalStorage<string | null>('flowstate-active-note', null)

  // Ensure there's always at least one note
  useEffect(() => {
    if (notes.length === 0) {
      const defaultNote: Note = {
        id: generateId(),
        title: 'Untitled',
        content: '',
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
      content: '',
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
