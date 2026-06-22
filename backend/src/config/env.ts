import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config({ quiet: true })

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .optional()
    .default('development'),
  PORT: z.coerce.number().int().positive().optional().default(7000),
  DB_NAME: z.string().trim().min(1).optional().default('mini-task'),
  DB_USER: z.string().trim().min(1).optional().default('root'),
  DB_PASSWORD: z.string().trim().optional().default('RahulP@1012'),
  DB_HOST: z.string().trim().min(1).optional().default('localhost'),
  DB_PORT: z.coerce.number().int().positive().optional().default(3306),
  DB_LOGGING: z
    .enum(['true', 'false'])
    .optional()
    .default('false')
    .transform((value) => value === 'true'),
  DB_RUN_MIGRATIONS: z
    .enum(['true', 'false'])
    .optional()
    .default('true')
    .transform((value) => value === 'true'),
  REQUEST_LOGGING: z
    .enum(['true', 'false'])
    .optional()
    .default('false')
    .transform((value) => value === 'true'),
  CLIENT_ORIGINS: z
    .string()
    .trim()
    .optional()
    .default('http://localhost:5173,http://localhost:5174')
    .transform((value) =>
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    ),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  const errors = z.flattenError(parsedEnv.error)
  throw new Error(`Invalid environment configuration: ${JSON.stringify(errors)}`)
}

export const env = parsedEnv.data
