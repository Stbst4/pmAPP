'use client'

import { useCallback } from 'react'
import { Task, TaskStatus, Priority } from '@/types'
import { useLocalStorage } from './useLocalStorage'
import { generateId } from '@/lib/utils'

interface AddTaskOptions {
  title: string
  description?: string
  status?: TaskStatus
  priority?: Priority
  dueDate?: number
}

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('flowstate-tasks', [])

  const addTask = useCallback((options: AddTaskOptions) => {
    const newTask: Task = {
      id: generateId(),
      title: options.title,
      description: options.description,
      status: options.status || 'todo',
      priority: options.priority || 'medium',
      dueDate: options.dueDate,
      createdAt: Date.now(),
    }
    setTasks(prev => [...prev, newTask])
    return newTask
  }, [setTasks])

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    )
  }, [setTasks])

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }, [setTasks])

  const moveTask = useCallback((id: string, newStatus: TaskStatus) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    )
  }, [setTasks])

  const getTasksByStatus = useCallback((status: TaskStatus) => {
    return tasks.filter(task => task.status === status)
  }, [tasks])

  const reorderTasks = useCallback((reorderedTasks: Task[]) => {
    setTasks(reorderedTasks)
  }, [setTasks])

  const archiveTask = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, status: 'archived' as TaskStatus } : task
      )
    )
  }, [setTasks])

  const restoreTask = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, status: 'complete' as TaskStatus } : task
      )
    )
  }, [setTasks])

  const clearArchived = useCallback(() => {
    setTasks(prev => prev.filter(task => task.status !== 'archived'))
  }, [setTasks])

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByStatus,
    reorderTasks,
    archiveTask,
    restoreTask,
    clearArchived,
  }
}
