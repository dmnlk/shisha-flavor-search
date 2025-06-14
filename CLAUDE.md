# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.3.3 application for searching and browsing shisha (hookah) flavors. The app is fully migrated to TypeScript 5.8.3 and features a paginated search interface with manufacturer filtering, individual flavor detail pages, and dark mode support.

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

# Code Quality
pnpm lint          # Run ESLint
npx tsc --noEmit   # Run TypeScript type checking
```

## Architecture & Key Components

### Data Layer
- **shishaData.js**: Contains the complete flavor database (2.5MB+ file with thousands of products)
- **shishaMethods.ts**: Utility functions for searching and filtering the data (TypeScript)
- **shishaService.ts**: Service layer for data operations with proper typing (TypeScript)
- **types/shisha.ts**: TypeScript interface definitions for ShishaFlavor and API responses

### API Routes (App Router)
- `/api/search/route.ts`: Main search endpoint with pagination and filtering (TypeScript)
- `/api/manufacturers/route.ts`: Returns list of unique manufacturers (TypeScript)
- `/api/flavor/[id]/route.ts`: Returns individual flavor details (TypeScript)

### Frontend Architecture
- **Client-side state management**: Uses React hooks with TypeScript for type-safe state management
- **Animation**: Framer Motion for page transitions and loading states
- **Styling**: Tailwind CSS v4.1.10 with dark mode support and PostCSS configuration
- **Component structure** (all TypeScript):
  - `SearchBar.tsx`: Search input and controls
  - `BrandList.tsx`: Manufacturer filter pills
  - `ShishaCard.tsx`: Individual flavor card display
  - `ClientHome.tsx`: Main client-side component

### Key Implementation Details

1. **Search Logic**: The search functionality filters by matching query terms against manufacturer name, product name, and description. Multiple search terms must all match (AND logic).

2. **Pagination**: Server-side pagination with 12 items per page. The API ensures valid page numbers and handles edge cases.

3. **Manufacturer Filtering**: Can be combined with search queries. Empty string means "All Brands".

4. **Testing**: Jest with React Testing Library configured for TypeScript and Next.js. Tests are located in `__tests__` folders within component directories with `.test.ts/.tsx` extensions.

5. **Image Handling**: Configured to load images from external domains (Unsplash, shisha-mart.com, blogger.googleusercontent.com).

6. **TypeScript Configuration**: Strict type checking enabled with proper interfaces for all data structures. Next.js 15 requires awaiting params in dynamic API routes.

7. **Node.js Version**: Project uses Node.js 22.12.0 LTS as specified in `.node-version` file.

8. **CSS Framework**: Tailwind CSS v4 with PostCSS configuration in JavaScript format for compatibility. Dark mode implemented with forced slate-800 background colors.