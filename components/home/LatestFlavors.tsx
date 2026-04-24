import ShishaCard from '../ShishaCard'
import type { ShishaFlavor } from '../../types/shisha'

import SectionHeader from './SectionHeader'

interface LatestFlavorsProps {
  flavors: ShishaFlavor[]
}

export default function LatestFlavors({ flavors }: LatestFlavorsProps) {
  if (flavors.length === 0) return null

  return (
    <section className="mt-16">
      <SectionHeader
        section="§ 003"
        title="Latest Additions"
        subtitle={`most recently indexed, ${flavors.length} imaged entries`}
      />
      <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {flavors.map((flavor, idx) => (
          <ShishaCard key={flavor.id} flavor={flavor} index={idx} />
        ))}
      </div>
    </section>
  )
}
