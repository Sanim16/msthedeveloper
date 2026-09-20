import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Home } from './App'

describe('Home', () => {
  it('renders the nav brand, hero eyebrow, and all three case studies', () => {
    render(<Home />)

    expect(screen.getByRole('link', { name: 'MOMOH SANI MUSA' })).toBeInTheDocument()
    expect(screen.getByText('SENIOR DEVOPS / PLATFORM ENGINEER')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Dynamic Kubernetes Capacity' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'GitOps at Scale' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AWS Cost Optimization' })).toBeInTheDocument()
  })
})
