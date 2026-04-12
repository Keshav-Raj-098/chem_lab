'use server'

import { prisma } from '@/lib/prisma'

export async function fetchNewsAction(pageNumber: number, pageSize: number = 20) {
  try {
    const newsData = await prisma.newsAndAnnouncements.findMany({
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
    console.error('Error fetching news:', error)
    return {
      success: false,
      data: [],
      hasMore: false,
      error: 'Failed to fetch news'
    }
  }
}
