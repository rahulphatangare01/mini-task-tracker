export type TaskStatus = 'open' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'

export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  createdAt: string
  updatedAt: string
  completedAt: string | null
  deletedAt?: string | null
}

export type TaskSummary = {
  all: number
  open: number
  completed: number
}

export type TaskListData = {
  items: Task[]
  summary: TaskSummary
}

export type TaskFilterStatus = 'all' | 'open' | 'completed'

export type ApiResponse<T> = {
  message: string
  status: 'success' | 'error'
  data: T
  success: boolean
}
