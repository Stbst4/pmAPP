'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task, Priority, PRIORITIES } from '@/types'
import { cn, formatDate } from '@/lib/utils'

interface KanbanCardProps {
  task: Task
  isDragging?: boolean
  showArchive?: boolean
  onUpdate: (updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void
  onDelete: () => void
  onArchive?: () => void
}

function getPriorityColor(priority: Priority): string {
  return PRIORITIES.find(p => p.id === priority)?.color || '#6b7280'
}

function formatDueDate(timestamp: number): { text: string; isOverdue: boolean; isToday: boolean } {
  const date = new Date(timestamp)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDay = new Date(timestamp)
  dueDay.setHours(0, 0, 0, 0)

  const diffDays = Math.floor((dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return { text: `${Math.abs(diffDays)}d overdue`, isOverdue: true, isToday: false }
  } else if (diffDays === 0) {
    return { text: 'Today', isOverdue: false, isToday: true }
  } else if (diffDays === 1) {
    return { text: 'Tomorrow', isOverdue: false, isToday: false }
  } else if (diffDays < 7) {
    return { text: `${diffDays}d`, isOverdue: false, isToday: false }
  } else {
    return {
      text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isOverdue: false,
      isToday: false,
    }
  }
}

export function KanbanCard({
  task,
  isDragging,
  showArchive,
  onUpdate,
  onDelete,
  onArchive,
}: KanbanCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description || '')
  const [editPriority, setEditPriority] = useState<Priority>(task.priority)
  const [editDueDate, setEditDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  )

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate({
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        priority: editPriority,
        dueDate: editDueDate ? new Date(editDueDate).getTime() : undefined,
      })
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      setEditTitle(task.title)
      setEditDescription(task.description || '')
      setEditPriority(task.priority)
      setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '')
      setIsEditing(false)
    }
  }

  const dueInfo = task.dueDate ? formatDueDate(task.dueDate) : null

  if (isDragging) {
    return (
      <div className="card p-3 shadow-card-hover rotate-3 opacity-90">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          />
          <h4 className="text-sm font-medium text-text-primary">{task.title}</h4>
        </div>
        {task.description && (
          <p className="text-xs text-text-secondary mt-1 line-clamp-2 ml-4">
            {task.description}
          </p>
        )}
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'card p-3 cursor-grab active:cursor-grabbing',
        'hover:shadow-card-hover hover:border-border-primary',
        'transition-all duration-200',
        isSortableDragging && 'opacity-50'
      )}
      {...attributes}
      {...listeners}
    >
      {isEditing ? (
        <div onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm font-medium text-text-primary focus:outline-none border-b border-border-primary pb-1 mb-2"
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a description..."
            className="w-full bg-transparent text-xs text-text-secondary focus:outline-none resize-none min-h-[40px]"
            rows={2}
          />

          {/* Priority Selector */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-text-muted">Priority:</span>
            {PRIORITIES.map((p) => (
              <button
                key={p.id}
                onClick={() => setEditPriority(p.id)}
                className={cn(
                  'flex items-center gap-1 text-xs px-2 py-0.5 rounded transition-colors',
                  editPriority === p.id
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

          {/* Due Date */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-text-muted">Due:</span>
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="bg-bg-hover text-xs text-text-primary px-2 py-1 rounded border-none focus:outline-none focus:ring-1 focus:ring-accent-amber/50"
            />
            {editDueDate && (
              <button
                onClick={() => setEditDueDate('')}
                className="text-xs text-text-muted hover:text-text-secondary"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSave}
              className="btn-primary text-xs py-1 px-2"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditTitle(task.title)
                setEditDescription(task.description || '')
                setEditPriority(task.priority)
                setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '')
                setIsEditing(false)
              }}
              className="btn-ghost text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="group">
          <div className="flex items-start gap-2">
            {/* Priority Dot */}
            <span
              className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
              style={{ backgroundColor: getPriorityColor(task.priority) }}
              title={`${task.priority} priority`}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4
                  className="text-sm font-medium text-text-primary cursor-pointer"
                  onDoubleClick={() => setIsEditing(true)}
                >
                  {task.title}
                </h4>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsEditing(true)
                    }}
                    className="text-text-muted hover:text-accent-amber p-1 -m-1"
                    title="Edit"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  {showArchive && onArchive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onArchive()
                      }}
                      className="text-text-muted hover:text-accent-sage p-1 -m-1"
                      title="Archive"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete()
                    }}
                    className="text-text-muted hover:text-red-400 p-1 -m-1"
                    title="Delete"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {task.description && (
                <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}

              {/* Due Date Badge */}
              {dueInfo && (
                <div className="mt-2">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded',
                      dueInfo.isOverdue && 'bg-red-500/20 text-red-400',
                      dueInfo.isToday && 'bg-accent-amber/20 text-accent-amber',
                      !dueInfo.isOverdue && !dueInfo.isToday && 'bg-bg-hover text-text-secondary'
                    )}
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {dueInfo.text}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
