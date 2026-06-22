import { NextFunction, Request, Response } from 'express'
import { ZodTypeAny, z } from 'zod'
import { AppError } from './error-handler'

type ValidationTarget = 'body' | 'params' | 'query'

export const validateRequest =
  <T extends ZodTypeAny>(schema: T, target: ValidationTarget = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target])

    if (!result.success) {
      const flattened = z.flattenError(result.error)

      return next(
        new AppError('Validation failed', 400, {
          errors: {
            ...flattened.fieldErrors,
            ...(flattened.formErrors.length > 0
              ? { _form: flattened.formErrors }
              : {}),
          },
        }),
      )
    }

    const requestTarget = req[target]

    if (requestTarget && typeof requestTarget === 'object') {
      for (const key of Object.keys(requestTarget)) {
        delete requestTarget[key as keyof typeof requestTarget]
      }

      Object.assign(requestTarget, result.data)
    } else {
      ;(req as Request & Record<ValidationTarget, unknown>)[target] = result.data
    }

    return next()
  }
