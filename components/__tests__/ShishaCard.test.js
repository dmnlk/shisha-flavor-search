import { render, screen } from '@testing-library/react';
import ShishaCard from '../ShishaCard';

const mockShisha = {
  id: '1',
  productName: 'Test Flavor',
  manufacturer: 'Test Brand',
  description: 'Test Description',
  price: 19.99,
  imageUrl: '/test-image.jpg',
};

describe('ShishaCard', () => {
  it('renders shisha card with correct information', () => {
    render(<ShishaCard shisha={mockShisha} />);

    expect(screen.getByText(mockShisha.productName)).toBeInTheDocument();
    expect(screen.getByText(mockShisha.manufacturer)).toBeInTheDocument();
    expect(screen.getByText(mockShisha.description)).toBeInTheDocument();
    expect(screen.getByText(`$${mockShisha.price.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByAltText(mockShisha.productName)).toBeInTheDocument();
  });

  it('links to the correct flavor page', () => {
    render(<ShishaCard shisha={mockShisha} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/flavor/${mockShisha.id}`);
  });
});
