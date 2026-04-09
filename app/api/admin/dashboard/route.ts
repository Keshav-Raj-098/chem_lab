// app/api/dashboard/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/token.utils";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || payload.role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [
      projectCounts,
      equipmentCounts,
      memberCounts,
      awardCounts,
      publicationCounts,
      newsCount,
      totalFunding,
      recentNews,
      projectTrend,
      publicationTrend,
    ] = await Promise.all([
      prisma.researchProjects.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.equipments.groupBy({ by: ["category"], _count: { _all: true } }),
      prisma.groupMembers.groupBy({ by: ["category"], _count: { _all: true } }),
      prisma.awards.groupBy({ by: ["type"], _count: { _all: true } }),
      prisma.publications.groupBy({ by: ["category"], _count: { _all: true } }),
      prisma.newsAndAnnouncements.count(),

      // Sum of all funded amounts
      prisma.researchProjects.aggregate({ _sum: { amntFunded: true } }),

      // Latest 5 news items for activity feed
      prisma.newsAndAnnouncements.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, createdAt: true },
      }),

      // ✅ Correct: monthly trend using raw SQL date_trunc
      prisma.$queryRaw<{ month: Date; count: bigint }[]>`
        SELECT date_trunc('month', "createdAt") AS month, COUNT(*) AS count
        FROM "ResearchProjects"
        GROUP BY month
        ORDER BY month ASC
      `,

      // ✅ Publications: group by year field (more meaningful than createdAt)
      prisma.$queryRaw<{ year: number; count: bigint }[]>`
        SELECT year, COUNT(*) AS count
        FROM "Publications"
        WHERE year IS NOT NULL
        GROUP BY year
        ORDER BY year ASC
      `,
    ]);

    // Normalize monthly project trend → 12-slot array (current year)
    const currentYear = new Date().getFullYear();
    const projectTrendMap: Record<string, number> = {};
    for (const row of projectTrend) {
      const d = new Date(row.month);
      if (d.getFullYear() === currentYear) {
        projectTrendMap[MONTHS[d.getMonth()]] = Number(row.count);
      }
    }

    // Normalize publication trend by year (last 6 years)
    const pubTrendNorm = publicationTrend
      .filter(r => r.year >= currentYear - 5)
      .map(r => ({ year: r.year, count: Number(r.count) }));

    return NextResponse.json({
      // Summary cards
      totals: {
        projects: projectCounts.reduce((s, p) => s + p._count._all, 0),
        members: memberCounts.reduce((s, m) => s + m._count._all, 0),
        publications: publicationCounts.reduce((s, p) => s + p._count._all, 0),
        equipment: equipmentCounts.reduce((s, e) => s + e._count._all, 0),
        awards: awardCounts.reduce((s, a) => s + a._count._all, 0),
        news: newsCount,
        totalFundingLakhs: totalFunding._sum.amntFunded ?? 0,
      },
      // Breakdown arrays
      projects: projectCounts.map(p => ({ category: p.status, count: p._count._all })),
      equipments: equipmentCounts.map(e => ({ category: e.category, count: e._count._all })),
      members: memberCounts.map(m => ({ category: m.category, count: m._count._all })),
      awards: awardCounts.map(a => ({ category: a.type, count: a._count._all })),
      publications: publicationCounts.map(p => ({ category: p.category, count: p._count._all })),
      // Trends
      projectTrend: MONTHS.map(m => ({ month: m, count: projectTrendMap[m] ?? 0 })),
      publicationTrend: pubTrendNorm,
      // Activity feed
      recentNews,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard statistics" }, { status: 500 });
  }
}