export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-lounge-900/80 rounded-xl overflow-hidden border border-lounge-200/60 dark:border-lounge-800/60 animate-pulse">
      <div className="aspect-[3/4] bg-lounge-100 dark:bg-lounge-800/60 relative">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      <div className="p-4">
        <div className="h-3 bg-lounge-200 dark:bg-lounge-700/50 rounded w-20 mb-3" />
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-lounge-200 dark:bg-lounge-700/50 rounded w-full" />
          <div className="h-4 bg-lounge-200 dark:bg-lounge-700/50 rounded w-2/3" />
        </div>
        <div className="h-4 bg-primary-100 dark:bg-primary-900/30 rounded w-16" />
      </div>
    </div>
  )
}
