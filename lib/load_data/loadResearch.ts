'use server'
import { prisma } from '@/lib/prisma'
import { ResearchStatus } from '@/lib/generated/prisma/enums'
import { unstable_cache } from 'next/cache'

export const fetchResearchByStatus = unstable_cache(
  async (pageNumber: number, status: ResearchStatus, pageSize: number = 20) => {
    try {
      const where = { status };
      
      const [projects, totalCount] = await Promise.all([
        prisma.researchProjects.findMany({
          where,
          skip: (pageNumber - 1) * pageSize,
          take: pageSize,
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.researchProjects.count({ where })
      ]);

      return {
        success: true,
        data: projects,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        hasMore: projects.length === pageSize
      }
    } catch (error) {
      console.error('Error fetching research projects:', error)
      return {
        success: false,
        data: [],
        totalCount: 0,
        totalPages: 0,
        hasMore: false,
        error: 'Failed to fetch research projects'
      }
    }
  },
  ['public-research'],
  { revalidate: 3600, tags: ['research'] }
);
