"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid,
  PieChart, Pie, Cell,
  AreaChart, Area,
} from "recharts";
import {
  FlaskConical, Users, Trophy,
  BookOpen, Newspaper, Briefcase,
  TrendingUp, ArrowUpRight,
} from "lucide-react";

// ─── Color Palette ─────────────────────────────────────────────────────────────────────────
const P = {
  indigo:      "#4F46E5",
  indigoLight: "#EEF2FF",
  teal:        "#0D9488",
  tealLight:   "#F0FDFA",
  violet:      "#7C3AED",
  violetLight: "#F5F3FF",
  amber:       "#B45309",
  amberLight:  "#FFFBEB",
  sky:         "#0284C7",
  skyLight:    "#F0F9FF",
  rose:        "#BE185D",
  roseLight:   "#FFF1F2",
  emerald:     "#059669",
  ONGOING:   "#0D9488",
  COMPLETED: "#059669",
  PLANNED:   "#6366F1",
  series: [
    "#4F46E5", "#0D9488", "#B45309", "#7C3AED", "#0284C7", "#059669", "#BE185D",
  ],
  tick:   "#94A3B8",
  grid:   "#F1F5F9",
};

// ─── Types ─────────────────────────────────────────────────────────────────────────────────
interface StatItem { category: string; count: number }
interface TrendPoint { month: string; count: number }
interface PubTrendPoint { year: number; count: number }
interface RecentNews { id: string; title: string; createdAt: string }

export interface DashboardStats {
  totals: {
    projects: number ; members: number; publications: number;
    equipment: number; awards: number; news: number;
    totalFundingLakhs: number;
  };
  projects: StatItem[];
  equipments: StatItem[];
  members: StatItem[];
  awards: StatItem[];
  publications: StatItem[];
  projectTrend: TrendPoint[];
  publicationTrend: PubTrendPoint[];
  recentNews: RecentNews[];
}

// ─── Chart configs ─────────────────────────────────────────────────────────────────────────
const trendConfig    = { count: { label: "Projects",     color: P.indigo  } } satisfies ChartConfig;
const pubConfig      = { count: { label: "Publications", color: P.teal    } } satisfies ChartConfig;
const pubTypeConfig  = { count: { label: "Count",        color: P.violet  } } satisfies ChartConfig;
const memberConfig   = { count: { label: "Members"                        } } satisfies ChartConfig;
const equipConfig    = { count: { label: "Equipment"                      } } satisfies ChartConfig;

// ─── Helpers ───────────────────────────────────────────────────────────────────────────────
function timeAgo(d: string | Date) {
  const date = typeof d === 'string' ? new Date(d) : d;
  const days = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30)  return `${days}d ago`;
  const mo = Math.floor(days / 30);
  return mo < 12 ? `${mo}mo ago` : `${Math.floor(mo / 12)}y ago`;
}

function fmt(n: number) { return new Intl.NumberFormat("en-IN").format(n); }

// ─── Micro-components ──────────────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 mb-3">
      {children}
    </p>
  );
}

interface StatCardProps {
  label: string; value: number | string; sub: string;
  icon: React.ElementType; accent: string; accentBg: string;
}

function StatCard({ label, value, sub, icon: Icon, accent, accentBg }: StatCardProps) {
  return (
    <div className="relative rounded-xl bg-white dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800
      hover:ring-zinc-300 dark:hover:ring-zinc-700 hover:shadow-sm
      transition-all duration-200 overflow-hidden px-4 py-4">
      <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full" style={{ backgroundColor: accent }} />
      <div className="flex items-start justify-between gap-2">
        <div className="pl-1">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mb-1.5">
            {label}
          </p>
          <p className="text-[1.6rem] font-bold tracking-tight text-zinc-900 dark:text-zinc-50 tabular-nums leading-none">
            {fmt(Number(value))}
          </p>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1.5 leading-none">{sub}</p>
        </div>
        <div className="rounded-lg p-2 shrink-0" style={{ backgroundColor: accentBg }}>
          <Icon className="h-[15px] w-[15px]" style={{ color: accent }} />
        </div>
      </div>
    </div>
  );
}

