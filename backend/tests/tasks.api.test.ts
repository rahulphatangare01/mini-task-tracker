import mysql from 'mysql2/promise'
import request from 'supertest'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'

beforeAll(async () => {
  const rootConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
  })

  await rootConnection.query(`DROP DATABASE IF EXISTS \`${process.env.DB_NAME}\``)
  await rootConnection.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``,
  )
  await rootConnection.end()

  const [{ connectDatabase }, { migrateDatabase }, { default: app }, { sequelize }] =
    await Promise.all([
      import('../src/db/db.configuration'),
      import('../src/db/migrator'),
      import('../src/app'),
      import('../src/db/db.configuration'),
    ])

  await connectDatabase()
  await migrateDatabase()

  globalThis.__TEST_APP__ = app
  globalThis.__TEST_SEQUELIZE__ = sequelize
})

beforeEach(async () => {
  await globalThis.__TEST_SEQUELIZE__.query('DELETE FROM tasks')
})

describe('Task API', () => {
  it('creates a task and returns the shared success response shape', async () => {
    const response = await request(globalThis.__TEST_APP__)
      .post('/api/tasks')
      .send({
        title: 'Write tests',
        description: 'Cover create endpoint',
        priority: 'high',
        dueDate: '2026-06-30',
      })

    expect(response.status).toBe(201)
    expect(response.body.success).toBe(true)
    expect(response.body.status).toBe('success')
    expect(response.body.data.title).toBe('Write tests')
    expect(response.body.data.priority).toBe('high')
  })

  it('lists tasks with filter and summary data', async () => {
    await request(globalThis.__TEST_APP__).post('/api/tasks').send({
      title: 'Open task',
      description: 'Visible in list',
      priority: 'medium',
    })

    const created = await request(globalThis.__TEST_APP__)
      .post('/api/tasks')
      .send({
        title: 'Completed task',
        description: 'Will be completed',
        priority: 'low',
      })

    await request(globalThis.__TEST_APP__)
      .patch(`/api/tasks/${created.body.data.id}`)
      .send({ status: 'completed' })

    const response = await request(globalThis.__TEST_APP__).get(
      '/api/tasks?status=completed&search=Completed',
    )

    expect(response.status).toBe(200)
    expect(response.body.data.items).toHaveLength(1)
    expect(response.body.data.items[0].status).toBe('completed')
    expect(response.body.data.summary.all).toBe(2)
    expect(response.body.data.summary.completed).toBe(1)
  })

  it('returns summary from the dedicated summary endpoint', async () => {
    await request(globalThis.__TEST_APP__).post('/api/tasks').send({
      title: 'Summary open task',
    })

    const completedTask = await request(globalThis.__TEST_APP__)
      .post('/api/tasks')
      .send({
        title: 'Summary completed task',
      })

    await request(globalThis.__TEST_APP__)
      .patch(`/api/tasks/${completedTask.body.data.id}/complete`)
      .send()

    const response = await request(globalThis.__TEST_APP__).get(
      '/api/tasks/summary',
    )

    expect(response.status).toBe(200)
    expect(response.body.data.all).toBe(2)
    expect(response.body.data.open).toBe(1)
    expect(response.body.data.completed).toBe(1)
  })

  it('updates a task without overwriting omitted fields', async () => {
    const created = await request(globalThis.__TEST_APP__)
      .post('/api/tasks')
      .send({
        title: 'Original title',
        description: 'Original description',
        priority: 'high',
        dueDate: '2026-06-28',
      })

    const response = await request(globalThis.__TEST_APP__)
      .patch(`/api/tasks/${created.body.data.id}`)
      .send({
        status: 'completed',
        title: 'Updated title',
      })

    expect(response.status).toBe(200)
    expect(response.body.data.title).toBe('Updated title')
    expect(response.body.data.description).toBe('Original description')
    expect(response.body.data.priority).toBe('high')
    expect(response.body.data.completedAt).not.toBeNull()
  })

  it('soft deletes a task by id and excludes it from task views', async () => {
    const created = await request(globalThis.__TEST_APP__)
      .post('/api/tasks')
      .send({
        title: 'Delete me',
        description: 'Temporary task',
      })

    const response = await request(globalThis.__TEST_APP__).delete(
      `/api/tasks/${created.body.data.id}`,
    )

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)

    const missing = await request(globalThis.__TEST_APP__).get(
      `/api/tasks/${created.body.data.id}`,
    )

    expect(missing.status).toBe(404)
    expect(missing.body.success).toBe(false)

    const list = await request(globalThis.__TEST_APP__).get('/api/tasks')
    expect(list.status).toBe(200)
    expect(list.body.data.items).toHaveLength(0)
    expect(list.body.data.summary.all).toBe(0)
  })

  it('returns validation errors for invalid create payload', async () => {
    const response = await request(globalThis.__TEST_APP__)
      .post('/api/tasks')
      .send({
        title: '   ',
      })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.status).toBe('error')
    expect(response.body.data.errors.title).toContain('Title is required')
  })

  it('returns form validation errors for empty patch payload', async () => {
    const created = await request(globalThis.__TEST_APP__)
      .post('/api/tasks')
      .send({
        title: 'Patch target',
      })

    const response = await request(globalThis.__TEST_APP__)
      .patch(`/api/tasks/${created.body.data.id}`)
      .send({})

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.data.errors._form).toContain(
      'At least one field is required to update task',
    )
  })
})
