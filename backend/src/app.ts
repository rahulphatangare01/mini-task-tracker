import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env'
import { requestLogger } from './middleware/request-logger'
import taskRoutes from './routes/task.routes'
import { errorHandler, notFoundHandler } from './middleware/error-handler'
import { sendSuccess } from './utils/response'

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.CLIENT_ORIGINS.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error(`CORS blocked for origin: ${origin}`))
    },
  }),
)

if (env.REQUEST_LOGGING) {
  app.use(requestLogger)
}

app.use(express.json())

app.get('/api/health', (_req, res) => {
  return sendSuccess(res, 'Backend server is running', {
    uptime: process.uptime(),
    environment: env.NODE_ENV,
  })
})

app.use('/api/tasks', taskRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
