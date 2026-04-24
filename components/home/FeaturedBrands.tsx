import Image from 'next/image'
import Link from 'next/link'

import type { FeaturedBrand } from '../../data/homeSections'

import SectionHeader from './SectionHeader'

interface FeaturedBrandsProps {
  brands: FeaturedBrand[]
}

export default function FeaturedBrands({ brands }: FeaturedBrandsProps) {
  if (brands.length === 0) return null

  return (
    <section className="mt-16">
      <SectionHeader
        section="§ 002"
        title="Featured Houses"
        subtitle="editor-verified brands with notes & logo"
        linkHref="/brands"
        linkLabel="all brands"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-b border-rule-200 dark:border-rule-800">
        {brands.map((brand, idx) => (
          <Link
            key={brand.slug}
            href={`/brands/${brand.slug}`}
            className={`group relative flex flex-col p-5 border-rule-200 dark:border-rule-800 transition-colors hover:bg-paper-50 dark:hover:bg-paper-900 ${
              idx % 4 !== 3 ? 'lg:border-r' : ''
            } ${idx % 2 !== 1 ? 'sm:border-r lg:border-r' : 'sm:border-r-0 lg:border-r'} ${
              idx < brands.length - 1 ? 'border-b sm:border-b' : ''
            } ${idx < brands.length - 2 ? 'sm:border-b' : 'sm:border-b-0'} ${
              idx < brands.length - 4 ? 'lg:border-b' : 'lg:border-b-0'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="relative h-12 w-20 shrink-0 bg-paper-50 dark:bg-paper-900 border border-rule-200 dark:border-rule-800">
                <Image
                  src={brand.imageUrl as string}
                  alt={`${brand.name} logo`}
                  fill
                  sizes="80px"
                  className="object-contain p-1.5"
                />
              </div>
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.1em] text-ember-500 nums shrink-0 pt-1">
                {String(brand.count).padStart(3, '0')}&nbsp;ENT.
              </span>
            </div>
            <h3 className="font-sans-tight font-semibold text-lg tracking-[-0.01em] text-ink-950 dark:text-ink-50 group-hover:text-ember-500 transition-colors mb-1.5">
              {brand.name}
            </h3>
            <p className="font-sans-tight text-sm leading-[1.45] text-ink-600 dark:text-ink-300 line-clamp-3">
              {brand.description}
            </p>
            <span className="font-mono-tight text-[10px] uppercase tracking-[0.14em] text-ink-400 dark:text-ink-500 group-hover:text-ember-500 transition-colors mt-4">
              view catalog →
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
