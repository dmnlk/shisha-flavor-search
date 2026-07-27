// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

const fetchMocker = createFetchMock(vi)
fetchMocker.enableMocks()

// With `globals: false`, @testing-library/react's automatic cleanup (which
// hooks into a global afterEach) does not register, so unmount explicitly
// after each test to prevent rendered output leaking between tests.
afterEach(() => {
  cleanup()
})

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

beforeEach(() => {
  fetchMocker.resetMocks()
})
