import { Navigate } from 'react-router-dom'

import { useAppContext } from '../context/AppContext'
import { homeRouteForRole } from '../helpers/attendance'

const HomeRedirect = () => {
  const { session } = useAppContext()

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={homeRouteForRole(session.role)} replace />
}

export default HomeRedirect
