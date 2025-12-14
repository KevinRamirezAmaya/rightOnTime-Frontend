import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from '../../../context/AppContext'
import RegisterPage from '../RegisterPage'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <AppProvider>
          <RegisterPage />
        </AppProvider>
      </BrowserRouter>
    )
  }

  it('should render register form', () => {
    renderComponent()
    expect(screen.getAllByText(/cuenta/i).length).toBeGreaterThan(0)
  })

  it('should render form fields', () => {
    renderComponent()
    const inputs = screen.getAllByRole('textbox')
    expect(inputs.length).toBeGreaterThan(0)
  })

  it('should render submit button', () => {
    renderComponent()
    const submitButton = screen.getByRole('button', { name: /Completar registro/i })
    expect(submitButton).toBeInTheDocument()
  })
})
