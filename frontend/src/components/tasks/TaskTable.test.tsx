import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../test/renderWithProviders'
import type { Task } from '../../types/task'
import { TaskTable } from './TaskTable'

const baseTask: Task = {
  id: 'task-1',
  title: 'Build UI',
  description:
    '<p>This is a very long description that should be trimmed in the table preview output.</p>',
  status: 'open',
  priority: 'high',
  dueDate: '2026-06-30',
  createdAt: '2026-06-22T08:00:00.000Z',
  updatedAt: '2026-06-22T08:00:00.000Z',
  completedAt: null,
  deletedAt: null,
}

describe('TaskTable', () => {
  it('renders truncated plain-text description previews', () => {
    renderWithProviders(
      <TaskTable
        items={[baseTask]}
        onEdit={() => {}}
        onDelete={() => {}}
        onComplete={async () => {}}
      />,
    )

    expect(
      screen.getByText('This is a very long description that should be tri...'),
    ).toBeInTheDocument()
  })

  it('hides the complete action for completed tasks', () => {
    renderWithProviders(
      <TaskTable
        items={[
          {
            ...baseTask,
            status: 'completed',
            completedAt: '2026-06-22T09:00:00.000Z',
          },
        ]}
        onEdit={() => {}}
        onDelete={() => {}}
        onComplete={async () => {}}
      />,
    )

    expect(screen.queryByLabelText('Complete task')).not.toBeInTheDocument()
  })
})
