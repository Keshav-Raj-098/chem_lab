import { prisma } from "@/lib/prisma";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export async function getDashboardStats() {
  const [
    projectCounts,
    equipmentCounts,
    memberCounts,
    awardCounts,
    publicationCounts,
    newsCount,
    recentNews,
    projectTrend,
    publicationTrend,
    latestProjects,
  ] = await Promise.all([
    prisma.researchProjects.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.equipments.groupBy({ by: ["category"], _count: { _all: true } }),
    prisma.groupMembers.groupBy({ by: ["category"], _count: { _all: true } }),
    prisma.awards.groupBy({ by: ["type"], _count: { _all: true } }),
    prisma.publications.groupBy({ by: ["category"], _count: { _all: true } }),
    prisma.newsAndAnnouncements.count(),

    prisma.newsAndAnnouncements.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, createdAt: true },
    }),

    prisma.$queryRaw<{ month: Date; count: bigint }[]>`
      SELECT date_trunc('month', "createdAt") AS month, COUNT(*) AS count
      FROM "ResearchProjects"
      GROUP BY month
      ORDER BY month ASC
    `,

    prisma.$queryRaw<{ year: number; count: bigint }[]>`
      SELECT year, COUNT(*) AS count
      FROM "Publications"
      WHERE year IS NOT NULL
      GROUP BY year
      ORDER BY year ASC
    `,

    prisma.researchProjects.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  const currentYear = new Date().getFullYear();
  const projectTrendMap: Record<string, number> = {};
  for (const row of projectTrend) {
    const d = new Date(row.month);
    if (d.getFullYear() === currentYear) {
      projectTrendMap[MONTHS[d.getMonth()]] = Number(row.count);
    }
  }

  const pubTrendNorm = publicationTrend
    .filter(r => r.year >= currentYear - 5)
    .map(r => ({ year: Number(r.year), count: Number(r.count) }));

  const ongoing   = projectCounts.find(p => p.status === "ONGOING")?._count._all ?? 0;
  const completed = projectCounts.find(p => p.status === "COMPLETED")?._count._all ?? 0;
  const planned   = projectCounts.find(p => p.status === "PLANNED")?._count._all ?? 0;

  return {
    totals: {
      projects: projectCounts.reduce((s, p) => s + p._count._all, 0),
      activeProjects: ongoing,
      completedProjects: completed,
      plannedProjects: planned,
      members: memberCounts.reduce((s, m) => s + m._count._all, 0),
      publications: publicationCounts.reduce((s, p) => s + p._count._all, 0),
      equipment: equipmentCounts.reduce((s, e) => s + e._count._all, 0),
      awards: awardCounts.reduce((s, a) => s + a._count._all, 0),
      news: newsCount,
    },
    projects: projectCounts.map(p => ({ category: p.status, count: p._count._all })),
    equipments: equipmentCounts.map(e => ({ category: e.category, count: e._count._all })),
    members: memberCounts.map(m => ({ category: m.category, count: m._count._all })),
    awards: awardCounts.map(a => ({ category: a.type, count: a._count._all })),
    publications: publicationCounts.map(p => ({ category: p.category, count: p._count._all })),
    projectTrend: MONTHS.map(m => ({ month: m, count: projectTrendMap[m] ?? 0 })),
    publicationTrend: pubTrendNorm,
    latestProjects: latestProjects.map(p => ({
      id: p.id,
      title: p.title,
      status: p.status,
      createdAt: p.createdAt.toISOString(),
    })),
    recentNews: recentNews.map(n => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
    })),
  };
}
