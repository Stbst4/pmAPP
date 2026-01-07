'use client'

import { Task } from '@/types'
import { cn } from '@/lib/utils'

interface ArchiveColumnProps {
  tasks: Task[]
  onRestoreTask: (id: string) => void
  onDeleteTask: (id: string) => void
  onClearArchived: () => void
}

export function ArchiveColumn({
  tasks,
  onRestoreTask,
  onDeleteTask,
  onClearArchived,
}: ArchiveColumnProps) {
  return (
    <div
      className={cn(
        'flex-1 min-w-[280px] max-w-[340px] flex flex-col',
        'bg-bg-secondary rounded-lg border border-border-primary border-t-2 border-t-text-muted/50'
      )}
    >
      {/* Column Header */}
      <div className="p-3 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm text-text-secondary">Archived</h3>
          <span className="text-xs text-text-muted bg-bg-hover px-1.5 py-0.5 rounded">
            {tasks.length}
          </span>
        </div>
        {tasks.length > 0 && (
          <button
            onClick={onClearArchived}
            className="text-xs text-text-muted hover:text-red-400 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Archived Tasks */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {tasks.length === 0 ? (
          <p className="text-center text-text-muted text-xs py-8">
            No archived tasks
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="card p-3 opacity-60 hover:opacity-100 transition-opacity"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm text-text-secondary line-through flex-1">
                  {task.title}
                </h4>
                <div className="flex gap-1">
                  <button
                    onClick={() => onRestoreTask(task.id)}
                    className="text-text-muted hover:text-accent-sage p-1"
                    title="Restore"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-text-muted hover:text-red-400 p-1"
                    title="Delete permanently"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              {task.description && (
                <p className="text-xs text-text-muted mt-1 line-clamp-1">
                  {task.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
