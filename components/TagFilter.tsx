'use client'

import { FLAVOR_TAG_DEFS, type FlavorTagSlug } from '../data/flavorTagTaxonomy'

interface TagFilterProps {
  selectedTags: FlavorTagSlug[]
  onToggle: (_slug: FlavorTagSlug) => void
}

export default function TagFilter({ selectedTags, onToggle }: TagFilterProps) {
  const chipClass = (isActive: boolean) =>
    `font-mono-tight text-[10px] uppercase tracking-[0.12em] px-2.5 py-1.5 border transition-colors ${
      isActive
        ? 'bg-ink-900 text-paper-0 border-ink-900 dark:bg-ink-100 dark:text-paper-950 dark:border-ink-100'
        : 'border-rule-200 dark:border-rule-800 text-ink-600 dark:text-ink-300 hover:border-ember-500 hover:text-ember-500'
    }`

  return (
    <div className="mb-10">
      <div className="flex items-center gap-4 mb-3 font-mono-tight text-[10px] uppercase tracking-[0.16em] text-ink-500 dark:text-ink-400">
        <span className="text-ember-500">§</span>
        <span>Flavor Tags</span>
        <span className="flex-1 h-px bg-rule-200 dark:bg-rule-800" />
        {selectedTags.length > 0 && (
          <span className="text-ink-400 dark:text-ink-500 nums">
            {String(selectedTags.length).padStart(2, '0')}&nbsp;selected
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {FLAVOR_TAG_DEFS.map(({ slug, label }) => (
          <button
            type="button"
            key={slug}
            onClick={() => onToggle(slug)}
            aria-pressed={selectedTags.includes(slug)}
            className={chipClass(selectedTags.includes(slug))}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
