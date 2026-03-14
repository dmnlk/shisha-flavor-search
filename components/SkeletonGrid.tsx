import SkeletonCard from './SkeletonCard'

interface SkeletonGridProps {
  count?: number
}

export default function SkeletonGrid({ count = 12 }: SkeletonGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  )
}
