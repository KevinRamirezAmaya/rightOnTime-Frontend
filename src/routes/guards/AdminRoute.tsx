import { Navigate, Outlet } from 'react-router-dom'

import { isAuthenticated } from '../../services/auth'

const AdminRoute = () => {
  if (isAuthenticated()) {
    return <Outlet />
  }

  return <Navigate to="/admin-login" replace />
}

export default AdminRoute
