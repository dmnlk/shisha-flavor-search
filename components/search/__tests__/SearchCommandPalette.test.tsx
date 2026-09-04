import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import type { ShishaFlavor } from '../../../types/shisha'
import HeaderSearchTrigger from '../HeaderSearchTrigger'
import { SearchCommandProvider } from '../SearchCommandContext'

const mintFlavor: ShishaFlavor = {
  id: 42,
  productName: 'Double Apple',
  manufacturer: 'Al Fakher',
  amount: '50g',
  country: 'アラブ首長国連邦',
  price: '1,900円',
  imageUrl: '',
}

function mockApis() {
  fetchMock.mockResponse(request => {
    if (request.url.includes('/api/brands')) {
      return JSON.stringify([
        { name: 'Al Fakher', count: 120, sampleFlavors: [] },
        { name: 'STARBUZZ', count: 80, sampleFlavors: [] },
      ])
    }
    if (request.url.includes('/api/search')) {
      return JSON.stringify({ items: [mintFlavor], totalPages: 1, currentPage: 1, totalItems: 1 })
    }
    return JSON.stringify({})
  })
}

function renderTrigger() {
  return render(
    <SearchCommandProvider>
      <HeaderSearchTrigger />
    </SearchCommandProvider>
  )
}

describe('SearchCommandPalette', () => {
  beforeEach(() => {
    mockApis()
  })

  it('opens from the header trigger', async () => {
    const user = userEvent.setup()
    renderTrigger()

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '検索を開く' }))

    expect(screen.getByRole('dialog', { name: 'フレーバー検索' })).toBeInTheDocument()
  })

  it('opens with Cmd+K and closes with Ctrl+K again', () => {
    renderTrigger()

    fireEvent.keyDown(window, { key: 'k', metaKey: true })
    expect(screen.getByRole('dialog', { name: 'フレーバー検索' })).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('lists flavor and brand matches for the typed query', async () => {
    const user = userEvent.setup()
    renderTrigger()

    fireEvent.keyDown(window, { key: 'k', metaKey: true })
    await user.type(screen.getByRole('combobox'), 'Al Fakher')

    const flavorOption = await screen.findByRole('option', { name: /Double Apple/ })
    expect(flavorOption).toHaveAttribute('href', '/flavor/42')

    const brandOption = await screen.findByRole('option', { name: /120 entries/ })
    expect(brandOption).toHaveAttribute('href', '/brands/al-fakher')

    expect(await screen.findByRole('option', { name: /すべて見る/ })).toBeInTheDocument()
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    renderTrigger()

    fireEvent.keyDown(window, { key: 'k', metaKey: true })
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})
