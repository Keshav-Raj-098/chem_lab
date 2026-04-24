'use server'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { PublicationCategory } from '@/lib/generated/prisma/enums'

export interface PublicationItem {
  id: string
  body: string
  category: PublicationCategory
  year: number | null
  createdAt: string
}

export interface CategoryGroup {
  category: PublicationCategory
  items: PublicationItem[]
  total: number
  hasMore: boolean
}

const serialize = (rows: { id: string; body: string; category: PublicationCategory; year: number | null; createdAt: Date }[]): PublicationItem[] =>
  rows.map((r) => ({
    id: r.id,
    body: r.body,
    category: r.category,
    year: r.year,
    createdAt: r.createdAt.toISOString(),
  }))

/**
 * Returns the top `pageSize` (default 10) publications for every category, plus totals.
 * Used for the initial SSR render.
 */
export async function fetchAllCategoriesInitial(pageSize: number = 10): Promise<CategoryGroup[]> {
  return unstable_cache(
    async () => {
      const categories = Object.values(PublicationCategory) as PublicationCategory[]

      const results = await Promise.all(
        categories.map(async (category) => {
          const [items, total] = await Promise.all([
            prisma.publications.findMany({
              where: { category },
              orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
              take: pageSize,
              select: { id: true, body: true, category: true, year: true, createdAt: true },
            }),
            prisma.publications.count({ where: { category } }),
          ])
          return {
            category,
            items: serialize(items),
            total,
            hasMore: total > pageSize,
          } satisfies CategoryGroup
        })
      )

      return results
    },
    [`publications-initial-${pageSize}`],
    { revalidate: 3600, tags: ['publications'] }
  )()
}

/**
 * Returns a page of publications for a single category. Called client-side by the "Load more" button.
 */
export async function fetchPublicationsPageAction(
  category: PublicationCategory,
  page: number,
  pageSize: number = 10
): Promise<{ success: boolean; items: PublicationItem[]; total: number; hasMore: boolean }> {
  try {
    return await unstable_cache(
      async () => {
        const [rows, total] = await Promise.all([
          prisma.publications.findMany({
            where: { category },
            orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
            skip: (page - 1) * pageSize,
            take: pageSize,
            select: { id: true, body: true, category: true, year: true, createdAt: true },
          }),
          prisma.publications.count({ where: { category } }),
        ])
        const items = serialize(rows)
        return {
          success: true,
          items,
          total,
          hasMore: total > page * pageSize,
        }
      },
      [`publications-${category}-${page}-${pageSize}`],
      { revalidate: 3600, tags: ['publications'] }
    )()
  } catch (err) {
    console.error('Failed to fetch publications page:', err)
    return { success: false, items: [], total: 0, hasMore: false }
  }
}
