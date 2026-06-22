import {
  buildTaskWhereClause,
  Task,
  TaskEntity,
  TaskListResponse,
  TaskSummary,
  toTask,
} from '../moddel/task.model'
import {
  CreateTaskInput,
  TaskQueryInput,
  UpdateTaskInput,
} from '../moddel/task.schema'
import { ensureResourceFound } from '../middleware/service.middleware'
import { getCurrentIsoDate, normalizeDueDate } from '../utils/date'

const buildTaskSummary = async (): Promise<TaskSummary> => {
  const [all, open, completed] = await Promise.all([
    TaskEntity.count({ where: { isDeleted: false } }),
    TaskEntity.count({ where: { status: 'open', isDeleted: false } }),
    TaskEntity.count({ where: { status: 'completed', isDeleted: false } }),
  ])

  return {
    all,
    open,
    completed,
  }
}

export const getTaskSummary = async (): Promise<TaskSummary> => {
  return buildTaskSummary()
}

export const listTasks = async (
  query: TaskQueryInput,
): Promise<TaskListResponse> => {
  const [tasks, summary] = await Promise.all([
    TaskEntity.findAll({
      where: buildTaskWhereClause(query.status, query.search),
      order: [['createdAt', 'DESC']],
    }),
    buildTaskSummary(),
  ])

  return {
    items: tasks.map(toTask),
    summary,
  }
}

export const getTaskById = async (id: string): Promise<Task> => {
  const task = await TaskEntity.findOne({
    where: {
      id,
      isDeleted: false,
    },
  })

  return toTask(ensureResourceFound(task, 'Task not found'))
}

export const createTask = async (payload: CreateTaskInput): Promise<Task> => {
  const currentDate = getCurrentIsoDate()

  const task = await TaskEntity.create({
    title: payload.title.trim(),
    description: payload.description?.trim() ?? '',
    status: 'open',
    priority: payload.priority ?? 'medium',
    dueDate: payload.dueDate ? new Date(normalizeDueDate(payload.dueDate)!) : null,
    createdAt: new Date(currentDate),
    updatedAt: new Date(currentDate),
    completedAt: null,
    isDeleted: false,
    deletedAt: null,
  })

  return toTask(task)
}

export const updateTask = async (
  id: string,
  payload: UpdateTaskInput,
): Promise<Task> => {
  const task = ensureResourceFound(
    await TaskEntity.findOne({
      where: {
        id,
        isDeleted: false,
      },
    }),
    'Task not found',
  )
  const nextStatus = payload.status ?? task.status
  const currentDate = getCurrentIsoDate()

  await task.update({
    title: payload.title?.trim() ?? task.title,
    description: payload.description?.trim() ?? task.description,
    priority: payload.priority ?? task.priority,
    dueDate:
      payload.dueDate !== undefined
        ? payload.dueDate
          ? new Date(normalizeDueDate(payload.dueDate)!)
          : null
        : task.dueDate,
    status: nextStatus,
    updatedAt: new Date(currentDate),
    completedAt:
      nextStatus === 'completed'
        ? task.completedAt ?? new Date(currentDate)
        : null,
  })

  return toTask(task)
}

export const deleteTask = async (id: string): Promise<Task> => {
  const task = ensureResourceFound(
    await TaskEntity.findOne({
      where: {
        id,
        isDeleted: false,
      },
    }),
    'Task not found',
  )
  const currentDate = new Date(getCurrentIsoDate())

  await task.update({
    isDeleted: true,
    deletedAt: currentDate,
    updatedAt: currentDate,
  })

  return toTask(task)
}

export const completeTask = async (id: string): Promise<Task> => {
  return updateTask(id, {
    status: 'completed',
  })
}
