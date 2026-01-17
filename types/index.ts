export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'complete' | 'archived'
  priority: Priority
  dueDate?: number
  createdAt: number
}

export const PRIORITIES: { id: Priority; label: string; color: string }[] = [
  { id: 'low', label: 'Low', color: '#6b7280' },
  { id: 'medium', label: 'Medium', color: '#d4a574' },
  { id: 'high', label: 'High', color: '#ef4444' },
]

export interface TodoItem {
  id: string
  text: string
  completed: boolean
}

export interface Note {
  id: string
  title: string
  content: string           // JSON string for TipTap
  contentVersion?: 1 | 2    // 1=plain text, 2=TipTap JSON
  updatedAt: number
}

export type TaskStatus = Task['status']

export const TASK_STATUSES: { id: TaskStatus; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'complete', label: 'Complete' },
  { id: 'archived', label: 'Archived' },
]

export const MAIN_STATUSES: TaskStatus[] = ['todo', 'in-progress', 'complete']

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  date: number           // Timestamp (midnight)
  startTime?: string     // "HH:MM" format
  endTime?: string       // "HH:MM" format
  color?: string         // Optional custom color
  createdAt: number
}
