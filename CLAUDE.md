# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CRITICAL: Pre-Commit Requirements

**ALWAYS run these commands locally before committing code. This is MANDATORY to prevent CI failures:**

```bash
# 1. Run linting (REQUIRED)
pnpm lint

# 2. Run tests (REQUIRED)
pnpm test

# 3. Run TypeScript type checking (REQUIRED)
npx tsc --noEmit

# 4. Only commit if ALL checks pass
git add .
git commit -m "Your commit message"
git push
```

## Project Overview

This is a Next.js (App Router) application for searching and browsing shisha (hookah) flavors. Fully TypeScript with paginated search, manufacturer filtering, flavor detail pages, and dark mode.

## Common Development Commands

```bash
# Development
pnpm dev           # Start development server on http://localhost:3000

# Build & Production
pnpm build         # Create production build
pnpm start         # Start production server

# Testing
pnpm test          # Run all tests
pnpm test:watch    # Run tests in watch mode
pnpm test:ci       # Run tests with coverage for CI
pnpm test -- __tests__/foo.test.ts  # Run a single test file

# Code Quality
pnpm lint          # Run ESLint
npx tsc --noEmit   # Run TypeScript type checking
```

## Architecture & Key Components

### Data Layer
- **shishaData.js**: Contains the complete flavor database (2.5MB+ file with thousands of products)
- **shishaMethods.ts**: Utility functions for searching and filtering the data (TypeScript)
- **shishaService.ts**: Contains mock data used by tests (not the real service layer)
- **types/shisha.ts**: TypeScript interface definitions for ShishaFlavor and API responses
- **lib/utils/brandNormalizer.ts**: Normalizes manufacturer names for case-insensitive search/dedup

### API Routes (App Router)
- `/api/search/route.ts`: Main search endpoint with pagination and filtering (TypeScript)
- `/api/manufacturers/route.ts`: Returns list of unique manufacturers (TypeScript)
- `/api/flavor/[id]/route.ts`: Returns individual flavor details (TypeScript)

### Frontend Architecture
- **Client-side state management**: Uses React hooks with TypeScript for type-safe state management
- **Animation**: Framer Motion for page transitions and loading states
- **Styling**: Tailwind CSS v4 with dark mode support and PostCSS configuration
- **Component structure** (all TypeScript):
  - `SearchBar.tsx`: Search input and controls
  - `BrandList.tsx`: Manufacturer filter pills
  - `ShishaCard.tsx`: Individual flavor card display
  - `ClientHome.tsx`: Main client-side component

### Design System
- **Color palette** defined in `app/globals.css` via `@theme`: `primary-*` (gold), `accent-*` (copper), `lounge-*` (warm neutrals)
- **Fonts**: Cormorant Garamond (`--font-display`) for headings, Plus Jakarta Sans (`--font-body`) for body text, loaded in `app/layout.tsx`
- **Dark mode**: Uses Tailwind v4 `@custom-variant dark` in globals.css + `document.documentElement.classList` toggle via ThemeProvider

### Configuration Notes
- **Path alias**: `@/*` maps to project root (e.g., `import { ShishaFlavor } from '@/types/shisha'`)
- **ESLint**: Flat config format (`eslint.config.mjs`), `data/shishaData.js` is ignored
- **Trailing commas**: Required in arrays/objects/imports/exports, forbidden in function params

### Key Implementation Details

1. **Search Logic**: The search functionality filters by matching query terms against manufacturer name, product name, and description. Multiple search terms must all match (AND logic).

2. **Pagination**: Server-side pagination with 12 items per page. The API ensures valid page numbers and handles edge cases.

3. **Manufacturer Filtering**: Can be combined with search queries. Empty string means "All Brands".

4. **Testing**: Jest with React Testing Library configured for TypeScript and Next.js. Tests are located in `__tests__` folders within component directories with `.test.ts/.tsx` extensions.

5. **Image Handling**: Configured to load images from external domains (Unsplash, shisha-mart.com, blogger.googleusercontent.com).

6. **TypeScript Configuration**: Strict type checking enabled with proper interfaces for all data structures. Next.js requires awaiting params in dynamic API routes.

7. **Node.js Version**: Project uses Node.js 22.12.0 LTS as specified in `.node-version` file.

8. **CSS Framework**: Tailwind CSS v4 with PostCSS configuration in JavaScript format for compatibility.
