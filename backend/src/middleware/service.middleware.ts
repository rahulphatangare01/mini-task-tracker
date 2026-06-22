import { AppError } from './error-handler'

export const ensureResourceFound = <T>(
  resource: T | null | undefined,
  message: string,
): T => {
  if (!resource) {
    throw new AppError(message, 404)
  }

  return resource
}
