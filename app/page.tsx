'use client'

import { useState } from 'react'
import { TodoList } from '@/components/TodoList'
import { KanbanBoard } from '@/components/KanbanBoard'
import { NotesPanel } from '@/components/NotesPanel'
import { CalendarModal } from '@/components/calendar/CalendarModal'

export default function Home() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  return (
    <div className="h-screen flex flex-col bg-bg-primary">
      {/* Header */}
      <header className="flex-shrink-0 h-14 border-b border-border-primary px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent-amber shadow-glow" />
          <h1 className="font-mono text-lg font-semibold tracking-tight text-text-primary">
            flowstate
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCalendarOpen(true)}
            className="text-text-secondary hover:text-accent-amber transition-colors p-1.5 rounded-md hover:bg-bg-hover"
            title="Open calendar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <p className="text-sm text-text-muted font-mono">
            get in the zone
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex min-h-0">
        {/* Todo List Sidebar */}
        <aside className="w-64 flex-shrink-0 border-r border-border-primary bg-bg-secondary">
          <TodoList />
        </aside>

        {/* Kanban Board */}
        <section className="flex-1 min-w-0 overflow-hidden">
          <KanbanBoard />
        </section>

        {/* Notes Panel */}
        <aside className="w-72 flex-shrink-0 border-l border-border-primary bg-bg-secondary">
          <NotesPanel />
        </aside>
      </main>

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />
    </div>
  )
}
