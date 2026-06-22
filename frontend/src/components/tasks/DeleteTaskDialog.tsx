import type { Task } from '../../types/task'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

type DeleteTaskDialogProps = {
  open: boolean
  task?: Task | null
  pending?: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export function DeleteTaskDialog({
  open,
  task,
  pending = false,
  onClose,
  onConfirm,
}: DeleteTaskDialogProps) {
  return (
    <Modal
      open={open}
      title="Delete task"
      description="The task will be soft deleted and removed from active views."
      onClose={onClose}
      disableClose={pending}
    >
      <div className="confirm-delete">
        <p>
          Are you sure you want to delete <strong>{task?.title ?? 'this task'}</strong>?
        </p>
        <div className="modal__actions">
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={pending}
            onClick={() => void onConfirm()}
          >
            {pending ? 'Deleting...' : 'Delete task'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
