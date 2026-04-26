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
        subtitle={`most recently added · ${flavors.length} entries`}
      />
      <div className="pt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {flavors.map((flavor, idx) => (
          <ShishaCard key={flavor.id} flavor={flavor} index={idx} />
        ))}
      </div>
    </section>
  )
}
