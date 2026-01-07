'use client'

import { useCallback } from 'react'
import { TodoItem } from '@/types'
import { useLocalStorage } from './useLocalStorage'
import { generateId } from '@/lib/utils'

export function useTodos() {
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('flowstate-todos', [])

  const addTodo = useCallback((text: string) => {
    const newTodo: TodoItem = {
      id: generateId(),
      text,
      completed: false,
    }
    setTodos(prev => [...prev, newTodo])
    return newTodo
  }, [setTodos])

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }, [setTodos])

  const updateTodo = useCallback((id: string, text: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, text } : todo
      )
    )
  }, [setTodos])

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }, [setTodos])

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed))
  }, [setTodos])

  return {
    todos,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    clearCompleted,
  }
}
