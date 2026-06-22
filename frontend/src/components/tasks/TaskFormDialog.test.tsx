import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test/renderWithProviders'
import { TaskFormDialog } from './TaskFormDialog'

describe('TaskFormDialog', () => {
  it('shows a validation error when title is empty', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <TaskFormDialog
        open
        mode="create"
        onClose={() => {}}
        onSubmit={async () => {}}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Create task' }))

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument()
    })
  })
})
