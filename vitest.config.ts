import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Mirror the `@/*` -> project root alias from tsconfig.json
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  test: {
    // Explicitly off: test files import describe/it/expect from 'vitest'.
    // Stated intentionally rather than relying on Vitest's default.
    globals: false,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/__tests__/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/.next/**', '**/.claude/**'],
    coverage: {
      provider: 'v8',
      include: ['app/**/*.{js,jsx,ts,tsx}', 'components/**/*.{js,jsx,ts,tsx}', 'lib/**/*.{js,jsx,ts,tsx}'],
      exclude: ['**/*.d.ts', '**/node_modules/**'],
    },
  },
})
