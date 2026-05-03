import dynamic from 'next/dynamic'

import {
  getEditorsPicks,
  getFeaturedBrands,
  getLatestFlavors,
  getOriginBuckets,
} from '../../data/homeSections'

import EditorsPicks from './EditorsPicks'
import FeaturedBrands from './FeaturedBrands'
import LatestFlavors from './LatestFlavors'

const OriginShelf = dynamic(() => import('./OriginShelf'), { ssr: false })

/**
 * Server component that assembles the curated editorial sections shown
 * on the home page between the hero and the search grid. All data is
 * pulled from shishaData at request time (cheap — pure in-memory) and
 * handed to child components as plain props.
 */
export default function HomeSections() {
  const featuredBrands = getFeaturedBrands(3)
  const latestFlavors = getLatestFlavors(6)
  const originBuckets = getOriginBuckets(6)
  const editorsPicks = getEditorsPicks()

  return (
    <>
      <FeaturedBrands brands={featuredBrands} />
      <LatestFlavors flavors={latestFlavors} />
      <OriginShelf buckets={originBuckets} />
      <EditorsPicks picks={editorsPicks} />
    </>
  )
}
