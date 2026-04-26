import { readFileSync } from 'node:fs'
import path from 'node:path'

import ClientHome from './ClientHome'
import HomeSections from '../components/home/HomeSections'

function getLastDataUpdated(): string | null {
  try {
    const statePath = path.join(process.cwd(), '.claude', 'shisha-update-state.json')
    const state = JSON.parse(readFileSync(statePath, 'utf-8'))
    const iso = state.last_data_updated as string | undefined
    if (!iso) return null
    const d = new Date(iso)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  } catch {
    return null
  }
}

export default function Home() {
  const lastDataUpdated = getLastDataUpdated()
  return (
    <ClientHome lastDataUpdated={lastDataUpdated}>
      <HomeSections />
    </ClientHome>
  )
}
