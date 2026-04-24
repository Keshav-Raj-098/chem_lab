'use server'

import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'

import { NewsAndAnnouncementsType } from './generated/prisma/client'

export async function fetchNewsAction({
  type,
  page = 1,
  pageSize = 10,
}: {
  type?: NewsAndAnnouncementsType
  page?: number
  pageSize?: number
}) {
  return unstable_cache(
    async () => {
      try {
        const skip = (page - 1) * pageSize
        const where = type ? { type } : {}

        const [news, total] = await Promise.all([
          prisma.newsAndAnnouncements.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: pageSize,
          }),
          prisma.newsAndAnnouncements.count({ where }),
        ])

        return {
          success: true,
          data: news,
          total,
          hasMore: total > skip + news.length,
        }
      } catch (error) {
        console.error('Error fetching news:', error)
        return {
          success: false,
          data: [],
          total: 0,
          hasMore: false,
          error: 'Failed to fetch news',
        }
      }
    },
    [`public-news-${type ?? 'all'}-${page}-${pageSize}`],
    { revalidate: 3600, tags: ['news'] }
  )()
}
