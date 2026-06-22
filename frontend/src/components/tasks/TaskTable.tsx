import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Task } from '../../types/task'
import { formatDate } from '../../utils/formatters'
import { truncateText } from '../../utils/richText'
import { Badge } from '../ui/Badge'

type TaskTableProps = {
  items: Task[]
  loading?: boolean
  refreshing?: boolean
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onComplete: (task: Task) => Promise<void>
}

function ActionIcon({
  title,
  children,
  href,
  onClick,
  tone = 'default',
}: {
  title: string
  children: ReactNode
  href?: string
  onClick?: () => void
  tone?: 'default' | 'primary'
}) {
  const className = `icon-action ${tone === 'primary' ? 'icon-action--primary' : ''}`.trim()

  if (href) {
    return (
      <Link to={href} className={className} aria-label={title} title={title}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={className}
      aria-label={title}
      title={title}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function TaskTable({
  items,
  loading = false,
  refreshing = false,
  onEdit,
  onDelete,
  onComplete,
}: TaskTableProps) {
  return (
    <section className="card table-card">
      <div className="table-card__header">
        <div>
          <h2>Task listing</h2>
          <p>Review current tasks, status, due dates, and actions.</p>
        </div>
        {refreshing ? <span className="table-card__status">Refreshing...</span> : null}
      </div>
      <div className="table-wrap">
        <table className="task-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  <td colSpan={6}>
                    <div className="task-table__skeleton-row">
                      <span className="task-skeleton task-skeleton--title"></span>
                      <span className="task-skeleton task-skeleton--description"></span>
                      <span className="task-skeleton task-skeleton--pill"></span>
                      <span className="task-skeleton task-skeleton--pill"></span>
                    </div>
                  </td>
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="task-table__empty">
                  <div className="empty-state">
                    <strong>No tasks found</strong>
                    <p>
                      Try changing the search term or filter, or create a new task
                      to start tracking work.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((task) => (
                <tr key={task.id}>
                  <td data-label="Title">
                    <div className="task-table__title">
                      <strong>{task.title}</strong>
                    </div>
                  </td>
                  <td data-label="Description" className="task-table__description">
                    {truncateText(task.description, 50) || 'No description'}
                  </td>
                  <td data-label="Priority">
                    <Badge
                      tone={task.priority === 'high' ? 'warning' : 'default'}
                    >
                      {task.priority}
                    </Badge>
                  </td>
                  <td data-label="Status">
                    <Badge
                      tone={task.status === 'completed' ? 'success' : 'default'}
                    >
                      {task.status}
                    </Badge>
                  </td>
                  <td data-label="Due date">{formatDate(task.dueDate)}</td>
                  <td data-label="Actions">
                    <div className="task-table__actions">
                      <ActionIcon
                        title="Open task"
                        href={`/tasks/${task.id}`}
                        tone="primary"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                          />
                        </svg>
                      </ActionIcon>
                      <ActionIcon title="Edit task" onClick={() => onEdit(task)}>
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            d="M4 20h4l10-10-4-4L4 16v4Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="m12 6 4 4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                        </svg>
                      </ActionIcon>
                      {task.status === 'open' ? (
                        <ActionIcon
                          title="Complete task"
                          onClick={() => void onComplete(task)}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="m5 13 4 4L19 7"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.9"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </ActionIcon>
                      ) : null}
                      <ActionIcon title="Delete task" onClick={() => onDelete(task)}>
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            d="M5 7h14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                          <path
                            d="M10 11v6M14 11v6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                          <path
                            d="M7 7l1 12h8l1-12M9 7V5h6v2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </ActionIcon>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
