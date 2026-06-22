import { Badge } from '../ui/Badge'
import type { TaskSummary } from '../../types/task'

type TaskSummaryCardsProps = {
  summary: TaskSummary
}

export function TaskSummaryCards({ summary }: TaskSummaryCardsProps) {
  return (
    <section className="summary-grid">
      <article className="summary-card">
        <div className="summary-card__meta">
          <span>Total tasks</span>
          <Badge>Live</Badge>
        </div>
        <strong>{summary.all}</strong>
      </article>
      <article className="summary-card">
        <div className="summary-card__meta">
          <span>Open</span>
          <Badge tone="warning">In progress</Badge>
        </div>
        <strong>{summary.open}</strong>
      </article>
      <article className="summary-card">
        <div className="summary-card__meta">
          <span>Completed</span>
          <Badge tone="success">Delivered</Badge>
        </div>
        <strong>{summary.completed}</strong>
      </article>
    </section>
  )
}
