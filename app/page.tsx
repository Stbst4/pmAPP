'use client'

import { TodoList } from '@/components/TodoList'
import { KanbanBoard } from '@/components/KanbanBoard'
import { NotesPanel } from '@/components/NotesPanel'

export default function Home() {
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
        <p className="text-sm text-text-muted font-mono">
          get in the zone
        </p>
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
    </div>
  )
}
