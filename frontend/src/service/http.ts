import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim()

if (!API_BASE_URL) {
  throw new Error(
    'Missing VITE_API_BASE_URL. Set it in frontend/.env or your deployment environment.',
  )
}

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      'Unable to complete the request'

    return Promise.reject(new Error(message))
  },
)
