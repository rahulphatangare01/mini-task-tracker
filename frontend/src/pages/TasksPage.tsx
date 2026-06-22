import { startTransition, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  completeTask,
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  getTaskSummary,
  updateTask,
} from '../service/task.service'
import { AppShell } from '../components/layout/AppShell'
import { DeleteTaskDialog } from '../components/tasks/DeleteTaskDialog'
import { TaskDetailPanel } from '../components/tasks/TaskDetailPanel'
import { TaskFilters } from '../components/tasks/TaskFilters'
import { TaskFormDialog } from '../components/tasks/TaskFormDialog'
import { TaskSummaryCards } from '../components/tasks/TaskSummaryCards'
import { TaskTable } from '../components/tasks/TaskTable'
import { useToast } from '../components/ui/ToastProvider'
import type { TaskFormValues } from '../schemas/task'
import type { Task, TaskFilterStatus, TaskSummary } from '../types/task'
import { Button } from '../components/ui/Button'

const initialSummary: TaskSummary = {
  all: 0,
  open: 0,
  completed: 0,
}

export function TasksPage() {
  const navigate = useNavigate()
  const { taskId } = useParams<{ taskId?: string }>()
  const { pushToast } = useToast()

  const [tasks, setTasks] = useState<Task[]>([])
  const [summary, setSummary] = useState<TaskSummary>(initialSummary)
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [status, setStatus] = useState<TaskFilterStatus>('all')
  const [searchInput, setSearchInput] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [pendingAction, setPendingAction] = useState(false)
  const [pageError, setPageError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')

  const showDetailPanel = detailLoading || Boolean(selectedTask)
  const hasLoadedRef = useRef(false)
  const requestIdRef = useRef(0)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim())
    }, 250)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [searchInput])

  const refreshBoard = async () => {
    const requestId = ++requestIdRef.current

    if (hasLoadedRef.current) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    setPageError('')

    try {
      const [taskData, summaryData] = await Promise.all([
        getTasks({
          status,
          search,
        }),
        getTaskSummary(),
      ])

      if (requestId !== requestIdRef.current) {
        return
      }

      setTasks(taskData.items)
      setSummary(summaryData)
      hasLoadedRef.current = true
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return
      }

      setPageError(error instanceof Error ? error.message : 'Unable to load tasks')
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false)
        setRefreshing(false)
      }
    }
  }

  useEffect(() => {
    void refreshBoard()
  }, [status, search])

  useEffect(() => {
    if (!taskId) {
      setSelectedTask(null)
      return
    }

    setDetailLoading(true)

    void getTaskById(taskId)
      .then((task) => {
        setSelectedTask(task)
      })
      .catch(() => {
        setSelectedTask(null)
      })
      .finally(() => {
        setDetailLoading(false)
      })
  }, [taskId])

  const openCreateDialog = () => {
    setFormMode('create')
    setActiveTask(null)
    setFormOpen(true)
  }

  const openEditDialog = (task: Task) => {
    setFormMode('edit')
    setActiveTask(task)
    setFormOpen(true)
  }

  const openDeleteDialog = (task: Task) => {
    setActiveTask(task)
    setDeleteOpen(true)
  }

  const handleCreateOrUpdate = async (values: TaskFormValues) => {
    setPendingAction(true)

    try {
      if (formMode === 'create') {
        const created = await createTask(values)
        pushToast('Task created successfully')
        startTransition(() => {
          navigate(`/tasks/${created.id}`)
        })
      } else if (activeTask) {
        const updated = await updateTask(activeTask.id, values)
        pushToast('Task updated successfully')
        startTransition(() => {
          navigate(`/tasks/${updated.id}`)
        })
      }

      setFormOpen(false)
      await refreshBoard()
    } catch (error) {
      pushToast(
        error instanceof Error ? error.message : 'Unable to save task',
        'error',
      )
      throw error
    } finally {
      setPendingAction(false)
    }
  }

  const handleDelete = async () => {
    if (!activeTask) {
      return
    }

    setPendingAction(true)

    try {
      await deleteTask(activeTask.id)
      pushToast('Task deleted successfully')
      setDeleteOpen(false)
      setActiveTask(null)

      if (taskId === activeTask.id) {
        startTransition(() => {
          navigate('/tasks')
        })
      }

      await refreshBoard()
    } catch (error) {
      pushToast(
        error instanceof Error ? error.message : 'Unable to delete task',
        'error',
      )
    } finally {
      setPendingAction(false)
    }
  }

  const handleComplete = async (task: Task) => {
    setPendingAction(true)

    try {
      const updated = await completeTask(task.id)
      pushToast('Task marked as completed')

      if (taskId === task.id) {
        setSelectedTask(updated)
      }

      await refreshBoard()
    } catch (error) {
      pushToast(
        error instanceof Error ? error.message : 'Unable to complete task',
        'error',
      )
    } finally {
      setPendingAction(false)
    }
  }

  return (
    <AppShell>
      <section className="page-head">
        <div>
          <p className="shell__eyebrow">Operations board</p>
          <h2>Tasks</h2>
          <p>Search, edit, complete, and review due dates from one workspace.</p>
        </div>
        <div className="page-head__actions">
          <Button type="button" onClick={openCreateDialog}>
            + New Task
          </Button>
        </div>
      </section>

      {pageError ? <div className="banner banner--error">{pageError}</div> : null}

      <TaskSummaryCards summary={summary} />

      <TaskFilters
        activeStatus={status}
        search={searchInput}
        onSearchChange={setSearchInput}
        onStatusChange={setStatus}
      />

      <div
        className={`content-grid ${showDetailPanel ? '' : 'content-grid--full'}`.trim()}
      >
        <TaskTable
          items={tasks}
          loading={loading}
          refreshing={refreshing}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          onComplete={handleComplete}
        />
        {showDetailPanel ? (
          <TaskDetailPanel
            task={selectedTask}
            loading={detailLoading}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
            onComplete={handleComplete}
          />
        ) : null}
      </div>

      <TaskFormDialog
        open={formOpen}
        mode={formMode}
        task={activeTask}
        pending={pendingAction}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreateOrUpdate}
      />

      <DeleteTaskDialog
        open={deleteOpen}
        task={activeTask}
        pending={pendingAction}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </AppShell>
  )
}
