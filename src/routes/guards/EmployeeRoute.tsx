import { Navigate, Outlet } from 'react-router-dom'

import { useAppContext } from '../../context/AppContext'

const EmployeeRoute = () => {
  const { session } = useAppContext()

  if (session?.role === 'employee' && session.employee) {
    return <Outlet />
  }

  return <Navigate to="/login" replace />
}

export default EmployeeRoute
