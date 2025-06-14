export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[4/5] bg-gray-200 dark:bg-gray-700" />
      
      {/* Content skeleton */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          {/* Manufacturer badge skeleton */}
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
          
          {/* Star icon skeleton */}
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        
        {/* Product name skeleton */}
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-1/2" />
        
        <div className="flex items-center justify-between">
          {/* Country skeleton */}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          
          {/* Price skeleton */}
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        </div>
      </div>
    </div>
  )
}