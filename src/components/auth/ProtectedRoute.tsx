import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
