import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App.tsx'

beforeEach(() => {
  window.history.pushState({}, 'RightOnTime test', '/')
})

describe('RightOnTime views', () => {
  it('renders the login view initially', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /bienvenido a rightontime/i }),
    ).toBeInTheDocument()
  })

  it('allows navigating to the register view', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))

    expect(screen.getByRole('heading', { name: /crea tu cuenta/i })).toBeInTheDocument()
  })

  it('shows the admin dashboard after logging in as admin', () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'admin@empresa.com' },
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'segura' },
    })
    fireEvent.change(screen.getByLabelText(/rol/i), {
      target: { value: 'admin' },
    })

    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    expect(screen.getByText(/dashboard de asistencia/i)).toBeInTheDocument()
  })

  it('muestra el panel de empleado tras iniciar sesión como colaborador', () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'colaborador@empresa.com' },
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'segura' },
    })

    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    expect(screen.getByText(/panel de empleado/i)).toBeInTheDocument()
    expect(screen.getByText(/registrar horario/i)).toBeInTheDocument()
  })
})
