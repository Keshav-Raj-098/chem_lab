'use server'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { PublicationCategory, ResearchStatus, ResearchProjectType } from '@/lib/generated/prisma/enums'

const REVALIDATE = 3600

export interface HomeStats {
  publications: number
  projects: number
  awards: number
  alumni: number
  groupMembers: number
  equipments: number
}

export async function fetchHomeStats(): Promise<HomeStats> {
  return unstable_cache(
    async () => {
      const [publications, projects, awards, alumni, groupMembers, equipments] = await Promise.all([
        prisma.publications.count(),
        prisma.researchProjects.count(),
        prisma.awards.count(),
        prisma.alumni.count(),
        prisma.groupMembers.count(),
        prisma.equipments.count(),
      ])
      return { publications, projects, awards, alumni, groupMembers, equipments }
    },
    ['home-stats'],
    { revalidate: REVALIDATE, tags: ['home-stats', 'publications', 'projects', 'awards', 'alumni', 'group', 'equipments'] }
  )()
}

export interface HomePublicationItem {
  id: string
  body: string
  category: PublicationCategory
  year: number | null
}

export async function fetchLatestPublications(limit = 4): Promise<HomePublicationItem[]> {
  return unstable_cache(
    async () => {
      const rows = await prisma.publications.findMany({
        orderBy: [{ year: 'desc' }, { updatedAt: 'desc' }],
        take: limit,
      })
      return rows.map((r) => ({
        id: r.id,
        body: r.body,
        category: r.category,
        year: r.year,
      }))
    },
    [`home-publications-${limit}`],
    { revalidate: REVALIDATE, tags: ['publications'] }
  )()
}

export interface HomeProjectItem {
  id: string
  title: string
  description: string | null
  status: ResearchStatus
  type: ResearchProjectType
  duration: string | null
  completedOn: string | null
}

export async function fetchLatestProjects(limit = 2): Promise<HomeProjectItem[]> {
  return unstable_cache(
    async () => {
      const rows = await prisma.researchProjects.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
      })
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        status: r.status,
        type: r.type,
        duration: r.duration,
        completedOn: r.completedOn ? r.completedOn.toISOString() : null,
      }))
    },
    [`home-projects-${limit}`],
    { revalidate: REVALIDATE, tags: ['projects'] }
  )()
}

export interface HomeEquipmentItem {
  id: string
  name: string
  manufacturer: string
  model: string
  serialNumber: string
  category: string
  installedOn: string
}

export async function fetchLatestEquipments(limit = 8): Promise<HomeEquipmentItem[]> {
  return unstable_cache(
    async () => {
      const rows = await prisma.equipments.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
      })
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        manufacturer: r.manufacturer,
        model: r.model,
        serialNumber: r.serialNumber,
        category: r.category,
        installedOn: r.installedOn.toISOString(),
      }))
    },
    [`home-equipments-${limit}`],
    { revalidate: REVALIDATE, tags: ['equipments'] }
  )()
}
