import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from '../../../context/AppContext'
import LoginPage from '../LoginPage'

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
})
