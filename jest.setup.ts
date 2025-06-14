// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import 'jest-fetch-mock'

const mockFetch = require('jest-fetch-mock')
global.fetch = mockFetch

beforeEach(() => {
  mockFetch.resetMocks()
})