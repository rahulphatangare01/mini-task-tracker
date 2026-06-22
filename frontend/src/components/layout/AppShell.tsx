import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="shell">
      <header className="shell__header">
        <div>
          <p className="shell__eyebrow">Workspace</p>
          <h1 className="shell__title">Mini Task Tracker</h1>
          <p className="shell__subtitle">
            Track execution, deadlines, and delivery status from one task board.
          </p>
        </div>
        <nav className="shell__nav" aria-label="Primary">
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `shell__nav-link ${isActive ? 'shell__nav-link--active' : ''}`
            }
          >
            Tasks
          </NavLink>
        </nav>
      </header>
      <main className="shell__content">{children}</main>
    </div>
  )
}
