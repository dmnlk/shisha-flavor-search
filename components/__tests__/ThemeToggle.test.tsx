import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ThemeProvider } from '../ThemeProvider'
import { ThemeToggle } from '../ThemeToggle'

describe('ThemeToggle', () => {
  it('renders the Day / Night buttons inside ThemeProvider', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )
    expect(screen.getByRole('button', { name: 'Light mode' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dark mode' })).toBeInTheDocument()
  })

  it('renders nothing without ThemeProvider (not-found rendered outside the root layout)', () => {
    const { container } = render(<ThemeToggle />)
    expect(container).toBeEmptyDOMElement()
  })
})
