import type { Express } from 'express'
import type { Sequelize } from 'sequelize'

declare global {
  var __TEST_APP__: Express
  var __TEST_SEQUELIZE__: Sequelize
}

export {}
