import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import DashboardPage from '../DashboardPage'
import * as attendanceService from '../../../services/attendance'
import * as employeesService from '../../../services/employees'
import * as auth from '../../../services/auth'
import type { AttendanceRecordAPI } from '../../../types/app'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockRecords: AttendanceRecordAPI[] = [
  {
    id: 1,
    id_attendance: 'ATT001',
    date: '2025-01-15',
    check_in_time: '08:00:00',
    check_out_time: '17:00:00',
    status: 'completed',
    employee_id: 101,
    created_at: '2025-01-15T08:00:00Z',
    updated_at: '2025-01-15T17:00:00Z',
  },
  {
    id: 2,
    id_attendance: 'ATT002',
    date: '2025-01-15',
    check_in_time: '09:00:00',
    check_out_time: null,
    status: 'pending',
    employee_id: 102,
    created_at: '2025-01-15T09:00:00Z',
    updated_at: '2025-01-15T09:00:00Z',
  },
  {
    id: 3,
    id_attendance: 'ATT003',
    date: '2025-01-14',
    check_in_time: '08:30:00',
    check_out_time: '16:30:00',
    status: 'completed',
    employee_id: 101,
    created_at: '2025-01-14T08:30:00Z',
    updated_at: '2025-01-14T16:30:00Z',
  },
]

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

  it('should render dashboard components with records', async () => {
    vi.spyOn(attendanceService, 'getAllAttendanceRecords').mockResolvedValue(mockRecords)
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText(/Dashboard de asistencia/i)).toBeInTheDocument()
      expect(screen.getByText(/Crear Empleado/i)).toBeInTheDocument()
    })
  })

  it('should display statistics correctly', async () => {
    vi.spyOn(attendanceService, 'getAllAttendanceRecords').mockResolvedValue(mockRecords)
    renderComponent()

    await waitFor(() => {
      const articles = screen.getAllByRole('article')
      expect(articles.length).toBeGreaterThanOrEqual(4)
      expect(screen.getAllByText('08:30').length).toBeGreaterThan(0)
      expect(screen.getByText('16:45')).toBeInTheDocument()
      expect(screen.getByText('8h 30m')).toBeInTheDocument()
    })
  })

  it('should filter records by employee', async () => {
    vi.spyOn(attendanceService, 'getAllAttendanceRecords').mockResolvedValue(mockRecords)
    renderComponent()

    await waitFor(() => {
      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()
    })

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: '101' } })

    await waitFor(() => {
      expect(select).toHaveValue('101')
    })
  })

  it('should open create employee modal', async () => {
    vi.spyOn(attendanceService, 'getAllAttendanceRecords').mockResolvedValue([])
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText(/Crear Empleado/i)).toBeInTheDocument()
    })

    const createButton = screen.getByText(/Crear Empleado/i)
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(screen.getByText(/Crear nuevo empleado/i)).toBeInTheDocument()
    })
  })

  it('should create employee successfully', async () => {
    vi.spyOn(attendanceService, 'getAllAttendanceRecords').mockResolvedValue([])
    vi.spyOn(employeesService, 'createEmployee').mockResolvedValue({
      id_employee: 'EMP001',
      document_id: 12345,
      name: 'Juan',
      lastname: 'Pérez',
      email: 'juan@test.com',
      phone_number: 555123,
    })
    
    renderComponent()

    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      const createButton = buttons.find(btn => btn.textContent?.includes('Crear Empleado'))
      expect(createButton).toBeInTheDocument()
      if (createButton) fireEvent.click(createButton)
    })

    await waitFor(() => {
      expect(screen.getByLabelText(/ID Empleado/i)).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText(/ID Empleado/i), { target: { value: 'EMP001' } })
    fireEvent.change(screen.getByLabelText(/Número de Documento/i), { target: { value: '12345' } })
    fireEvent.change(screen.getByLabelText(/^Nombre$/i), { target: { value: 'Juan' } })
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: 'Pérez' } })
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'juan@test.com' } })
    fireEvent.change(screen.getByLabelText(/Número de Teléfono/i), { target: { value: '555123' } })

    const submitButtons = screen.getAllByRole('button')
    const submitButton = submitButtons.find(btn => btn.textContent === 'Crear Empleado' && btn.getAttribute('type') === 'submit')
    if (submitButton) fireEvent.click(submitButton)

    await waitFor(() => {
      expect(employeesService.createEmployee).toHaveBeenCalled()
    })
  })

  it('should handle create employee error', async () => {
    vi.spyOn(attendanceService, 'getAllAttendanceRecords').mockResolvedValue([])
    vi.spyOn(employeesService, 'createEmployee').mockRejectedValue(
      new Error('Email ya existe')
    )
    
    renderComponent()

    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      const createButton = buttons.find(btn => btn.textContent?.includes('Crear Empleado'))
      if (createButton) fireEvent.click(createButton)
    })

    await waitFor(() => {
      expect(screen.getByLabelText(/ID Empleado/i)).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText(/ID Empleado/i), { target: { value: 'EMP001' } })
    fireEvent.change(screen.getByLabelText(/Número de Documento/i), { target: { value: '12345' } })
    fireEvent.change(screen.getByLabelText(/^Nombre$/i), { target: { value: 'Juan' } })
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: 'Pérez' } })
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'juan@test.com' } })
    fireEvent.change(screen.getByLabelText(/Número de Teléfono/i), { target: { value: '555123' } })

    const submitButtons = screen.getAllByRole('button')
    const submitButton = submitButtons.find(btn => btn.textContent === 'Crear Empleado' && btn.getAttribute('type') === 'submit')
    if (submitButton) fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Email ya existe/i)).toBeInTheDocument()
    })
  })

  it('should close create employee modal', async () => {
    vi.spyOn(attendanceService, 'getAllAttendanceRecords').mockResolvedValue([])
    renderComponent()

    await waitFor(() => {
      const createButton = screen.getByText(/Crear Empleado/i)
      fireEvent.click(createButton)
    })

    await waitFor(() => {
      expect(screen.getByText(/Crear nuevo empleado/i)).toBeInTheDocument()
    })

    const cancelButton = screen.getByRole('button', { name: /Cancelar/i })
    fireEvent.click(cancelButton)

    await waitFor(() => {
      expect(screen.queryByText(/Crear nuevo empleado/i)).not.toBeInTheDocument()
    })
  })

  it('should handle logout', async () => {
    vi.spyOn(attendanceService, 'getAllAttendanceRecords').mockResolvedValue([])
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText(/Cerrar sesión/i)).toBeInTheDocument()
    })

    const logoutButton = screen.getByText(/Cerrar sesión/i)
    fireEvent.click(logoutButton)

    expect(auth.logout).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/admin-login', { replace: true })
  })

  it('should display records table', async () => {
    vi.spyOn(attendanceService, 'getAllAttendanceRecords').mockResolvedValue(mockRecords)
    renderComponent()

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByText('ATT001')).toBeInTheDocument()
      expect(screen.getByText('ATT002')).toBeInTheDocument()
      expect(screen.getByText('ATT003')).toBeInTheDocument()
    })
  })

  it('should format dates and times correctly', async () => {
    vi.spyOn(attendanceService, 'getAllAttendanceRecords').mockResolvedValue(mockRecords)
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('08:00')).toBeInTheDocument()
      expect(screen.getByText('17:00')).toBeInTheDocument()
    })
  })

  it('should handle session expired and redirect', async () => {
    vi.spyOn(attendanceService, 'getAllAttendanceRecords').mockRejectedValue(
      new Error('Token de sesión inválido')
    )
    
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText(/Token de sesión inválido/i)).toBeInTheDocument()
    }, { timeout: 3000 })

    await waitFor(() => {
      expect(auth.logout).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/admin-login', { replace: true })
    }, { timeout: 10000 })
  })
})
