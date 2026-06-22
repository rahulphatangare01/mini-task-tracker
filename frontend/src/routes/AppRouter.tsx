import { Navigate, Route, Routes } from 'react-router-dom'
import { TasksPage } from '../pages/TasksPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/tasks" replace />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/tasks/:taskId" element={<TasksPage />} />
    </Routes>
  )
}
