import ClientHome from './ClientHome'
import HomeSections from '../components/home/HomeSections'
import updateState from '../data/generated/updateState.json'
import { getManufacturers } from '../data/shishaMethods'
import { shishaData } from '../data/shishaData'

function getLastDataUpdated(): string | null {
  const iso = updateState.lastDataUpdated
  if (!iso) return null
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export default function Home() {
  const lastDataUpdated = getLastDataUpdated()
  const initialManufacturers = getManufacturers()
  const initialTotalItems = (shishaData as unknown[]).length
  return (
    <ClientHome
      lastDataUpdated={lastDataUpdated}
      initialManufacturers={initialManufacturers}
      initialTotalItems={initialTotalItems}
    >
      <HomeSections />
    </ClientHome>
  )
}
