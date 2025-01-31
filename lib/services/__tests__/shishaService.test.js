import { shishaService, ShishaServiceError } from '../shishaService';

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

describe('shishaService', () => {
  describe('getShishaById', () => {
    it('returns the correct shisha flavor by id', () => {
      const result = shishaService.getShishaById('1');
      expect(result).toBeDefined();
      expect(result.id).toBe('1');
    });

    it('throws ShishaServiceError when flavor is not found', () => {
      expect(() => shishaService.getShishaById('999')).toThrow(ShishaServiceError);
    });
  });

  describe('searchShisha', () => {
    it('returns all shisha flavors when no query is provided', () => {
      const result = shishaService.searchShisha('');
      expect(result.length).toBeGreaterThan(0);
    });

    it('filters shisha flavors by search query', () => {
      const result = shishaService.searchShisha('Test Flavor 1');
      expect(result.length).toBe(1);
      expect(result[0].productName).toBe('Test Flavor 1');
    });

    it('filters shisha flavors by manufacturer', () => {
      const result = shishaService.searchShisha('', 'Test Brand 1');
      expect(result.length).toBe(1);
      expect(result[0].manufacturer).toBe('Test Brand 1');
    });

    it('returns empty array when no matches found', () => {
      const result = shishaService.searchShisha('nonexistent');
      expect(result).toEqual([]);
    });
  });

  describe('getManufacturers', () => {
    it('returns unique list of manufacturers', () => {
      const manufacturers = shishaService.getManufacturers();
      expect(manufacturers).toEqual(['Test Brand 1', 'Test Brand 2']);
    });
  });
});
