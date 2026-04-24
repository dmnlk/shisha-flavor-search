import Link from 'next/link'

interface SectionHeaderProps {
  section: string
  title: string
  subtitle?: string
  linkHref?: string
  linkLabel?: string
}

export default function SectionHeader({ section, title, subtitle, linkHref, linkLabel }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-4 border-t border-ink-900 dark:border-ink-100 border-b border-rule-200 dark:border-rule-800 py-3">
      <div className="min-w-0">
        <p className="font-mono-tight text-[10px] uppercase tracking-[0.2em] text-ember-500 mb-1 nums">
          {section}
        </p>
        <h2 className="font-sans-tight font-semibold text-xl sm:text-2xl tracking-[-0.02em] text-ink-950 dark:text-ink-50 truncate">
          {title}
        </h2>
        {subtitle && (
          <p className="font-mono-tight text-[10px] uppercase tracking-[0.14em] text-ink-500 dark:text-ink-400 mt-1 truncate">
            {subtitle}
          </p>
        )}
      </div>
      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="shrink-0 font-mono-tight text-[10px] uppercase tracking-[0.16em] text-ink-600 dark:text-ink-300 hover:text-ember-500 transition-colors whitespace-nowrap pb-1"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  )
}
