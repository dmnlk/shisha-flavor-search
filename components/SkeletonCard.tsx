export default function SkeletonCard() {
  return (
    <div className="border border-rule-200 dark:border-rule-800 bg-paper-0 dark:bg-paper-900">
      <div className="aspect-square relative overflow-hidden bg-paper-100 dark:bg-paper-800 border-b border-rule-200 dark:border-rule-800">
        <div className="absolute inset-0 -translate-x-full animate-sweep bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent" />
      </div>
      <div className="p-3 space-y-2">
        <div className="h-2.5 bg-paper-100 dark:bg-paper-800 w-16" />
        <div className="h-4 bg-paper-100 dark:bg-paper-800 w-3/4" />
        <div className="h-3 bg-ember-500/30 w-14 mt-3" />
      </div>
    </div>
  )
}
