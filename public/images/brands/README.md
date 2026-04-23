# Brand Logos

Drop brand logo image files into this directory and they will be picked up
automatically by the `/brands` page the next time the server renders it.

## Naming convention

The filename (without extension) must match the slug derived from the brand
name. The slug is produced by `brandSlug()` in `data/brandImages.ts`:

1. Normalize the brand name via `normalizeBrandForSearch` (lowercase, canonical
   form — see `lib/utils/brandNormalizer.ts`).
2. Strip any character that is not a letter, digit, whitespace, or `-`.
3. Trim and collapse whitespace to a single `-`.

Examples:

| Brand name        | Expected filename stem |
| ----------------- | ---------------------- |
| Al Fakher         | `al-fakher`            |
| Starbuzz          | `starbuzz`             |
| Coco Nara         | `coco-nara`            |
| Khalil Maamoon Tobacco | `khalil-maamoon-tobacco` |
| Северный          | `северный`             |

Supported extensions: `.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`, `.avif`.

If no file matches a brand's slug, the brand card falls back to the
typographic gradient placeholder with the brand's initials. No remote hosts
are involved — everything is served from `/images/brands/`.
