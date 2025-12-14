import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from '../../../context/AppContext'
import LoginPage from '../LoginPage'

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
})
