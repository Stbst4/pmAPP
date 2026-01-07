'use client'

import { useState, KeyboardEvent } from 'react'
import { useTodos } from '@/hooks/useTodos'
import { cn } from '@/lib/utils'

export function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted } = useTodos()
  const [newTodo, setNewTodo] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTodo.trim()) {
      addTodo(newTodo.trim())
      setNewTodo('')
    }
  }

  const completedCount = todos.filter(t => t.completed).length
  const totalCount = todos.length

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border-subtle">
        <h2 className="font-mono text-sm font-medium text-text-secondary uppercase tracking-wider">
          Quick Tasks
        </h2>
        {totalCount > 0 && (
          <p className="text-xs text-text-muted mt-1">
            {completedCount}/{totalCount} done
          </p>
        )}
      </div>

      {/* Add Todo Input */}
      <div className="p-3 border-b border-border-subtle">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task..."
          className="w-full input-base text-sm"
        />
      </div>

      {/* Todo List */}
      <div className="flex-1 overflow-y-auto p-2">
        {todos.length === 0 ? (
          <p className="text-center text-text-muted text-sm py-8">
            No tasks yet
          </p>
        ) : (
          <ul className="space-y-1">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={cn(
                  'group flex items-start gap-3 p-2 rounded-md',
                  'hover:bg-bg-hover transition-colors cursor-pointer'
                )}
                onClick={() => toggleTodo(todo.id)}
              >
                {/* Checkbox */}
                <div
                  className={cn(
                    'mt-0.5 w-4 h-4 rounded border-2 flex-shrink-0',
                    'flex items-center justify-center transition-all duration-200',
                    todo.completed
                      ? 'bg-accent-sage border-accent-sage'
                      : 'border-border-primary hover:border-accent-amber'
                  )}
                >
                  {todo.completed && (
                    <svg
                      className="w-2.5 h-2.5 text-bg-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>

                {/* Text */}
                <span
                  className={cn(
                    'flex-1 text-sm leading-tight transition-all duration-200',
                    todo.completed
                      ? 'text-text-muted line-through'
                      : 'text-text-primary'
                  )}
                >
                  {todo.text}
                </span>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteTodo(todo.id)
                  }}
                  className={cn(
                    'opacity-0 group-hover:opacity-100',
                    'text-text-muted hover:text-red-400',
                    'transition-opacity p-1 -m-1'
                  )}
                >
                  <svg
                    className="w-3.5 h-3.5"
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
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      {completedCount > 0 && (
        <div className="p-3 border-t border-border-subtle">
          <button
            onClick={clearCompleted}
            className="w-full btn-ghost text-xs text-text-muted"
          >
            Clear completed
          </button>
        </div>
      )}
    </div>
  )
}
