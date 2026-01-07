'use client'

import { useState, KeyboardEvent } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Task, TaskStatus, Priority, PRIORITIES } from '@/types'
import { KanbanCard } from './KanbanCard'
import { cn } from '@/lib/utils'

interface AddTaskOptions {
  title: string
  description?: string
  status?: TaskStatus
  priority?: Priority
  dueDate?: number
}

interface KanbanColumnProps {
  id: TaskStatus
  title: string
  tasks: Task[]
  onAddTask: (options: AddTaskOptions) => void
  onUpdateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void
  onDeleteTask: (id: string) => void
  onArchiveTask: (id: string) => void
}

export function KanbanColumn({
  id,
  title,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onArchiveTask,
}: KanbanColumnProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium')

  const { setNodeRef, isOver } = useDroppable({ id })

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask({
        title: newTaskTitle.trim(),
        status: id,
        priority: newTaskPriority,
      })
      setNewTaskTitle('')
      setNewTaskPriority('medium')
      setIsAdding(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTask()
    } else if (e.key === 'Escape') {
      setIsAdding(false)
      setNewTaskTitle('')
    }
  }

  const columnColor = {
    'todo': 'border-t-text-muted',
    'in-progress': 'border-t-accent-amber',
    'complete': 'border-t-accent-sage',
    'archived': 'border-t-text-muted/50',
  }[id]

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex-1 min-w-[280px] max-w-[340px] flex flex-col',
        'bg-bg-secondary rounded-lg border border-border-primary border-t-2',
        columnColor,
        isOver && 'ring-2 ring-accent-amber/30'
      )}
    >
      {/* Column Header */}
      <div className="p-3 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm text-text-primary">{title}</h3>
          <span className="text-xs text-text-muted bg-bg-hover px-1.5 py-0.5 rounded">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="text-text-muted hover:text-accent-amber transition-colors p-1"
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

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onUpdate={(updates) => onUpdateTask(task.id, updates)}
              onDelete={() => onDeleteTask(task.id)}
              onArchive={() => onArchiveTask(task.id)}
              showArchive={id === 'complete'}
            />
          ))}
        </SortableContext>

        {/* Add Task Input */}
        {isAdding && (
          <div className="card p-3 animate-scale-in">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Task title..."
              className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
              autoFocus
            />

            {/* Priority Selector */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-text-muted">Priority:</span>
              {PRIORITIES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setNewTaskPriority(p.id)}
                  className={cn(
                    'flex items-center gap-1 text-xs px-2 py-0.5 rounded transition-colors',
                    newTaskPriority === p.id
                      ? 'bg-bg-hover text-text-primary'
                      : 'text-text-muted hover:text-text-secondary'
                  )}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleAddTask}
                className="btn-primary text-xs py-1 px-3"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setIsAdding(false)
                  setNewTaskTitle('')
                  setNewTaskPriority('medium')
                }}
                className="btn-ghost text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {tasks.length === 0 && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className={cn(
              'w-full p-4 rounded-lg border-2 border-dashed border-border-subtle',
              'text-text-muted text-sm',
              'hover:border-border-primary hover:text-text-secondary',
              'transition-colors'
            )}
          >
            + Add a task
          </button>
        )}
      </div>
    </div>
  )
}
