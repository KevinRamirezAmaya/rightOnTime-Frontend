import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import AdminLoginPage from '../AdminLoginPage'
import * as auth from '../../../services/auth'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('AdminLoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <AdminLoginPage />
      </BrowserRouter>
    )
  }

  it('should render admin login form', () => {
    renderComponent()
    expect(screen.getByText('Acceso Administradores')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('usuario')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  it('should render login button', () => {
    renderComponent()
    const loginButton = screen.getByRole('button', { name: /Iniciar sesión/i })
    expect(loginButton).toBeInTheDocument()
  })

  it('should update input values on change', () => {
    renderComponent()

    const usernameInput = screen.getByPlaceholderText('usuario') as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement

    fireEvent.change(usernameInput, { target: { value: 'admin' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    expect(usernameInput.value).toBe('admin')
    expect(passwordInput.value).toBe('password123')
  })

  it('should login successfully and navigate to dashboard', async () => {
    vi.spyOn(auth, 'login').mockResolvedValue({
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
    })

    renderComponent()

    const usernameInput = screen.getByPlaceholderText('usuario')
    const passwordInput = screen.getByPlaceholderText('••••••••')

    fireEvent.change(usernameInput, { target: { value: 'admin' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    const loginButton = screen.getByRole('button', { name: /Iniciar sesión/i })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(auth.login).toHaveBeenCalledWith('admin', 'password123')
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
    })
  })

  it('should show error message on login failure', async () => {
    vi.spyOn(auth, 'login').mockRejectedValue(new Error('Credenciales incorrectas'))

    renderComponent()

    const usernameInput = screen.getByPlaceholderText('usuario')
    const passwordInput = screen.getByPlaceholderText('••••••••')

    fireEvent.change(usernameInput, { target: { value: 'wronguser' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } })

    const loginButton = screen.getByRole('button', { name: /Iniciar sesión/i })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument()
    })
  })

  it('should disable button during login', async () => {
    vi.spyOn(auth, 'login').mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )

    renderComponent()

    const usernameInput = screen.getByPlaceholderText('usuario')
    const passwordInput = screen.getByPlaceholderText('••••••••')

    fireEvent.change(usernameInput, { target: { value: 'admin' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    fireEvent.click(usernameInput) // Trigger form to submit
    
    const form = screen.getByTestId('admin-login-form')
    fireEvent.submit(form)

    await waitFor(() => {
      const loginButton = screen.getByRole('button', { name: /Iniciando/i })
      expect(loginButton).toBeDisabled()
    })
  })
})
