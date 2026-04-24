'use server'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'

export default async function fetchGalleryAction(pageNumber: number, pageSize: number = 20) {
  return unstable_cache(
    async () => {
      try {
        const newsData = await prisma.gallery.findMany({
          skip: (pageNumber - 1) * pageSize,
          take: pageSize,
          orderBy: {
            createdAt: 'desc'
          }
        })
        
        return {
          success: true,
          data: newsData,
          hasMore: newsData.length === pageSize
        }
      } catch (error) {
        console.error('Error fetching gallery:', error)
        return {
          success: false,
          data: [],
          hasMore: false,
          error: 'Failed to fetch gallery'
        }
      }
    },
    [`gallery-page-${pageNumber}-${pageSize}`],
    {
      revalidate: 3600, // Cache for 1 hour
      tags: ['gallery']
    }
  )()
}
