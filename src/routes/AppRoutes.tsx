import { Navigate, Route, Routes } from 'react-router-dom'

import DashboardPage from '../pages/Dashboard/DashboardPage.tsx'
import LoginPage from '../pages/Login/LoginPage.tsx'
import AdminLoginPage from '../pages/Login/AdminLoginPage.tsx'
import RegisterPage from '../pages/Register/RegisterPage.tsx'
import HomeRedirect from './HomeRedirect'
import AdminRoute from './guards/AdminRoute'
import PublicOnlyRoute from './guards/PublicOnlyRoute'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<AdminRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