function ChartCard({
  title, description, icon: Icon, iconBg, iconColor, children,
}: {
  title: string; description: string;
  icon?: React.ElementType; iconBg?: string; iconColor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800 shadow-none">
      <div className="flex items-start justify-between px-5 pt-5 pb-0">
        <div>
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 leading-none">{title}</p>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">{description}</p>
        </div>
        {Icon && (
          <div className="rounded-lg p-1.5" style={{ backgroundColor: iconBg }}>
            <Icon className="h-3.5 w-3.5" style={{ color: iconColor }} />
          </div>
        )}
      </div>
      <div className="px-5 pb-5 pt-3">{children}</div>
    </div>
  );
}

export function DashboardCharts({ stats }: { stats: DashboardStats }) {
  const cards: StatCardProps[] = [
    { label: "Projects",     value: stats.totals.projects,
      icon: Briefcase,  accent: P.indigo,  accentBg: P.indigoLight,
      sub: `₹${Number(stats.totals.totalFundingLakhs).toFixed(1)}L total funding` },
    { label: "Members",      value: stats.totals.members,
      icon: Users,      accent: P.teal,    accentBg: P.tealLight,
      sub: `${stats.members.find(m => m.category === "PHD")?.count ?? 0} PhD scholars` },
    { label: "Publications", value: stats.totals.publications,
      icon: BookOpen,   accent: P.violet,  accentBg: P.violetLight,
      sub: `${stats.publications.find(p => p.category === "JOURNAL")?.count ?? 0} journals` },
    { label: "Equipment",    value: stats.totals.equipment,
      icon: FlaskConical, accent: P.sky,   accentBg: P.skyLight,
      sub: "Lab instruments" },
    { label: "Awards",       value: stats.totals.awards,
      icon: Trophy,     accent: P.amber,   accentBg: P.amberLight,
      sub: "Recognitions" },
    { label: "News",         value: stats.totals.news,
      icon: Newspaper,  accent: P.rose,    accentBg: P.roseLight,
      sub: "Announcements" },
  ];

  const statusColor: Record<string, string> = {
    ONGOING: P.ONGOING, COMPLETED: P.COMPLETED, PLANNED: P.PLANNED,
  };

  return (
    <div className="space-y-8">
      {/* ── Summary cards ────────────────────────────────────────────────────────────────── */}
      <section>
        <SectionLabel>At a glance</SectionLabel>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {cards.map((c) => <StatCard key={c.label} {...c} />)}
        </div>
      </section>

      {/* ── Trend charts ─────────────────────────────────────────────────────────────────── */}
      <section>
        <SectionLabel>Trends</SectionLabel>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <ChartCard title="Project Activity" description={`New projects added · ${new Date().getFullYear()}`}
            icon={TrendingUp} iconBg={P.indigoLight} iconColor={P.indigo}>
            <ChartContainer config={trendConfig} className="h-44 w-full">
              <AreaChart data={stats.projectTrend} margin={{ top: 4, right: 4, left: -26, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={P.indigo} stopOpacity={0.13} />
                    <stop offset="100%" stopColor={P.indigo} stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={P.grid} strokeDasharray="4 4" />
                <XAxis dataKey="month" tickLine={false} axisLine={false}
                  tick={{ fontSize: 10, fill: P.tick }} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false}
                  tick={{ fontSize: 10, fill: P.tick }} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />}
                  cursor={{ stroke: P.indigo, strokeWidth: 1, strokeDasharray: "3 3" }} />
                <Area type="monotone" dataKey="count"
                  stroke={P.indigo} strokeWidth={2}
                  fill="url(#areaGrad)" dot={false}
                  activeDot={{ r: 4, fill: P.indigo, stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ChartContainer>
          </ChartCard>

          <ChartCard title="Publication Output" description="Per year · last 6 years"
            icon={BookOpen} iconBg={P.tealLight} iconColor={P.teal}>
            <ChartContainer config={pubConfig} className="h-44 w-full">
              <BarChart data={stats.publicationTrend} barSize={20}
                margin={{ top: 4, right: 4, left: -26, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={P.grid} strokeDasharray="4 4" />
                <XAxis dataKey="year" tickLine={false} axisLine={false}
                  tick={{ fontSize: 10, fill: P.tick }} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false}
                  tick={{ fontSize: 10, fill: P.tick }} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />}
                  cursor={{ fill: P.teal, opacity: 0.05 }} />
                <Bar dataKey="count" fill={P.teal} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </ChartCard>
        </div>
      </section>

      {/* ── Distributions ────────────────────────────────────────────────────────────────── */}
      <section>
        <SectionLabel>Distributions</SectionLabel>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          {/* Team donut */}
          <ChartCard title="Team Composition" description="Members by academic category">
            <ChartContainer config={memberConfig} className="mx-auto h-52">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={stats.members} dataKey="count" nameKey="category"
                  innerRadius={54} outerRadius={74}
                  strokeWidth={2} stroke="#fff" paddingAngle={2}>
                  {stats.members.map((_, i) => (
                    <Cell key={i} fill={P.series[i % P.series.length]} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="category" />}
                  className="flex-wrap gap-x-3 gap-y-1 justify-center text-[10px] mt-1" />
              </PieChart>
            </ChartContainer>
          </ChartCard>

          {/* Publications by type */}
          <ChartCard title="Publications by Type" description="Breakdown across all categories">
            <ChartContainer config={pubTypeConfig} className="h-52 w-full">
              <BarChart data={stats.publications} layout="vertical"
                margin={{ top: 0, right: 8, left: 2, bottom: 0 }} barSize={8}>
                <XAxis type="number" dataKey="count" hide />
                <YAxis dataKey="category" type="category" tickLine={false} axisLine={false}
                  tick={{ fontSize: 9, fill: P.tick }} width={74}
                  tickFormatter={(v) => v.length > 11 ? v.slice(0, 11) + "…" : v} />
                <ChartTooltip content={<ChartTooltipContent hideLabel />}
                  cursor={{ fill: P.violet, opacity: 0.05 }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {stats.publications.map((_, i) => (
                    <Cell key={i} fill={P.series[i % P.series.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </ChartCard>

          {/* News feed */}
          <div className="rounded-xl bg-white dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800">
            <div className="px-5 pt-5 pb-0 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Recent Activity</p>
                <p className="text-[11px] text-zinc-400 mt-1">Latest announcements</p>
              </div>
              <Newspaper className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600 mt-0.5" />
            </div>
            <div className="px-5 pb-5 pt-3">
              {stats.recentNews.length === 0 ? (
                <p className="text-xs text-zinc-400 py-6 text-center">No announcements yet.</p>
              ) : (
                <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {stats.recentNews.map((item) => (
                    <li key={item.id} className="py-2.5 flex items-start gap-2.5">
                      <ArrowUpRight className="h-3 w-3 mt-0.5 shrink-0 text-zinc-300 dark:text-zinc-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-zinc-700 dark:text-zinc-300 leading-snug line-clamp-2">
                          {item.title}
                        </p>
                        <span className="text-[10px] text-zinc-400 mt-0.5 block">
                          {timeAgo(item.createdAt)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Status & Inventory ───────────────────────────────────────────────────────────── */}
      <section>
        <SectionLabel>Status & inventory</SectionLabel>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {/* Project status progress bars */}
          <div className="rounded-xl bg-white dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800 px-5 py-5">
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Project Status</p>
            <p className="text-[11px] text-zinc-400 mt-1 mb-5">Distribution across states</p>
            <div className="space-y-5">
              {stats.projects.map((p) => {
                const total = stats.totals.projects || 1;
                const pct   = Math.round((p.count / total) * 100);
                const color = statusColor[p.category] ?? P.tick;
                return (
                  <div key={p.category}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 capitalize">
                          {p.category.charAt(0) + p.category.slice(1).toLowerCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 tabular-nums">
                          {p.count}
                        </span>
                        <span className="text-[10px] text-zinc-400 tabular-nums w-7 text-right">
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Equipment inventory bar */}
          <ChartCard title="Equipment Inventory" description="Count by category">
            {stats.equipments.length === 0 ? (
              <p className="text-xs text-zinc-400 py-8 text-center">No equipment records found.</p>
            ) : (
              <ChartContainer config={equipConfig} className="h-40 w-full">
                <BarChart data={stats.equipments} barSize={16}
                  margin={{ top: 4, right: 4, left: -26, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke={P.grid} strokeDasharray="4 4" />
                  <XAxis dataKey="category" tickLine={false} axisLine={false}
                    tick={{ fontSize: 9, fill: P.tick }}
                    tickFormatter={(v) => v.slice(0, 7)} tickMargin={6} />
                  <YAxis tickLine={false} axisLine={false}
                    tick={{ fontSize: 10, fill: P.tick }} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />}
                    cursor={{ fill: P.indigo, opacity: 0.05 }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {stats.equipments.map((_, i) => (
                      <Cell key={i} fill={P.series[i % P.series.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </ChartCard>
        </div>
      </section>
    </div>
  );
}
