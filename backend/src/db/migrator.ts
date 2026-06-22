import { SequelizeStorage, Umzug } from 'umzug'
import { sequelize } from './db.configuration'
import * as createTasksMigration from './migrations/001-create-tasks'
import * as addSoftDeleteColumnsMigration from './migrations/002-add-soft-delete-columns'

export const migrator = new Umzug({
  migrations: [
    {
      name: '001-create-tasks',
      up: async ({ context }) => createTasksMigration.up({ context }),
      down: async ({ context }) => createTasksMigration.down({ context }),
    },
    {
      name: '002-add-soft-delete-columns',
      up: async ({ context }) => addSoftDeleteColumnsMigration.up({ context }),
      down: async ({ context }) => addSoftDeleteColumnsMigration.down({ context }),
    },
  ],
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize,
  }),
  logger: undefined,
})

export const migrateDatabase = async (): Promise<void> => {
  const migrations = await migrator.up()

  if (migrations.length > 0) {
    console.log(
      `Database migrations applied: ${migrations.map((item) => item.name).join(', ')}`,
    )
  }
}

export const rollbackDatabase = async (): Promise<void> => {
  const migrations = await migrator.down()

  if (migrations.length > 0) {
    console.log(
      `Database migration rolled back: ${migrations.map((item) => item.name).join(', ')}`,
    )
  }
}
