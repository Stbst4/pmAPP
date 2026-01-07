'use client'

import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useTasks } from '@/hooks/useTasks'
import { Task, TaskStatus, Priority, MAIN_STATUSES, PRIORITIES } from '@/types'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard } from './KanbanCard'
import { ArchiveColumn } from './ArchiveColumn'
import { cn } from '@/lib/utils'

const COLUMN_INFO: Record<string, { label: string }> = {
  'todo': { label: 'To Do' },
  'in-progress': { label: 'In Progress' },
  'complete': { label: 'Complete' },
}

export function KanbanBoard() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasks,
    archiveTask,
    restoreTask,
    clearArchived,
  } = useTasks()

  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [showArchive, setShowArchive] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id)
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeTask = tasks.find(t => t.id === activeId)
    if (!activeTask) return

    // Check if dropping over a column
    const isOverColumn = MAIN_STATUSES.includes(overId as TaskStatus)
    if (isOverColumn) {
      const newStatus = overId as TaskStatus
      if (activeTask.status !== newStatus) {
        moveTask(activeId, newStatus)
      }
      return
    }

    // Check if dropping over another task
    const overTask = tasks.find(t => t.id === overId)
    if (overTask && activeTask.status !== overTask.status) {
      moveTask(activeId, overTask.status)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)

    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const activeTask = tasks.find(t => t.id === activeId)
    const overTask = tasks.find(t => t.id === overId)

    if (!activeTask) return

    // Reorder within same column
    if (overTask && activeTask.status === overTask.status) {
      const columnTasks = tasks.filter(t => t.status === activeTask.status)
      const oldIndex = columnTasks.findIndex(t => t.id === activeId)
      const newIndex = columnTasks.findIndex(t => t.id === overId)

      if (oldIndex !== newIndex) {
        const newColumnTasks = [...columnTasks]
        const [removed] = newColumnTasks.splice(oldIndex, 1)
        newColumnTasks.splice(newIndex, 0, removed)

        const otherTasks = tasks.filter(t => t.status !== activeTask.status)
        reorderTasks([...otherTasks, ...newColumnTasks])
      }
    }
  }

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks
      .filter(task => task.status === status)
      .filter(task => priorityFilter === 'all' || task.priority === priorityFilter)
  }

  const archivedTasks = tasks.filter(t => t.status === 'archived')
  const activeTasks = tasks.filter(t => t.status !== 'archived')

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="font-mono text-sm font-medium text-text-secondary uppercase tracking-wider">
              Board
            </h2>
            <span className="text-xs text-text-muted">
              {activeTasks.length} {activeTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          {/* Archive Toggle */}
          <button
            onClick={() => setShowArchive(!showArchive)}
            className={cn(
              'flex items-center gap-2 text-xs px-3 py-1.5 rounded-md transition-colors',
              showArchive
                ? 'bg-bg-hover text-text-primary'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Archive
            {archivedTasks.length > 0 && (
              <span className="bg-bg-surface px-1.5 py-0.5 rounded text-text-muted">
                {archivedTasks.length}
              </span>
            )}
          </button>
        </div>

        {/* Priority Filters */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-text-muted">Filter:</span>
          <button
            onClick={() => setPriorityFilter('all')}
            className={cn(
              'text-xs px-2.5 py-1 rounded-md transition-colors',
              priorityFilter === 'all'
                ? 'bg-bg-hover text-text-primary'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            All
          </button>
          {PRIORITIES.map((p) => (
            <button
              key={p.id}
              onClick={() => setPriorityFilter(p.id)}
              className={cn(
                'flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-colors',
                priorityFilter === p.id
                  ? 'bg-bg-hover text-text-primary'
                  : 'text-text-muted hover:text-text-secondary'
              )}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              {p.label}
            </button>
          ))}
        </div>

        {/* Columns */}
        <div className="flex-1 flex gap-4 min-h-0 overflow-x-auto pb-2">
          {MAIN_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              id={status}
              title={COLUMN_INFO[status].label}
              tasks={getTasksByStatus(status)}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              onArchiveTask={archiveTask}
            />
          ))}

          {/* Archive Column */}
          {showArchive && (
            <ArchiveColumn
              tasks={archivedTasks}
              onRestoreTask={restoreTask}
              onDeleteTask={deleteTask}
              onClearArchived={clearArchived}
            />
          )}
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <KanbanCard
            task={activeTask}
            isDragging
            onUpdate={() => {}}
            onDelete={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
