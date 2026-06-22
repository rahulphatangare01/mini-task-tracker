import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config({ quiet: true })

const emptyToUndefined = (value: string | undefined) => {
  if (value === undefined) {
    return undefined
  }

  const trimmed = value.trim()

  return trimmed.length > 0 ? trimmed : undefined
}

const firstDefined = (...values: Array<string | undefined>) =>
  values.find((value) => value !== undefined)

const resolveDatabaseUrl = () => {
  const rawUrl = firstDefined(
    emptyToUndefined(process.env.DATABASE_URL),
    emptyToUndefined(process.env.MYSQL_URL),
    emptyToUndefined(process.env.MYSQL_PUBLIC_URL),
  )

  if (!rawUrl) {
    return null
  }

  try {
    return new URL(rawUrl)
  } catch {
    return null
  }
}

const databaseUrl = resolveDatabaseUrl()

const normalizedEnv = {
  ...process.env,
  DB_NAME: firstDefined(
    emptyToUndefined(process.env.DB_NAME),
    emptyToUndefined(process.env.MYSQLDATABASE),
    emptyToUndefined(process.env.MYSQL_DATABASE),
    emptyToUndefined(process.env.DATABASE),
    emptyToUndefined(databaseUrl?.pathname.replace(/^\//, '')),
  ),
  DB_USER: firstDefined(
    emptyToUndefined(process.env.DB_USER),
    emptyToUndefined(process.env.MYSQLUSER),
    emptyToUndefined(databaseUrl?.username),
  ),
  DB_PASSWORD: firstDefined(
    emptyToUndefined(process.env.DB_PASSWORD),
    emptyToUndefined(process.env.MYSQLPASSWORD),
    emptyToUndefined(process.env.MYSQL_ROOT_PASSWORD),
    emptyToUndefined(databaseUrl?.password),
  ),
  DB_HOST: firstDefined(
    emptyToUndefined(process.env.DB_HOST),
    emptyToUndefined(process.env.MYSQLHOST),
    emptyToUndefined(databaseUrl?.hostname),
  ),
  DB_PORT: firstDefined(
    emptyToUndefined(process.env.DB_PORT),
    emptyToUndefined(process.env.MYSQLPORT),
    emptyToUndefined(databaseUrl?.port),
  ),
  CLIENT_ORIGINS: firstDefined(
    emptyToUndefined(process.env.CLIENT_ORIGINS),
    'http://localhost:5173,http://localhost:5174',
  ),
}

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

const parsedEnv = envSchema.safeParse(normalizedEnv)

if (!parsedEnv.success) {
  const errors = z.flattenError(parsedEnv.error)
  throw new Error(`Invalid environment configuration: ${JSON.stringify(errors)}`)
}

export const env = parsedEnv.data
