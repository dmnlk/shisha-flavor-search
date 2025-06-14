import { render, screen } from '@testing-library/react'

import type { ShishaFlavor } from '../../types/shisha'
import ShishaCard from '../ShishaCard'

const mockFlavor: ShishaFlavor = {
  id: 1,
  productName: 'Test Flavor',
  manufacturer: 'Test Brand',
  amount: '50g',
  country: 'Test Country',
  price: '1,900円',
  imageUrl: '/test-image.jpg',
  description: 'Test Description',
}

describe('ShishaCard', () => {
  it('renders shisha card with correct information', () => {
    render(<ShishaCard flavor={mockFlavor} />)

    expect(screen.getByText(mockFlavor.productName)).toBeInTheDocument()
    expect(screen.getByText(mockFlavor.manufacturer)).toBeInTheDocument()
    expect(screen.getByText(mockFlavor.price)).toBeInTheDocument()
    expect(screen.getByAltText(mockFlavor.productName)).toBeInTheDocument()
  })

  it('links to the correct flavor page', () => {
    render(<ShishaCard flavor={mockFlavor} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', `/flavor/${mockFlavor.id}`)
  })
})