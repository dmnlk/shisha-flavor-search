# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 application for searching and browsing shisha (hookah) flavors. The app features a paginated search interface with manufacturer filtering, individual flavor detail pages, and dark mode support.

## Common Development Commands

```bash
# Development
npm run dev        # Start development server on http://localhost:3000

# Build & Production
npm run build      # Create production build
npm run start      # Start production server

# Testing
npm run test       # Run all tests
npm run test:watch # Run tests in watch mode
npm run test:ci    # Run tests with coverage for CI

# Code Quality
npm run lint       # Run ESLint
```

## Architecture & Key Components

### Data Layer
- **shishaData.js**: Contains the complete flavor database (2.5MB+ file with thousands of products)
- **shishaMethods.js**: Utility functions for searching and filtering the data
- **shishaService.js**: Service layer for data operations (currently using mock data for testing)

### API Routes (App Router)
- `/api/search`: Main search endpoint with pagination and filtering
- `/api/manufacturers`: Returns list of unique manufacturers
- `/api/flavor/[id]`: Returns individual flavor details

### Frontend Architecture
- **Client-side state management**: Uses React hooks for search state, pagination, and manufacturer filtering
- **Animation**: Framer Motion for page transitions and loading states
- **Styling**: Tailwind CSS with dark mode support (class-based)
- **Component structure**:
  - `SearchBar`: Search input and controls
  - `BrandList`: Manufacturer filter pills
  - `ShishaCard`: Individual flavor card display

### Key Implementation Details

1. **Search Logic**: The search functionality filters by matching query terms against manufacturer name, product name, and description. Multiple search terms must all match (AND logic).

2. **Pagination**: Server-side pagination with 12 items per page. The API ensures valid page numbers and handles edge cases.

3. **Manufacturer Filtering**: Can be combined with search queries. Empty string means "All Brands".

4. **Testing**: Jest with React Testing Library configured for Next.js. Tests are located in `__tests__` folders within component directories.

5. **Image Handling**: Configured to load images from external domains (Unsplash, shisha-mart.com, blogger.googleusercontent.com).