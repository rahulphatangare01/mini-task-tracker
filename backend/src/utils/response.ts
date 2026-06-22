import { Response } from 'express'

type ApiStatus = 'success' | 'error'

type ApiResponse<T> = {
  message: string
  status: ApiStatus
  data: T
  success: boolean
}

const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  status: ApiStatus,
  data: T,
  success: boolean,
) => {
  const payload: ApiResponse<T> = {
    message,
    status,
    data,
    success,
  }

  return res.status(statusCode).json(payload)
}

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data: T,
  statusCode = 200,
) => {
  return sendResponse(res, statusCode, message, 'success', data, true)
}

export const sendError = <T>(
  res: Response,
  message: string,
  data: T,
  statusCode = 500,
) => {
  return sendResponse(res, statusCode, message, 'error', data, false)
}
