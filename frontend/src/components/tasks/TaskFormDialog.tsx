import { useEffect, useMemo, useState } from 'react'
import { ZodError } from 'zod'
import { taskFormSchema, type TaskFormValues } from '../../schemas/task'
import type { Task } from '../../types/task'
import { formatDateTime } from '../../utils/formatters'
import { Button } from '../ui/Button'
import { DatePicker } from '../ui/DatePicker'
import { Dropdown } from '../ui/Dropdown'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { RichTextEditor } from '../ui/RichTextEditor'

type TaskFormDialogProps = {
  open: boolean
  mode: 'create' | 'edit'
  task?: Task | null
  pending?: boolean
  onClose: () => void
  onSubmit: (values: TaskFormValues) => Promise<void>
}

type FormErrors = Partial<Record<keyof TaskFormValues, string>>

const emptyForm: TaskFormValues = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: null,
}

const priorityOptions: Array<{
  label: string
  value: TaskFormValues['priority']
}> = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
]

export function TaskFormDialog({
  open,
  mode,
  task,
  pending = false,
  onClose,
  onSubmit,
}: TaskFormDialogProps) {
  const [values, setValues] = useState<TaskFormValues>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submissionError, setSubmissionError] = useState('')

  useEffect(() => {
    if (!open) {
      return
    }

    setErrors({})
    setSubmissionError('')
    setValues(
      task
        ? {
            title: task.title,
            description: task.description,
            priority: task.priority,
            dueDate: task.dueDate ? task.dueDate.slice(0, 10) : null,
          }
        : emptyForm,
    )
  }, [open, task])

  const dialogTitle =
    mode === 'create' ? 'Create new task' : `Edit task ${task?.title ?? ''}`
  const dialogDescription =
    mode === 'create'
      ? 'Capture task details to create a new record.'
      : 'Update title, description, priority, and due date.'

  const meta = useMemo(() => {
    if (!task || mode !== 'edit') {
      return null
    }

    return {
      createdAt: formatDateTime(task.createdAt),
      updatedAt: formatDateTime(task.updatedAt),
    }
  }, [mode, task])

  const handleChange = <K extends keyof TaskFormValues>(
    key: K,
    value: TaskFormValues[K],
  ) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmissionError('')

    try {
      const parsed = taskFormSchema.parse(values)
      setErrors({})
      await onSubmit(parsed)
    } catch (error) {
      if (error instanceof ZodError) {
        const { fieldErrors } = error.flatten() as {
          fieldErrors: Record<string, string[] | undefined>
        }
        setErrors({
          title: fieldErrors.title?.[0],
          description: fieldErrors.description?.[0],
          priority: fieldErrors.priority?.[0],
          dueDate: fieldErrors.dueDate?.[0],
        })
        return
      }

      setSubmissionError(
        error instanceof Error ? error.message : 'Unable to save task',
      )
    }
  }

  return (
    <Modal
      open={open}
      title={dialogTitle}
      description={dialogDescription}
      onClose={onClose}
      disableClose={pending}
    >
      <form className="task-form" onSubmit={handleSubmit}>
        <section className="task-form__section">
          <div className="task-form__section-head">
            <h3>Task profile</h3>
            <p>These details sync with the tracker before the task is saved.</p>
          </div>
          {submissionError ? (
            <div className="banner banner--error">{submissionError}</div>
          ) : null}
          <div className="task-form__grid">
            <Input
              label="Title *"
              placeholder="Enter task title"
              value={values.title}
              error={errors.title}
              onChange={(event) => handleChange('title', event.target.value)}
            />
            <Dropdown
              label="Priority *"
              value={values.priority}
              error={errors.priority}
              options={priorityOptions}
              onChange={(nextValue) => handleChange('priority', nextValue)}
            />
            <RichTextEditor
              label="Description"
              placeholder="Enter task description"
              value={values.description}
              error={errors.description}
              onChange={(nextValue) => handleChange('description', nextValue)}
            />
            <DatePicker
              label="Due date"
              value={values.dueDate}
              error={errors.dueDate}
              onChange={(nextValue) => handleChange('dueDate', nextValue)}
            />
          </div>
        </section>

        {meta ? (
          <section className="task-meta">
            <div>
              <span>Created at</span>
              <strong>{meta.createdAt}</strong>
            </div>
            <div>
              <span>Updated at</span>
              <strong>{meta.updatedAt}</strong>
            </div>
          </section>
        ) : null}

        <p className="task-form__footnote">
          {mode === 'create'
            ? 'New tasks appear immediately in the board and summary counts.'
            : 'Changes update the board immediately after save.'}
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
          <Button type="submit" disabled={pending}>
            {pending
              ? 'Saving...'
              : mode === 'create'
                ? 'Create task'
                : 'Save changes'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
