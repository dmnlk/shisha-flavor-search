import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import HeaderSearchTrigger from '../HeaderSearchTrigger'
import { SearchCommandProvider } from '../SearchCommandContext'

describe('HeaderSearchTrigger', () => {
  it('opens the search palette inside SearchCommandProvider', () => {
    render(
      <SearchCommandProvider>
        <HeaderSearchTrigger />
      </SearchCommandProvider>
    )
    fireEvent.click(screen.getByRole('button', { name: '検索を開く' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders without SearchCommandProvider (not-found rendered outside the root layout)', () => {
    expect(() => render(<HeaderSearchTrigger />)).not.toThrow()
    expect(screen.getByRole('button', { name: '検索を開く' })).toBeInTheDocument()
  })
})
