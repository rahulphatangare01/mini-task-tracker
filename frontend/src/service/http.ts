import axios from 'axios'

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

if (!rawApiBaseUrl) {
  throw new Error(
    'Missing VITE_API_BASE_URL. Set it in frontend/.env or your deployment environment.',
  )
}

const API_BASE_URL = /^https?:\/\//i.test(rawApiBaseUrl)
  ? rawApiBaseUrl
  : `https://${rawApiBaseUrl}`

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
