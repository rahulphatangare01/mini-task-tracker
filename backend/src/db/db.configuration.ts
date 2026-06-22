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

export const connectDatabase = async (): Promise<void> => {
  await sequelize.authenticate()

  console.log(
    `Database connected successfully: ${databaseConfig.database}@${databaseConfig.host}:${databaseConfig.port}`,
  )
}

export { databaseConfig }
