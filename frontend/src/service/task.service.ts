import { http } from './http'
import type { TaskFormValues } from '../schemas/task'
import type {
  ApiResponse,
  Task,
  TaskFilterStatus,
  TaskListData,
  TaskSummary,
} from '../types/task'

type QueryOptions = {
  status: TaskFilterStatus
  search: string
}

const unwrap = <T>(response: { data: ApiResponse<T> }) => {
  if (!response.data.success) {
    throw new Error(response.data.message || 'Request failed')
  }

  return response.data.data
}

export const getTasks = async (query: QueryOptions): Promise<TaskListData> => {
  const response = await http.get<ApiResponse<TaskListData>>('/tasks', {
    params: {
      status: query.status,
      search: query.search.trim() || undefined,
    },
  })

  return unwrap(response)
}

export const getTaskSummary = async (): Promise<TaskSummary> => {
  const response = await http.get<ApiResponse<TaskSummary>>('/tasks/summary')

  return unwrap(response)
}

export const getTaskById = async (taskId: string): Promise<Task> => {
  const response = await http.get<ApiResponse<Task>>(`/tasks/${taskId}`)

  return unwrap(response)
}

export const createTask = async (values: TaskFormValues): Promise<Task> => {
  const response = await http.post<ApiResponse<Task>>('/tasks', values)

  return unwrap(response)
}

export const updateTask = async (
  taskId: string,
  values: Partial<TaskFormValues>,
): Promise<Task> => {
  const response = await http.patch<ApiResponse<Task>>(`/tasks/${taskId}`, values)

  return unwrap(response)
}

export const completeTask = async (taskId: string): Promise<Task> => {
  const response = await http.patch<ApiResponse<Task>>(
    `/tasks/${taskId}/complete`,
  )

  return unwrap(response)
}

export const deleteTask = async (taskId: string): Promise<Task> => {
  const response = await http.delete<ApiResponse<Task>>(`/tasks/${taskId}`)

  return unwrap(response)
}
