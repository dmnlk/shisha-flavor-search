'use client'

import { useEffect, useState } from 'react'

interface ShareOnXProps {
  text: string
  hashtags?: string[]
  className?: string
}

export default function ShareOnX({ text, hashtags = [], className = '' }: ShareOnXProps) {
  const [intentUrl, setIntentUrl] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams({ text, url: window.location.href })
    if (hashtags.length > 0) params.set('hashtags', hashtags.join(','))
    setIntentUrl(`https://x.com/intent/post?${params.toString()}`)
  }, [text, hashtags])

  return (
    <a
      href={intentUrl ?? '#'}
      onClick={(e) => {
        if (!intentUrl) e.preventDefault()
      }}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="X (旧Twitter) にシェア"
      className={`inline-flex items-center gap-2 px-4 py-2 border border-ink-900 dark:border-ink-100 hover:bg-ember-500 hover:border-ember-500 hover:text-paper-0 dark:hover:text-paper-0 transition-colors font-mono-tight text-[10px] uppercase tracking-[0.18em] text-ink-900 dark:text-ink-100 ${className}`}
    >
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      <span>Share on X</span>
    </a>
  )
}
