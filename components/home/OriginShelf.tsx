'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

import ShishaCard from '../ShishaCard'
import type { OriginBucket } from '../../data/homeSections'

import SectionHeader from './SectionHeader'

interface OriginShelfProps {
  buckets: OriginBucket[]
}

export default function OriginShelf({ buckets }: OriginShelfProps) {
  const [activeCode, setActiveCode] = useState(buckets[0]?.code ?? '')
  const active = buckets.find(b => b.code === activeCode) ?? buckets[0]

  if (!active) return null

  return (
    <section className="mt-16">
      <SectionHeader
        section="§ 004"
        title="Origins"
        subtitle={`production country · top ${buckets.length} clusters`}
      />

      <div className="flex flex-wrap gap-0 border-b border-rule-200 dark:border-rule-800">
        {buckets.map((bucket) => {
          const isActive = bucket.code === active.code
          return (
            <button
              key={bucket.code}
              type="button"
              onClick={() => setActiveCode(bucket.code)}
              className={`flex items-center gap-2 px-4 py-3 font-mono-tight text-[11px] uppercase tracking-[0.14em] transition-colors border-r border-rule-200 dark:border-rule-800 ${
                isActive
                  ? 'bg-ink-900 text-paper-0 dark:bg-ink-100 dark:text-paper-950'
                  : 'text-ink-500 dark:text-ink-400 hover:text-ember-500'
              }`}
            >
              <span className="text-base leading-none" aria-hidden>{bucket.flag}</span>
              <span>{bucket.label}</span>
              <span className="nums opacity-70 text-[10px]">{bucket.total.toLocaleString()}</span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.code}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="pt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
        >
          {active.flavors.map((flavor, idx) => (
            <ShishaCard key={flavor.id} flavor={flavor} index={idx} />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
