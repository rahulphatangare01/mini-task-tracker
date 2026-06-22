import crypto from 'node:crypto'
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Op,
} from 'sequelize'
import { sequelize } from '../db/db.configuration'

export type TaskStatus = 'open' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'

export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  createdAt: string
  updatedAt: string
  completedAt: string | null
  deletedAt?: string | null
}

export type TaskSummary = {
  all: number
  open: number
  completed: number
}

export type TaskListResponse = {
  items: Task[]
  summary: TaskSummary
}

export class TaskEntity extends Model<
  InferAttributes<TaskEntity>,
  InferCreationAttributes<TaskEntity>
> {
  declare id: CreationOptional<string>
  declare title: string
  declare description: string
  declare status: TaskStatus
  declare priority: TaskPriority
  declare dueDate: Date | null
  declare completedAt: Date | null
  declare isDeleted: CreationOptional<boolean>
  declare deletedAt: Date | null
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

TaskEntity.init(
  {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => crypto.randomUUID(),
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title is required',
        },
        len: {
          args: [1, 255],
          msg: 'Title must be between 1 and 255 characters',
        },
      },
      set(value: string) {
        this.setDataValue('title', value.trim())
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
      set(value: string) {
        this.setDataValue('description', value.trim())
      },
    },
    status: {
      type: DataTypes.ENUM('open', 'completed'),
      allowNull: false,
      defaultValue: 'open',
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: false,
      defaultValue: 'medium',
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    timestamps: true,
    validate: {
      completedStateConsistency() {
        if (this.status === 'completed' && !this.completedAt) {
          throw new Error('Completed tasks must have completedAt')
        }

        if (this.status === 'open' && this.completedAt) {
          throw new Error('Open tasks cannot have completedAt')
        }
      },
    },
  },
)

export const toTask = (task: TaskEntity): Task => {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
    createdAt:
      task.createdAt instanceof Date
        ? task.createdAt.toISOString()
        : new Date(task.createdAt).toISOString(),
    updatedAt:
      task.updatedAt instanceof Date
        ? task.updatedAt.toISOString()
        : new Date(task.updatedAt).toISOString(),
    completedAt: task.completedAt
      ? new Date(task.completedAt).toISOString()
      : null,
    deletedAt: task.deletedAt ? new Date(task.deletedAt).toISOString() : null,
  }
}

export const buildTaskWhereClause = (
  status: 'all' | TaskStatus | undefined,
  search: string,
) => {
  const where: Record<string, unknown> = {
    isDeleted: false,
  }

  if (status && status !== 'all') {
    where.status = status
  }

  if (search) {
    where.title = {
      [Op.like]: `%${search}%`,
    }
  }

  return where
}
