import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Router from './App'

function renderAt(path: string) {
  window.history.pushState({}, '', path)
  return render(<Router />)
}

describe('Router', () => {
  it('renders the home page at /', () => {
    renderAt('/')
    expect(screen.getByText('SENIOR DEVOPS / PLATFORM ENGINEER')).toBeInTheDocument()
  })

  it('renders the Karpenter case study', () => {
    renderAt('/work/karpenter')
    expect(screen.getByRole('heading', { name: 'Dynamic Kubernetes Capacity' })).toBeInTheDocument()
  })

  it('renders the GitOps case study', () => {
    renderAt('/work/gitops')
    expect(screen.getByRole('heading', { name: 'GitOps at Scale' })).toBeInTheDocument()
  })

  it('renders the cost optimization case study', () => {
    renderAt('/work/cost-optimization')
    expect(screen.getByRole('heading', { name: 'AWS Cost Optimization' })).toBeInTheDocument()
  })

  it('renders the retired resume notice', () => {
    renderAt('/resume')
    expect(screen.getByRole('heading', { name: /resume has been retired/i })).toBeInTheDocument()
  })

  it('renders a 404 page for unknown paths', () => {
    renderAt('/this-page-does-not-exist')
    expect(screen.getByText('Page not found.')).toBeInTheDocument()
  })
})
