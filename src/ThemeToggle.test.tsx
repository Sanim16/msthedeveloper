import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { ThemeToggle } from './App'

function mockPrefersLight(prefersLight: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: query.includes('light') ? prefersLight : !prefersLight,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  mockPrefersLight(false)
})

describe('ThemeToggle', () => {
  it('defaults to the OS-preferred theme when nothing is saved', () => {
    mockPrefersLight(true)

    render(<ThemeToggle />)

    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('respects a previously saved theme over the OS preference', () => {
    localStorage.setItem('theme', 'dark')
    mockPrefersLight(true)

    render(<ThemeToggle />)

    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('toggles the theme and persists the choice to localStorage', () => {
    mockPrefersLight(false)
    render(<ThemeToggle />)
    expect(document.documentElement.dataset.theme).toBe('dark')

    fireEvent.click(screen.getByRole('button'))

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
  })
})
