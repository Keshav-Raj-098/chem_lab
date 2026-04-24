'use server'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'

export default async function fetchResearchAreas() {
  return unstable_cache(
    async () => {
      try {
        const newsData = await prisma.researchAreas.findMany({
          orderBy: {
            createdAt: 'desc'
          }
        })
        
        return newsData
      } catch (error) {
        console.error('Error fetching researchAreas:', error)
        return null
      }
    },
    [`researchAreas`],
    {
      revalidate: 12*3600, // Cache for 12 hours
      tags: ['researchAreas']
    }
  )()
}
