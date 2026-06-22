import dotenv from 'dotenv'
import { existsSync } from 'node:fs'
import { z } from 'zod'

dotenv.config({
  path: process.env.ENV_FILE || (existsSync('.env') ? '.env' : '.env.example'),
  quiet: true,
})

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .optional()
    .default('development'),
  PORT: z.coerce.number().int().positive().optional().default(7000),
  MYSQL_URL: z.string().trim().optional(),
  DB_NAME: z.string().trim().min(1, 'DB_NAME is required').optional(),
  DB_USER: z.string().trim().min(1, 'DB_USER is required').optional(),
  DB_PASSWORD: z.string().trim().optional().default(''),
  DB_HOST: z.string().trim().min(1, 'DB_HOST is required').optional(),
  DB_PORT: z.coerce.number().int().positive({
    message: 'DB_PORT must be a positive number',
  }).optional(),
  DB_LOGGING: z
    .enum(['true', 'false'])
    .optional()
    .default('false')
    .transform((value) => value === 'true'),
  DB_AUTO_CREATE: z
    .enum(['true', 'false'])
    .optional()
    .default('true')
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

const parsedEnv = envSchema.superRefine((value, ctx) => {
  if (value.MYSQL_URL) {
    return
  }

  const hasSplitConfig = Boolean(
    value.DB_NAME &&
      value.DB_USER &&
      value.DB_HOST &&
      value.DB_PORT,
  )

  if (hasSplitConfig) {
    return
  }

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message:
      'Provide MYSQL_URL or complete DB_NAME, DB_USER, DB_HOST, and DB_PORT configuration.',
    path: ['MYSQL_URL'],
  })
}).safeParse(process.env)

if (!parsedEnv.success) {
  const errors = z.flattenError(parsedEnv.error)
  throw new Error(`Invalid environment configuration: ${JSON.stringify(errors)}`)
}

export const env = parsedEnv.data
