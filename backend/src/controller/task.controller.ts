import { Request, Response } from 'express'
import { asyncHandler } from '../middleware/controller.middleware'
import {
  CreateTaskInput,
  TaskParamsInput,
  taskQuerySchema,
  TaskQueryInput,
  UpdateTaskInput,
} from '../moddel/task.schema'
import {
  completeTask,
  createTask,
  deleteTask,
  getTaskById,
  getTaskSummary,
  listTasks,
  updateTask,
} from '../service/task.service'
import { sendSuccess } from '../utils/response'

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const query = taskQuerySchema.parse(req.query) as TaskQueryInput
  const data = await listTasks(query)

  return sendSuccess(res, 'Tasks fetched successfully', data)
})

export const getTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as TaskParamsInput
  const task = await getTaskById(id)

  return sendSuccess(res, 'Task fetched successfully', task)
})

export const getSummary = asyncHandler(async (_req: Request, res: Response) => {
  const summary = await getTaskSummary()

  return sendSuccess(res, 'Task summary fetched successfully', summary)
})

export const postTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await createTask(req.body as CreateTaskInput)

  return sendSuccess(res, 'Task created successfully', task, 201)
})

export const patchTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as TaskParamsInput
  const task = await updateTask(id, req.body as UpdateTaskInput)

  return sendSuccess(res, 'Task updated successfully', task)
})

export const removeTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as TaskParamsInput
  const task = await deleteTask(id)

  return sendSuccess(res, 'Task deleted successfully', task)
})

export const markTaskCompleted = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params as TaskParamsInput
    const task = await completeTask(id)

    return sendSuccess(res, 'Task marked as completed successfully', task)
  },
)
