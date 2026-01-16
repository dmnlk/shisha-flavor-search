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

**Why this is critical:**
- CI will fail if any of these checks fail
- Failing CI blocks PR merges and wastes time
- Local testing catches issues immediately
- Prevents broken code from reaching the repository

**Workflow:**
1. Make code changes
2. Run all three checks above
3. Fix any errors reported
4. Re-run checks until all pass
5. Only then commit and push

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

8. **CSS Framework**: Tailwind CSS v4 with PostCSS configuration in JavaScript format for compatibility.

## Tailwind CSS v4 Dark Mode Implementation Notes

**Important**: Tailwind CSS v4 has significantly different dark mode implementation compared to v3:

### Required Changes for Dark Mode:
1. **CSS Configuration** (`app/globals.css`):
   ```css
   @import "tailwindcss";
   @custom-variant dark (&:where(.dark, .dark *));
   ```

2. **Tailwind Config** (`tailwind.config.ts`):
   - Remove `darkMode` property completely (not needed in v4)
   - Simplify to minimal content configuration

3. **Theme Provider Implementation**:
   - Use simple boolean state (`darkMode`) instead of string-based themes
   - Direct DOM manipulation: `document.documentElement.classList.add/remove("dark")`
   - No complex theme system needed

### Key Differences from v3:
- `@custom-variant dark` is required in CSS
- No `darkMode: 'class'` in config file
- Simpler implementation without system theme detection
- Direct classList manipulation works better than complex state management

### References:
- https://dev.to/khanrabiul/tailwind-css-v4-dark-mode-3kbl
- https://www.sujalvanjare.com/blog/dark-mode-nextjs15-tailwind-v4