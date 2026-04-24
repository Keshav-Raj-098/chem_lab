'use client'

import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import {
  fetchPublicationsPageAction,
  type PublicationItem,
} from '@/lib/load_data/load_publications'
import { PublicationCategory } from '@/lib/generated/prisma/enums'

interface Props {
  category: PublicationCategory
  displayName: string
  initialItems: PublicationItem[]
  initialTotal: number
  initialHasMore: boolean
  pageSize?: number
}

const getYearLabel = (item: PublicationItem): string => {
  if (item.year && Number.isFinite(item.year)) return String(item.year)
  try {
    return String(new Date(item.createdAt).getFullYear())
  } catch {
    return '—'
  }
}

const CategorySection = ({
  category,
  displayName,
  initialItems,
  initialTotal,
  initialHasMore,
  pageSize = 10,
}: Props) => {
  const [items, setItems] = useState<PublicationItem[]>(initialItems)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(initialTotal)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(false)

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const canGoPrev = page > 1 && !loading
  const canGoNext = hasMore && !loading

  const rangeStart = items.length === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = (page - 1) * pageSize + items.length

  const goToPage = useCallback(
    async (targetPage: number) => {
      if (loadingRef.current) return
      if (targetPage < 1 || targetPage > totalPages) return
      loadingRef.current = true
      setLoading(true)
      try {
        const result = await fetchPublicationsPageAction(category, targetPage, pageSize)
        if (result.success) {
          setItems(result.items)
          setPage(targetPage)
          setTotal(result.total)
          setHasMore(result.hasMore)
        }
      } catch (err) {
        console.error(`Failed to load page ${targetPage} for ${category}:`, err)
      } finally {
        loadingRef.current = false
        setLoading(false)
      }
    },
    [category, pageSize, totalPages]
  )

  if (initialItems.length === 0) return null

  return (
    <section
      aria-labelledby={`publications-${category}`}
      className="bg-white border border-slate-200/70 rounded-sm overflow-hidden"
    >
      {/* Box header */}
      <header className="flex items-end justify-between gap-6 px-6 md:px-8 pt-7 md:pt-8 pb-5 border-b border-slate-200/70">
        <div>
          <div className="inline-flex items-center gap-3 mb-2">
            <span className="w-6 h-px bg-amber-700" aria-hidden="true" />
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-amber-700">
              Research Output
            </span>
          </div>
          <h2
            id={`publications-${category}`}
            className="font-serif text-xl md:text-2xl text-slate-900 tracking-tight"
          >
            {displayName}
          </h2>
        </div>
        <div className="text-xs md:text-sm text-slate-400 whitespace-nowrap tabular-nums">
          {total.toLocaleString()} total
        </div>
      </header>

      {/* Timeline body */}
      <div className="relative px-6 md:px-8 py-8 min-h-[200px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ol
            key={page}
            role="list"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {items.map((item, index) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index * 0.025, 0.2),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative grid grid-cols-[64px_1fr] md:grid-cols-[88px_1fr] gap-4 md:gap-6 py-5 border-b border-slate-100 last:border-b-0"
              >
                {/* Left rail: year + dot on vertical line */}
                <div className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute left-[calc(100%-1px)] top-0 bottom-[-20px] w-px bg-slate-200 group-last:bottom-1/2"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute -right-[5px] top-2 w-2.5 h-2.5 rounded-full bg-white border-2 border-slate-300 group-hover:border-amber-700 group-hover:bg-amber-700 transition-colors"
                  />
                  <time
                    dateTime={String(item.year ?? new Date(item.createdAt).getFullYear())}
                    className="block text-right pr-5 font-serif text-base md:text-lg text-slate-900 tabular-nums leading-tight mt-0.5"
                  >
                    {getYearLabel(item)}
                  </time>
                </div>

                {/* Right: HTML body */}
                <article
                  className="prose prose-sm md:prose-base max-w-none text-slate-700 leading-relaxed
                             prose-p:my-0 prose-p:leading-relaxed
                             prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-2
                             prose-strong:text-slate-900
                             prose-em:text-slate-900"
                  dangerouslySetInnerHTML={{ __html: item.body }}
                />
              </motion.li>
            ))}
          </motion.ol>
        </AnimatePresence>

        {/* Loading overlay (non-blocking) */}
        {loading && (
          <div className="absolute top-3 right-3 md:top-4 md:right-4 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        )}
      </div>

      {/* Footer: pager at bottom-right */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-3 px-6 md:px-8 pb-6 md:pb-7 pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500 tabular-nums mr-1">
            {rangeStart.toLocaleString()}–{rangeEnd.toLocaleString()} of{' '}
            {total.toLocaleString()}
          </span>
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={!canGoPrev}
            aria-label={`Previous page of ${displayName}`}
            className="inline-flex items-center justify-center w-9 h-9 border border-slate-300 text-slate-600 rounded-sm hover:border-slate-900 hover:text-slate-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-slate-300 disabled:hover:text-slate-600"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={!canGoNext}
            aria-label={`Next page of ${displayName}`}
            className="inline-flex items-center justify-center w-9 h-9 border border-slate-300 text-slate-600 rounded-sm hover:border-slate-900 hover:text-slate-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-slate-300 disabled:hover:text-slate-600"
          >
            <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>
      )}
    </section>
  )
}

export default CategorySection
