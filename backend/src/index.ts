import app from './app'
import { env } from './config/env'
import { connectDatabase } from './db/db.configuration'
import { databaseConfig } from './db/db.configuration'
import { migrateDatabase } from './db/migrator'

const PORT = env.PORT

const startServer = async () => {
  try {
    await connectDatabase()

    if (databaseConfig.runMigrations) {
      await migrateDatabase()
    }

    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to connect to database', error)
    process.exit(1);
  }
}

void startServer()
