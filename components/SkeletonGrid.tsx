import SkeletonCard from './SkeletonCard'

interface SkeletonGridProps {
  count?: number
}

export default function SkeletonGrid({ count = 12 }: SkeletonGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 -mx-px -my-px">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="m-[-0.5px]">
          <SkeletonCard />
        </div>
      ))}
    </div>
  )
}
