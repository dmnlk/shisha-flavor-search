import { render, screen } from '@testing-library/react';
import ShishaCard from '../ShishaCard';

const mockFlavor = {
  id: 1,
  productName: 'Test Flavor',
  manufacturer: 'Test Brand',
  description: 'Test Description',
  price: '1,900円',
  imageUrl: '/test-image.jpg',
};

describe('ShishaCard', () => {
  it('renders shisha card with correct information', () => {
    render(<ShishaCard flavor={mockFlavor} />);

    expect(screen.getByText(mockFlavor.productName)).toBeInTheDocument();
    expect(screen.getByText(mockFlavor.manufacturer)).toBeInTheDocument();
    expect(screen.getByText(mockFlavor.price)).toBeInTheDocument();
    expect(screen.getByAltText(mockFlavor.productName)).toBeInTheDocument();
  });

  it('links to the correct flavor page', () => {
    render(<ShishaCard flavor={mockFlavor} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/flavor/${mockFlavor.id}`);
  });
});
