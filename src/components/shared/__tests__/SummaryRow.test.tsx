import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SummaryRow } from '../SummaryRow'

describe('SummaryRow', () => {
  it('should render label and value', () => {
    render(<SummaryRow label="Total" value="42" />)
    
    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('should render with different values', () => {
    render(<SummaryRow label="Average" value="3.5 h" />)
    
    expect(screen.getByText('Average')).toBeInTheDocument()
    expect(screen.getByText('3.5 h')).toBeInTheDocument()
  })

  it('should apply correct CSS classes', () => {
    const { container } = render(<SummaryRow label="Test" value="Value" />)
    
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('flex', 'items-center', 'justify-between')
  })
})
