import { Navigate, Outlet } from 'react-router-dom'

import { useAppContext } from '../../context/AppContext'

const AdminRoute = () => {
  const { session } = useAppContext()

  if (session?.role === 'admin') {
    return <Outlet />
  }

  return <Navigate to="/login" replace />
}

export default AdminRoute
