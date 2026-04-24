// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import 'jest-fetch-mock'

const mockFetch = require('jest-fetch-mock')
global.fetch = mockFetch

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

beforeEach(() => {
  mockFetch.resetMocks()
})