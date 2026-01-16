export default function SkeletonCard() {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/50 animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[4/5] bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-shimmer" />
      </div>

      {/* Content skeleton */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          {/* Manufacturer badge skeleton */}
          <div className="h-7 bg-gradient-to-r from-primary-200 to-accent-200 dark:from-primary-800/50 dark:to-accent-800/50 rounded-full w-24" />
        </div>

        {/* Product name skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-full" />
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4" />
        </div>

        {/* Description skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
          {/* Price skeleton */}
          <div className="h-6 bg-gradient-to-r from-primary-200 to-accent-200 dark:from-primary-800/50 dark:to-accent-800/50 rounded-lg w-24" />

          {/* Arrow skeleton */}
          <div className="h-8 w-8 bg-primary-100 dark:bg-primary-900/30 rounded-full" />
        </div>
      </div>
    </div>
  )
}