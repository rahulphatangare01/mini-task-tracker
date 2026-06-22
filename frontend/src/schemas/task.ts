import { z } from 'zod'

const dueDateSchema = z.preprocess((value) => {
  if (value === '' || value === undefined) {
    return null
  }

  return value
}, z.string().nullable())

export const taskFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().optional().default(''),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: dueDateSchema.default(null),
})

export type TaskFormValues = z.infer<typeof taskFormSchema>
