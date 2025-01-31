const mockShishaData = [
  {
    id: '1',
    productName: 'Test Flavor 1',
    manufacturer: 'Test Brand 1',
    description: 'Test Description 1',
    price: 19.99,
    imageUrl: '/test-image-1.jpg',
  },
  {
    id: '2',
    productName: 'Test Flavor 2',
    manufacturer: 'Test Brand 2',
    description: 'Test Description 2',
    price: 24.99,
    imageUrl: '/test-image-2.jpg',
  },
];

class ShishaServiceError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ShishaServiceError';
  }
}

class ShishaService {
  getShishaById(id) {
    const flavor = mockShishaData.find((item) => item.id === id);
    if (!flavor) {
      throw new ShishaServiceError('Flavor not found');
    }
    return flavor;
  }

  searchShisha(query = '', manufacturer = '') {
    return mockShishaData.filter((item) => {
      const matchesQuery = !query || 
        item.productName.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesManufacturer = !manufacturer || 
        item.manufacturer === manufacturer;

      return matchesQuery && matchesManufacturer;
    });
  }

  getManufacturers() {
    return [...new Set(mockShishaData.map((item) => item.manufacturer))];
  }
}

export const shishaService = new ShishaService();
export { ShishaServiceError };
