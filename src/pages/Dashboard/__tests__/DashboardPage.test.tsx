import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import DashboardPage from '../DashboardPage'
import * as attendanceService from '../../../services/attendance'
import * as auth from '../../../services/auth'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(auth, 'logout').mockImplementation(() => {})
  })

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    )
  }



  it('should show loading state', () => {
    vi.spyOn(attendanceService, 'getAllAttendanceRecords').mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )
    renderComponent()
    expect(screen.getByText(/Cargando/i)).toBeInTheDocument()
  })

  it('should show error message on fetch failure', async () => {
    vi.spyOn(attendanceService, 'getAllAttendanceRecords').mockRejectedValue(
      new Error('Sesión expirada')
    )
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText(/Sesión expirada/i)).toBeInTheDocument()
    })
  })

  it('should render dashboard components', async () => {
    vi.spyOn(attendanceService, 'getAllAttendanceRecords').mockResolvedValue([])
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText(/Dashboard de asistencia/i)).toBeInTheDocument()
      expect(screen.getByText(/Crear Empleado/i)).toBeInTheDocument()
    })
  })
})
