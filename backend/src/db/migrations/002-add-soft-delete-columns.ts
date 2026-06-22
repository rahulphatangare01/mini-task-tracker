import { DataTypes, QueryInterface } from 'sequelize'

export const up = async ({ context }: { context: QueryInterface }) => {
  const tableDescription = await context.describeTable('tasks')

  if (!('isDeleted' in tableDescription)) {
    await context.addColumn('tasks', 'isDeleted', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
  }

  if (!('deletedAt' in tableDescription)) {
    await context.addColumn('tasks', 'deletedAt', {
      type: DataTypes.DATE,
      allowNull: true,
    })
  }
}

export const down = async ({ context }: { context: QueryInterface }) => {
  const tableDescription = await context.describeTable('tasks')

  if ('deletedAt' in tableDescription) {
    await context.removeColumn('tasks', 'deletedAt')
  }

  if ('isDeleted' in tableDescription) {
    await context.removeColumn('tasks', 'isDeleted')
  }
}
