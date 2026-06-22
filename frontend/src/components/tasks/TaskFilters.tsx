import type { TaskFilterStatus } from '../../types/task'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

type TaskFiltersProps = {
  activeStatus: TaskFilterStatus
  search: string
  onSearchChange: (value: string) => void
  onStatusChange: (status: TaskFilterStatus) => void
}

const statuses: TaskFilterStatus[] = ['all', 'open', 'completed']

export function TaskFilters({
  activeStatus,
  search,
  onSearchChange,
  onStatusChange,
}: TaskFiltersProps) {
  return (
    <section className="toolbar card">
      <div className="toolbar__search">
        <Input
          label="Search"
          placeholder="Search tasks by title"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <div className="toolbar__filters">
        {statuses.map((status) => (
          <Button
            key={status}
            type="button"
            variant={activeStatus === status ? 'primary' : 'secondary'}
            onClick={() => onStatusChange(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>
    </section>
  )
}
