import mysql from 'mysql2/promise'
import { Sequelize } from 'sequelize'
import { env } from '../config/env'

type DatabaseConfig = {
  url?: string
  database?: string
  username?: string
  password?: string
  host?: string
  port?: number
  logging: boolean
  autoCreate: boolean
  runMigrations: boolean
}

const databaseConfig: DatabaseConfig = {
  url: env.MYSQL_URL,
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: env.DB_PORT,
  logging: env.DB_LOGGING,
  autoCreate: env.DB_AUTO_CREATE,
  runMigrations: env.DB_RUN_MIGRATIONS,
}

const resolvedConnectionInfo = (() => {
  if (!databaseConfig.url) {
    return {
      database: databaseConfig.database,
      host: databaseConfig.host,
      port: databaseConfig.port,
      username: databaseConfig.username,
      password: databaseConfig.password,
    }
  }

  try {
    const parsedUrl = new URL(databaseConfig.url)

    return {
      database: parsedUrl.pathname.replace(/^\//, '') || databaseConfig.database,
      host: parsedUrl.hostname || databaseConfig.host,
      port: Number(parsedUrl.port || databaseConfig.port),
      username: parsedUrl.username || databaseConfig.username,
      password: parsedUrl.password || databaseConfig.password,
    }
  } catch {
    return {
      database: databaseConfig.database,
      host: databaseConfig.host,
      port: databaseConfig.port,
      username: databaseConfig.username,
      password: databaseConfig.password,
    }
  }
})()

export const sequelize = databaseConfig.url
  ? new Sequelize(databaseConfig.url, {
      dialect: 'mysql',
      logging: databaseConfig.logging,
    })
  : new Sequelize(
      databaseConfig.database!,
      databaseConfig.username!,
      databaseConfig.password ?? '',
      {
        host: databaseConfig.host!,
        port: databaseConfig.port!,
        dialect: 'mysql',
        logging: databaseConfig.logging,
      },
    )

const ensureDatabaseExists = async (): Promise<void> => {
  if (!databaseConfig.autoCreate) {
    return
  }

  const connection = await mysql.createConnection({
    host: resolvedConnectionInfo.host,
    user: resolvedConnectionInfo.username,
    password: resolvedConnectionInfo.password,
    port: resolvedConnectionInfo.port,
  })

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${resolvedConnectionInfo.database}\``,
    )
  } finally {
    await connection.end()
  }
}

export const connectDatabase = async (): Promise<void> => {
  await ensureDatabaseExists()
  await sequelize.authenticate()

  console.log(
    `Database connected successfully: ${resolvedConnectionInfo.database}@${resolvedConnectionInfo.host}:${resolvedConnectionInfo.port}`,
  )
}

export { databaseConfig }
