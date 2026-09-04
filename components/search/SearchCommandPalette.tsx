'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Fragment, type KeyboardEvent as ReactKeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { BrandSummary } from '../../app/api/brands/route'
import { brandSlug } from '../../lib/utils/brandNormalizer'
import { normalizeForSearch } from '../../lib/utils/japaneseNormalizer'
import type { SearchResponse, ShishaFlavor } from '../../types/shisha'

import { useSearchCommand } from './SearchCommandContext'

const MAX_FLAVOR_RESULTS = 7
const MAX_BRAND_RESULTS = 3
/** クエリ未入力時に出すブランドのショートカット数 */
const MAX_BRAND_SUGGESTIONS = 6
const DEBOUNCE_MS = 200

type PaletteItem =
  | { key: string; kind: 'brand'; href: string; name: string; count: number }
  | { key: string; kind: 'flavor'; href: string; flavor: ShishaFlavor }
  | { key: string; kind: 'all'; href: string; label: string }

const sectionLabels: Record<PaletteItem['kind'], string | null> = {
  brand: 'Brands',
  flavor: 'Flavors',
  all: null,
}

export default function SearchCommandPalette() {
  const { isOpen, close, submitQuery } = useSearchCommand()
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [flavors, setFlavors] = useState<ShishaFlavor[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [brands, setBrands] = useState<BrandSummary[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const brandsRequested = useRef(false)
  const lastFocusedRef = useRef<HTMLElement | null>(null)

  const trimmedQuery = query.trim()

  // 開いた時に入力欄へフォーカスし、閉じたら元の要素へ戻す。背面のスクロールも止める。
  useEffect(() => {
    if (!isOpen) return

    lastFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    inputRef.current?.focus()

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
      lastFocusedRef.current?.focus()
    }
  }, [isOpen])

  // 閉じるたびに入力内容をリセットする (次に開いた時は素の状態から)
  useEffect(() => {
    if (isOpen) return
    setQuery('')
    setFlavors([])
    setTotalItems(0)
    setIsLoading(false)
    setActiveIndex(0)
  }, [isOpen])

  // ブランド一覧は初回オープン時に一度だけ取得してクライアント側で絞り込む
  useEffect(() => {
    if (!isOpen || brandsRequested.current) return
    brandsRequested.current = true

    const fetchBrands = async () => {
      try {
        const response = await fetch('/api/brands')
        if (!response.ok) throw new Error(`Failed to fetch brands: ${response.status}`)
        const data: BrandSummary[] = await response.json()
        setBrands(data)
      } catch (error) {
        console.error('Error fetching brands:', error)
        brandsRequested.current = false
      }
    }

    fetchBrands()
  }, [isOpen])

  // フレーバー検索はデバウンスしつつ、前回リクエストを中断する
  useEffect(() => {
    if (!isOpen) return

    if (!trimmedQuery) {
      setFlavors([])
      setTotalItems(0)
      setIsLoading(false)
      return
    }

    let cancelled = false
    const controller = new AbortController()
    setIsLoading(true)

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(trimmedQuery)}&page=1`,
          { signal: controller.signal }
        )
        if (!response.ok) throw new Error(`Search failed: ${response.status}`)
        const data: SearchResponse = await response.json()
        if (cancelled) return
        setFlavors(data.items.slice(0, MAX_FLAVOR_RESULTS))
        setTotalItems(data.totalItems ?? data.items.length)
      } catch (error) {
        if (cancelled || (error instanceof Error && error.name === 'AbortError')) return
        console.error('Search failed:', error)
        setFlavors([])
        setTotalItems(0)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
      controller.abort()
    }
  }, [isOpen, trimmedQuery])

  const matchedBrands = useMemo(() => {
    if (!trimmedQuery) {
      return [...brands].sort((a, b) => b.count - a.count).slice(0, MAX_BRAND_SUGGESTIONS)
    }
    const term = normalizeForSearch(trimmedQuery)
    return brands
      .filter(brand => normalizeForSearch(brand.name).includes(term))
      .sort((a, b) => b.count - a.count)
      .slice(0, MAX_BRAND_RESULTS)
  }, [brands, trimmedQuery])

  const items = useMemo<PaletteItem[]>(() => {
    const next: PaletteItem[] = matchedBrands.map(brand => ({
      key: `brand-${brand.name}`,
      kind: 'brand',
      href: `/brands/${brandSlug(brand.name)}`,
      name: brand.name,
      count: brand.count,
    }))

    for (const flavor of flavors) {
      next.push({
        key: `flavor-${flavor.id}`,
        kind: 'flavor',
        href: `/flavor/${flavor.id}`,
        flavor,
      })
    }

    if (trimmedQuery && totalItems > 0) {
      next.push({
        key: 'all-results',
        kind: 'all',
        href: `/?query=${encodeURIComponent(trimmedQuery)}`,
        label: `「${trimmedQuery}」の検索結果 ${totalItems.toLocaleString()} 件をすべて見る`,
      })
    }

    return next
  }, [matchedBrands, flavors, trimmedQuery, totalItems])

  // 候補が入れ替わったら先頭を選択し直す
  // biome-ignore lint/correctness/useExhaustiveDependencies: items の中身が変わった時だけ選択位置を初期化する
  useEffect(() => {
    setActiveIndex(0)
  }, [items])

  // キーボード操作でリスト外へ出た候補をスクロールで追う
  // biome-ignore lint/correctness/useExhaustiveDependencies: 選択位置が変わるたびに DOM を引き直す必要がある
  useEffect(() => {
    const active = listRef.current?.querySelector<HTMLElement>('[data-active="true"]')
    active?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  const runItem = useCallback(
    (item: PaletteItem) => {
      if (item.kind === 'all') {
        submitQuery(trimmedQuery)
        return
      }
      close()
      router.push(item.href)
    },
    [close, router, submitQuery, trimmedQuery]
  )

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (items.length === 0) return
      event.preventDefault()
      const delta = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex(prev => (prev + delta + items.length) % items.length)
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      const item = items[activeIndex]
      if (item) {
        runItem(item)
      } else if (trimmedQuery) {
        submitQuery(trimmedQuery)
      }
      return
    }

    // モーダル内でフォーカスを循環させる (背後のページへ Tab で抜けさせない)
    if (event.key === 'Tab') {
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input')
      if (!focusable || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex justify-center px-4 pt-[12vh] sm:pt-[14vh]">
      <div
        className="absolute inset-0 bg-ink-950/40 dark:bg-paper-950/80 backdrop-blur-[2px]"
        aria-hidden="true"
        onClick={close}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="フレーバー検索"
        onKeyDown={handleKeyDown}
        className="relative w-full max-w-[640px] max-h-[76vh] flex flex-col border border-ink-900 dark:border-ink-100 bg-paper-0 dark:bg-paper-950 shadow-none"
      >
        <div className="flex items-center border-b border-ink-900 dark:border-ink-100">
          <span className="font-mono-tight text-[10px] uppercase tracking-[0.18em] text-ember-500 pl-4 shrink-0">
            Q.
          </span>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="search-command-listbox"
            aria-activedescendant={items[activeIndex] ? `search-command-option-${activeIndex}` : undefined}
            aria-label="フレーバー・ブランドを検索"
            autoComplete="off"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="フレーバー名・ブランド名で検索"
            maxLength={100}
            className="flex-1 min-w-0 bg-transparent font-sans-tight text-base sm:text-lg text-ink-950 dark:text-ink-50 placeholder:text-ink-300 dark:placeholder:text-ink-500 focus:outline-none py-3.5 px-3"
          />
          {isLoading && (
            <span className="font-mono-tight text-[10px] uppercase tracking-[0.12em] text-ember-500 flex items-center gap-1.5 mr-3 shrink-0">
              <span className="inline-block w-1.5 h-1.5 bg-ember-500 animate-caret" />
              searching
            </span>
          )}
          <button
            type="button"
            onClick={close}
            className="font-mono-tight text-[10px] uppercase tracking-[0.14em] normal-case text-ink-500 dark:text-ink-400 hover:text-ember-500 transition-colors px-4 py-3.5 shrink-0 border-l border-rule-200 dark:border-rule-800"
          >
            esc
          </button>
        </div>

        <div
          ref={listRef}
          id="search-command-listbox"
          role="listbox"
          aria-label="検索候補"
          className="flex-1 overflow-y-auto overscroll-contain"
        >
          {items.length === 0 ? (
            <p className="px-4 py-10 text-center font-sans-tight text-sm text-ink-500 dark:text-ink-400">
              {isLoading
                ? '検索中…'
                : trimmedQuery
                ? `「${trimmedQuery}」に一致する記録はありません。`
                : 'ブランド名やフレーバー名を入力してください。'}
            </p>
          ) : (
            items.map((item, index) => {
              const isActive = index === activeIndex
              const label = sectionLabels[item.kind]
              const showSection = label !== null && (index === 0 || items[index - 1].kind !== item.kind)
              // 選択行は左端の ember バーで示す (暗所でも背景差より視認しやすい)
              const rowClass = `flex items-center gap-3 w-full pl-3 pr-4 py-2.5 text-left border-b border-rule-200 dark:border-rule-800 border-l-2 transition-colors ${
                isActive
                  ? 'border-l-ember-500 bg-paper-100 dark:bg-paper-900'
                  : 'border-l-transparent'
              }`

              return (
                <Fragment key={item.key}>
                  {showSection && (
                    <div className="px-4 py-2 font-mono-tight text-[10px] uppercase tracking-[0.16em] text-ink-400 dark:text-ink-500 border-b border-rule-200 dark:border-rule-800 bg-paper-50 dark:bg-paper-900/60">
                      {trimmedQuery ? label : 'Popular brands'}
                    </div>
                  )}

                  {item.kind === 'all' ? (
                    <button
                      type="button"
                      id={`search-command-option-${index}`}
                      role="option"
                      aria-selected={isActive}
                      data-active={isActive}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => runItem(item)}
                      className={`${rowClass} font-mono-tight text-[11px] normal-case tracking-[0.12em] text-ember-500 hover:bg-paper-100 dark:hover:bg-paper-900`}
                    >
                      <span aria-hidden className="inline-block w-1.5 h-1.5 bg-ember-500 shrink-0" />
                      <span className="truncate">{item.label}</span>
                      <span aria-hidden className="ml-auto">→</span>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      id={`search-command-option-${index}`}
                      role="option"
                      aria-selected={isActive}
                      data-active={isActive}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={close}
                      className={`${rowClass} hover:bg-paper-100 dark:hover:bg-paper-900`}
                    >
                      {item.kind === 'brand' ? (
                        <>
                          <span className="font-sans-tight text-sm font-semibold text-ink-950 dark:text-ink-50 truncate">
                            {item.name}
                          </span>
                          <span className="ml-auto font-mono-tight text-[10px] uppercase tracking-[0.12em] text-ink-400 dark:text-ink-500 nums shrink-0">
                            {item.count} entries
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="min-w-0">
                            <span className="block font-sans-tight text-sm text-ink-950 dark:text-ink-50 truncate">
                              {item.flavor.productName}
                            </span>
                            <span className="block font-mono-tight text-[10px] uppercase tracking-[0.12em] text-ink-400 dark:text-ink-500 truncate">
                              {item.flavor.manufacturer} · {item.flavor.amount}
                            </span>
                          </span>
                          <span className="ml-auto font-mono-tight text-[10px] text-ink-500 dark:text-ink-400 nums shrink-0">
                            {item.flavor.price}
                          </span>
                        </>
                      )}
                    </Link>
                  )}
                </Fragment>
              )
            })
          )}
        </div>

        <div className="hidden sm:flex items-center gap-4 px-4 py-2 border-t border-rule-200 dark:border-rule-800 font-mono-tight text-[10px] uppercase tracking-[0.14em] text-ink-400 dark:text-ink-500">
          <span>↑↓ select</span>
          <span>⏎ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  )
}
