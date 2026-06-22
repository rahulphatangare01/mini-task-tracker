import mysql from 'mysql2/promise'
import { Sequelize } from 'sequelize'
import { env } from '../config/env'

type DatabaseConfig = {
  database: string
  username: string
  password: string
  host: string
  port: number
  logging: boolean
  runMigrations: boolean
}

const databaseConfig: DatabaseConfig = {
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: env.DB_PORT,
  logging: env.DB_LOGGING,
  runMigrations: env.DB_RUN_MIGRATIONS,
}

export const sequelize = new Sequelize(
  databaseConfig.database,
  databaseConfig.username,
  databaseConfig.password,
  {
    host: databaseConfig.host,
    port: databaseConfig.port,
    dialect: 'mysql',
    logging: databaseConfig.logging,
  },
)

export const ensureDatabaseExists = async (): Promise<void> => {
  const connection = await mysql.createConnection({
    host: databaseConfig.host,
    user: databaseConfig.username,
    password: databaseConfig.password,
    port: databaseConfig.port,
  })

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${databaseConfig.database}\``,
    )
  } finally {
    await connection.end()
  }
}

export const connectDatabase = async (): Promise<void> => {
  await ensureDatabaseExists()
  await sequelize.authenticate()

  console.log(
    `Database connected successfully: ${databaseConfig.database}@${databaseConfig.host}:${databaseConfig.port}`,
  )
}

export { databaseConfig }
