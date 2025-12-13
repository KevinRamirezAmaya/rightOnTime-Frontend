import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App.tsx'

beforeEach(() => {
  window.history.pushState({}, 'RightOnTime test', '/')
})

describe('RightOnTime views', () => {
  it('renders the employee check-in view initially', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /bienvenido a rightontime/i }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/número de documento/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /marcar ingreso/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /marcar salida/i })).toBeInTheDocument()
  })

  it('allows navigating to the admin login view', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /ingreso administradores/i }))

    expect(screen.getByRole('heading', { name: /acceso administradores/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument()
  })

  it('shows error when trying to check-in without document', () => {
    render(<App />)

    const checkInButton = screen.getByRole('button', { name: /marcar ingreso/i })
    fireEvent.click(checkInButton)

    expect(screen.getByText(/por favor ingresa tu número de documento/i)).toBeInTheDocument()
  })
})
