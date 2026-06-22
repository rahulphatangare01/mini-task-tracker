import { connectDatabase } from './db.configuration'
import { migrateDatabase, rollbackDatabase } from './migrator'

const command = process.argv[2] ?? 'up'

const run = async () => {
  await connectDatabase()

  if (command === 'down') {
    await rollbackDatabase()
  } else {
    await migrateDatabase()
  }

  process.exit(0)
}

void run().catch((error) => {
  console.error('Migration command failed', error)
  process.exit(1)
})
