import { Navigate, Outlet } from 'react-router-dom'

import { useAppContext } from '../../context/AppContext'
import { homeRouteForRole } from '../../helpers/attendance'

const PublicOnlyRoute = () => {
  const { session } = useAppContext()

  if (!session) {
    return <Outlet />
  }

  return <Navigate to={homeRouteForRole(session.role)} replace />
}

export default PublicOnlyRoute
