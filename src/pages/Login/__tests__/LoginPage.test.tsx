import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from '../../../context/AppContext'
import LoginPage from '../LoginPage'
import * as attendanceService from '../../../services/attendance'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <AppProvider>
          <LoginPage />
        </AppProvider>
      </BrowserRouter>
    )
  }

  it('should render login page', () => {
    renderComponent()
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should render correctly', () => {
    renderComponent()
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(2) // At least check-in, check-out, and admin buttons
  })

  it('should navigate to admin page', () => {
    renderComponent()

    const adminButton = screen.getByRole('button', { name: /admin/i })
    fireEvent.click(adminButton)

    expect(mockNavigate).toHaveBeenCalledWith('/admin-login')
  })

  it('should show error when document is empty', async () => {
    renderComponent()

    const checkInButton = screen.getByRole('button', { name: /marcar ingreso/i })
    fireEvent.click(checkInButton)

    await waitFor(() => {
      expect(screen.getByText(/por favor ingresa tu número de documento/i)).toBeInTheDocument()
    })
  })

  it('should handle successful check-in', async () => {
    vi.spyOn(attendanceService, 'checkIn').mockResolvedValue({
      message: 'Ingreso registrado exitosamente',
      document_id: 123456,
      timestamp: '2025-01-01T08:00:00Z'
    })

    renderComponent()

    const input = screen.getByPlaceholderText(/documento/i)
    fireEvent.change(input, { target: { value: '123456' } })

    const checkInButton = screen.getByRole('button', { name: /marcar ingreso/i })
    fireEvent.click(checkInButton)

    await waitFor(() => {
      expect(attendanceService.checkIn).toHaveBeenCalledWith('123456')
    })
  })

  it('should handle check-in error', async () => {
    vi.spyOn(attendanceService, 'checkIn').mockRejectedValue(
      new Error('Ya tienes un ingreso activo')
    )

    renderComponent()

    const input = screen.getByPlaceholderText(/documento/i)
    fireEvent.change(input, { target: { value: '123456' } })

    const checkInButton = screen.getByRole('button', { name: /marcar ingreso/i })
    fireEvent.click(checkInButton)

    await waitFor(() => {
      expect(screen.getByText(/ya tienes un ingreso activo/i)).toBeInTheDocument()
    })
  })

  it('should handle successful check-out', async () => {
    vi.spyOn(attendanceService, 'checkOut').mockResolvedValue({
      message: 'Salida registrada exitosamente',
      document_id: 123456,
      timestamp: '2025-01-01T17:00:00Z'
    })

    renderComponent()

    const input = screen.getByPlaceholderText(/documento/i)
    fireEvent.change(input, { target: { value: '123456' } })

    const checkOutButton = screen.getByRole('button', { name: /marcar salida/i })
    fireEvent.click(checkOutButton)

    await waitFor(() => {
      expect(attendanceService.checkOut).toHaveBeenCalledWith('123456')
    })
  })
})
