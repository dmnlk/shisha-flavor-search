import { getCountryDisplay } from '../lib/utils/countryDisplay'

interface CountryFlagProps {
  country?: string | null
  className?: string
}

export default function CountryFlag({ country, className = '' }: CountryFlagProps) {
  const display = getCountryDisplay(country)
  if (!display) return null

  return (
    <span
      className={`relative inline-flex items-center group/flag ${className}`}
      title={display.label}
    >
      <span
        aria-hidden="true"
        className="text-[13px] leading-none font-sans-tight tracking-normal"
      >
        {display.flag || display.label.slice(0, 2)}
      </span>
      <span className="sr-only">{display.label}</span>
      <span
        role="tooltip"
        className="pointer-events-none absolute right-0 bottom-full mb-1 whitespace-nowrap border border-rule-300 dark:border-rule-700 bg-paper-0 dark:bg-paper-950 px-1.5 py-0.5 font-mono-tight text-[10px] normal-case tracking-[0.05em] text-ink-800 dark:text-ink-100 opacity-0 translate-y-0.5 group-hover/flag:opacity-100 group-hover/flag:translate-y-0 group-focus-within/flag:opacity-100 group-focus-within/flag:translate-y-0 transition-[opacity,transform] duration-150 z-10"
      >
        {display.label}
      </span>
    </span>
  )
}
