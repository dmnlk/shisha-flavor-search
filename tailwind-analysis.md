# Tailwind CSS Size Classes Analysis

## Summary of Most Common Size Classes in Shisha Search Project

### Font Sizes (text-*)
1. **text-sm** (9 occurrences) - Most common for secondary text
2. **text-base** (5 occurrences) - Default body text
3. **text-xs** (5 occurrences) - Small labels and hints
4. **text-3xl** (4 occurrences) - Large headings
5. **text-lg** (2 occurrences) - Subheadings
6. Also used: text-xl, text-2xl, text-4xl, text-5xl (1 each)

### Spacing - Padding (p-*)
1. **p-4** (15 occurrences) - Most common padding, equals 1rem
2. **p-2** (11 occurrences) - Small padding, equals 0.5rem
3. **p-3** (9 occurrences) - Medium padding, equals 0.75rem
4. **px-4, py-4** - Horizontal/vertical specific padding
5. **pl-14, pr-12** - Large left/right padding for input fields
6. Also used: p-1, p-1.5, p-6, p-8

### Spacing - Margin (m-*)
1. **mb-4** (9 occurrences) - Most common bottom margin
2. **mb-8** (4 occurrences) - Large bottom margin
3. **mx-auto** (4 occurrences) - Center alignment
4. **mt-4** (2 occurrences) - Top margin
5. **mb-6, mb-3, mb-2** - Various bottom margins
6. Also used: mt-8, mt-3, mr-2

### Dimensions - Width (w-*)
1. **w-full** (4 occurrences) - Full width containers
2. **w-5** (4 occurrences) - Icon sizes
3. **w-4** (3 occurrences) - Small icon sizes
4. **w-2** (3 occurrences) - Tiny elements
5. **w-12** (2 occurrences) - Medium fixed width
6. **w-6** (2 occurrences) - Standard icon size
7. Custom widths: w-[200px], w-[240px] for logo

### Dimensions - Height (h-*)
1. **h-screen** (6 occurrences) - Full viewport height
2. **h-5** (4 occurrences) - Icon heights
3. **h-4** (3 occurrences) - Small icon heights
4. **h-2** (3 occurrences) - Tiny elements
5. **h-12** (2 occurrences) - Medium fixed height
6. **h-6** (2 occurrences) - Standard icon height
7. Custom heights: h-[60px], h-[80px] for logo, h-[400px] for images

### Space Between Elements (space-*)
1. **space-y-2** (2 occurrences) - Vertical spacing between children
2. **space-x-1** (1 occurrence) - Horizontal spacing

## Key Observations

### Consistent Design System
- Small elements (icons): w-4/h-4, w-5/h-5, w-6/h-6
- Padding progression: p-1 → p-2 → p-3 → p-4
- Text size hierarchy: text-xs → text-sm → text-base → text-lg → text-xl → text-2xl → text-3xl → text-4xl → text-5xl

### Common Patterns
1. **Icons**: Consistently use w-4 h-4, w-5 h-5, or w-6 h-6
2. **Buttons**: Typically use px-3 py-2 or px-4 py-3
3. **Cards/Containers**: Use p-4 for standard padding
4. **Margins**: mb-4 for standard spacing, mb-8 for section spacing
5. **Full-width elements**: w-full is common for inputs and containers

### Responsive Patterns
- Mobile-first approach with sm:, md:, lg:, xl: breakpoints
- Example: `w-[200px] sm:w-[240px]` for logo sizing
- Grid columns: `grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`

### Custom Values
- Logo dimensions: w-[200px]/h-[60px] on mobile, w-[240px]/h-[80px] on desktop
- Image heights: h-[400px] for flavor detail images
- Aspect ratios: aspect-[4/5] for product cards

This analysis shows a well-structured design system with consistent spacing and sizing patterns throughout the application.