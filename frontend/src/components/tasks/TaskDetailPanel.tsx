import { Link } from 'react-router-dom'
import type { Task } from '../../types/task'
import { formatDate, formatDateTime } from '../../utils/formatters'
import { sanitizeRichText } from '../../utils/richText'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

type TaskDetailPanelProps = {
  task: Task | null
  loading?: boolean
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onComplete: (task: Task) => Promise<void>
}

export function TaskDetailPanel({
  task,
  loading = false,
  onEdit,
  onDelete,
  onComplete,
}: TaskDetailPanelProps) {
  if (loading) {
    return (
      <aside className="detail-panel card">
        <p className="detail-panel__empty">Loading task details...</p>
      </aside>
    )
  }

  if (!task) {
    return null
  }

  return (
    <aside className="detail-panel card">
      <div className="detail-panel__head">
        <div>
          <p className="shell__eyebrow">Task detail</p>
          <h2>{task.title}</h2>
        </div>
        <Link to="/tasks" className="modal__close">
          Close
        </Link>
      </div>
      <div className="detail-panel__badges">
        <Badge tone={task.status === 'completed' ? 'success' : 'default'}>
          {task.status}
        </Badge>
        <Badge tone={task.priority === 'high' ? 'warning' : 'default'}>
          {task.priority}
        </Badge>
      </div>
      <section className="detail-panel__hero">
        <div className="detail-panel__hero-item">
          <span>Task ID</span>
          <strong>{task.id.slice(0, 8).toUpperCase()}</strong>
        </div>
        <div className="detail-panel__hero-item">
          <span>Delivery</span>
          <strong>{task.status === 'completed' ? 'Completed' : 'Active'}</strong>
        </div>
      </section>
      {task.description ? (
        <div
          className="detail-panel__description detail-panel__description--rich"
          dangerouslySetInnerHTML={{ __html: sanitizeRichText(task.description) }}
        />
      ) : (
        <p className="detail-panel__description">
          No description added for this task yet.
        </p>
      )}
      <dl className="detail-panel__grid">
        <div>
          <dt>Due date</dt>
          <dd>{formatDate(task.dueDate)}</dd>
        </div>
        <div>
          <dt>Created at</dt>
          <dd>{formatDateTime(task.createdAt)}</dd>
        </div>
        <div>
          <dt>Updated at</dt>
          <dd>{formatDateTime(task.updatedAt)}</dd>
        </div>
        <div>
          <dt>Completed at</dt>
          <dd>{formatDateTime(task.completedAt)}</dd>
        </div>
      </dl>
      <div className="detail-panel__actions">
        <Button type="button" variant="secondary" onClick={() => onEdit(task)}>
          Edit
        </Button>
        {task.status === 'open' ? (
          <Button type="button" onClick={() => void onComplete(task)}>
            Mark completed
          </Button>
        ) : null}
        <Button type="button" variant="ghost" onClick={() => onDelete(task)}>
          Delete
        </Button>
      </div>
    </aside>
  )
}
