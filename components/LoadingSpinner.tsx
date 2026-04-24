export default function LoadingSpinner() {
  return (
    <div
      className="font-mono-tight text-[10px] uppercase tracking-[0.18em] text-ink-500 dark:text-ink-300 flex items-center gap-2"
      role="status"
      aria-live="polite"
    >
      <span className="inline-block w-2 h-2 bg-ember-500 animate-caret" />
      Loading ledger
    </div>
  )
}
