import { NextFunction, Request, Response } from 'express'
import { ZodError, z } from 'zod'
import { sendError } from '../utils/response'

export class AppError extends Error {
  statusCode: number
  data: Record<string, unknown>

  constructor(
    message: string,
    statusCode = 500,
    data: Record<string, unknown> = {},
  ) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.data = data
  }
}

export const notFoundHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  next(new AppError('Route not found', 404))
}

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    return sendError(res, error.message, error.data, error.statusCode)
  }

  if (error instanceof ZodError) {
    const flattened = z.flattenError(error)

    return sendError(
      res,
      'Validation failed',
      {
        errors: {
          ...flattened.fieldErrors,
          ...(flattened.formErrors.length > 0
            ? { _form: flattened.formErrors }
            : {}),
        },
      },
      400,
    )
  }

  return sendError(res, 'Internal server error', {}, 500)
}
