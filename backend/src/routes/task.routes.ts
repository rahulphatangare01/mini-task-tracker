import { Router } from 'express'
import {
  getTask,
  getTasks,
  getSummary,
  markTaskCompleted,
  patchTask,
  postTask,
  removeTask,
} from '../controller/task.controller'
import {
  createTaskSchema,
  taskParamsSchema,
  taskQuerySchema,
  updateTaskSchema,
} from '../moddel/task.schema'
import { validateRequest } from '../middleware/validate'

const router = Router()

router.get('/', validateRequest(taskQuerySchema, 'query'), getTasks)
router.get('/summary', getSummary)
router.patch('/:id/complete', validateRequest(taskParamsSchema, 'params'), markTaskCompleted)
router.get('/:id', validateRequest(taskParamsSchema, 'params'), getTask)
router.post('/', validateRequest(createTaskSchema), postTask)
router.patch(
  '/:id',
  validateRequest(taskParamsSchema, 'params'),
  validateRequest(updateTaskSchema),
  patchTask,
)
router.delete('/:id', validateRequest(taskParamsSchema, 'params'), removeTask)

export default router
