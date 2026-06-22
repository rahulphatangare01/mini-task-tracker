import { z } from 'zod'

export const taskStatusSchema = z.enum(['open', 'completed'])
export const taskPrioritySchema = z.enum(['low', 'medium', 'high'])

const dueDateValueSchema = z
  .string()
  .trim()
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'Due date must be a valid date',
  })
  .transform((value) => new Date(value).toISOString())

const dueDateSchema = z.preprocess((value) => {
  if (value === '' || value === undefined) {
    return null
  }

  return value
}, dueDateValueSchema.nullable())

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().optional().default(''),
  priority: taskPrioritySchema.optional().default('medium'),
  dueDate: dueDateSchema.optional().default(null),
})

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').optional(),
    description: z.string().trim().optional(),
    priority: taskPrioritySchema.optional(),
    dueDate: dueDateSchema.optional(),
    status: taskStatusSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field is required to update task',
  })

export const taskQuerySchema = z.object({
  status: z.enum(['all', 'open', 'completed']).optional().default('all'),
  search: z.string().trim().optional().default(''),
})

export const taskParamsSchema = z.object({
  id: z.string().trim().min(1, 'Task id is required'),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type TaskQueryInput = z.infer<typeof taskQuerySchema>
export type TaskParamsInput = z.infer<typeof taskParamsSchema>
