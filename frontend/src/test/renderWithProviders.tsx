import type { ReactElement, ReactNode } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ToastProvider } from '../components/ui/ToastProvider'

export const renderWithProviders = (
  ui: ReactElement,
  { route = '/tasks' }: { route?: string } = {},
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <ToastProvider>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </ToastProvider>
  )

  return render(ui, { wrapper: Wrapper })
}
