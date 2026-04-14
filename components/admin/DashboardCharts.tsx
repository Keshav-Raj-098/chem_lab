"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  XAxis, YAxis,
  CartesianGrid,
  PieChart, Pie,
  AreaChart, Area,
  RadialBarChart, RadialBar, PolarAngleAxis,
  ComposedChart, Line, Bar,
} from "recharts";
import {
  FlaskConical, Users, Trophy,
  BookOpen, Newspaper, Briefcase,
  TrendingUp, Activity,
} from "lucide-react";

// ─── Palette ────────────────────────────────────────────────────────────────
// Muted, professional tones — designed for a research-lab dashboard.
const P = {
  slate:       "#475569",
  slateSoft:   "#F1F5F9",
  indigo:      "#4F46E5",
  indigoSoft:  "#EEF2FF",
  teal:        "#0F766E",
  tealSoft:    "#F0FDFA",
  amber:       "#B45309",
  amberSoft:   "#FEF3C7",
  sky:         "#0369A1",
  skySoft:     "#E0F2FE",
  violet:      "#6D28D9",
  violetSoft:  "#F5F3FF",
  rose:        "#9F1239",
  roseSoft:    "#FFF1F2",
  emerald:     "#047857",
  emeraldSoft: "#ECFDF5",

  // Status
  ONGOING:   "#0F766E",
  COMPLETED: "#047857",
  PLANNED:   "#6366F1",

  // Axes / grid
  tick: "#94A3B8",
  grid: "#E2E8F0",

  // Categorical series — soft, gentle, print-safe.
  series: [
    "#4F46E5", "#0F766E", "#B45309", "#7C3AED",
    "#0369A1", "#047857", "#9F1239", "#64748B", "#DB2777",
  ],
};

// ─── Types ──────────────────────────────────────────────────────────────────
interface StatItem     { category: string; count: number }
interface TrendPoint   { month: string; count: number }
interface PubTrendPoint { year: number; count: number }
interface RecentNews   { id: string; title: string; createdAt: string }
interface LatestProject {
  id: string; title: string; status: string;
  createdAt: string;
}

export interface DashboardStats {
  totals: {
    projects: number;
    activeProjects: number;
    completedProjects: number;
    plannedProjects: number;
    members: number;
    publications: number;
    equipment: number;
    awards: number;
    news: number;
  };
  projects:         StatItem[];
  equipments:       StatItem[];
  members:          StatItem[];
  awards:           StatItem[];
  publications:     StatItem[];
  projectTrend:     TrendPoint[];
  publicationTrend: PubTrendPoint[];
  latestProjects:   LatestProject[];
  recentNews:       RecentNews[];
}

// ─── Chart configs ──────────────────────────────────────────────────────────
const trendConfig   = { count: { label: "Projects",     color: P.indigo } } satisfies ChartConfig;
const pubConfig     = { count: { label: "Publications", color: P.teal   } } satisfies ChartConfig;
const memberConfig  = { count: { label: "Members"                       } } satisfies ChartConfig;
const statusConfig  = { value: { label: "Projects"                      } } satisfies ChartConfig;

// ─── Helpers ────────────────────────────────────────────────────────────────
function timeAgo(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  const days = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30)  return `${days}d ago`;
  const mo = Math.floor(days / 30);
  return mo < 12 ? `${mo}mo ago` : `${Math.floor(mo / 12)}y ago`;
}

function fmt(n: number) { return new Intl.NumberFormat("en-IN").format(n); }

/** Format a Lakhs amount with graceful scaling. */
function fmtLakhs(n: number) {
  if (n >= 100) return `${(n / 100).toFixed(1)} Cr`;
  if (n >= 10)  return `${n.toFixed(0)} L`;
  return `${n.toFixed(1)} L`;
}

function titleCase(s: string) {
  return s.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

// ─── Primitives ─────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-zinc-400 dark:text-zinc-500 mb-4">
      {children}
    </p>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-10 text-center">
      <p className="text-[11px] text-zinc-400">{children}</p>
    </div>
  );
}

interface HeroKpiProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  accent: string;
  accentSoft: string;
}

function HeroKpi({ label, value, sub, icon: Icon, accent, accentSoft }: HeroKpiProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900
      ring-1 ring-zinc-200/70 dark:ring-zinc-800 hover:ring-zinc-300 dark:hover:ring-zinc-700
      hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)]
      transition-all duration-300 px-5 py-5 group">
      {/* decorative glow */}
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-70 blur-2xl pointer-events-none"
        style={{ background: accentSoft }}
      />
      <div className="flex items-start justify-between gap-3 relative">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-zinc-500 dark:text-zinc-400">
            {label}
          </p>
          <p className="mt-2 text-[1.95rem] font-bold tracking-tight text-zinc-900 dark:text-zinc-50
            tabular-nums leading-none">
            {value}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2.5 truncate">
            {sub}
          </p>
        </div>
        <div
          className="rounded-xl p-2.5 shrink-0"
          style={{
            backgroundColor: accentSoft,
            boxShadow: `inset 0 0 0 1px ${accent}22`,
          }}
        >
          <Icon className="h-4 w-4" style={{ color: accent }} />
        </div>
      </div>
    </div>
  );
}

interface MiniStatProps {
  label: string;
  value: number;
  icon: React.ElementType;
  accent: string;
}

function MiniStat({ label, value, icon: Icon, accent }: MiniStatProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-zinc-900
      ring-1 ring-zinc-200/70 dark:ring-zinc-800 hover:ring-zinc-300 transition-colors">
      <div
        className="h-9 w-9 rounded-lg grid place-items-center shrink-0"
        style={{ backgroundColor: `${accent}14`, color: accent }}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500">
          {label}
        </p>
        <p className="text-lg font-bold tabular-nums leading-none mt-0.5 text-zinc-900 dark:text-zinc-50">
          {fmt(value)}
        </p>
      </div>
    </div>
  );
}

function ChartCard({
  title, description, icon: Icon, iconBg, iconColor, className, children,
}: {
  title: string;
  description: string;
  icon?: React.ElementType;
  iconBg?: string;
  iconColor?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl bg-white dark:bg-zinc-900
        ring-1 ring-zinc-200/70 dark:ring-zinc-800
        hover:ring-zinc-300 dark:hover:ring-zinc-700 transition-colors ${className ?? ""}`}
    >
      <div className="flex items-start justify-between px-5 pt-5 pb-0">
        <div>
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 leading-none">
            {title}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-500 mt-1.5">
            {description}
          </p>
        </div>
        {Icon && (
          <div className="rounded-lg p-2" style={{ backgroundColor: iconBg }}>
            <Icon className="h-3.5 w-3.5" style={{ color: iconColor }} />
          </div>
        )}
      </div>
      <div className="px-5 pb-5 pt-4">{children}</div>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────
export function DashboardCharts({ stats }: { stats: DashboardStats }) {
  const t = stats.totals;

  const phdCount     = stats.members.find(m => m.category === "PHD")?.count     ?? 0;
  const facultyCount = stats.members.find(m => m.category === "FACULTY")?.count ?? 0;
  const journalCount = stats.publications.find(p => p.category === "JOURNAL")?.count ?? 0;

  const statusColor: Record<string, string> = {
    ONGOING: P.ONGOING, COMPLETED: P.COMPLETED, PLANNED: P.PLANNED,
  };

  // Radial data for project status
  const statusData = stats.projects.map(p => ({
    name:  titleCase(p.category),
    value: p.count,
    fill:  statusColor[p.category] ?? P.slate,
  }));

  // Team composition with inline fill (replaces deprecated <Cell>)
  const memberData = stats.members.map((m, i) => ({
    ...m,
    fill: P.series[i % P.series.length],
  }));

  const heroKpis: HeroKpiProps[] = [
    {
      label:      "Active Research",
      value:      fmt(t.activeProjects),
      sub:        `${t.projects} total · ${t.completedProjects} completed`,
      icon:       Activity,
      accent:     P.teal,
      accentSoft: P.tealSoft,
    },
    {
      label:      "Publications",
      value:      fmt(t.publications),
      sub:        `${journalCount} journal articles`,
      icon:       BookOpen,
      accent:     P.indigo,
      accentSoft: P.indigoSoft,
    },
    {
      label:      "Research Team",
      value:      fmt(t.members),
      sub:        `${phdCount} PhD · ${facultyCount} faculty`,
      icon:       Users,
      accent:     P.sky,
      accentSoft: P.skySoft,
    },
  ];

  const miniStats: MiniStatProps[] = [
    { label: "Equipment", value: t.equipment, icon: FlaskConical, accent: P.violet },
    { label: "Awards",    value: t.awards,    icon: Trophy,       accent: P.rose   },
    { label: "News",      value: t.news,      icon: Newspaper,    accent: P.slate  },
  ];

  return (
    <div className="space-y-10">
      {/* ─── Hero KPIs ───────────────────────────────────────────────────── */}
      <section>
        <SectionLabel>Key performance</SectionLabel>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {heroKpis.map(k => <HeroKpi key={k.label} {...k} />)}
        </div>
      </section>

      {/* ─── Secondary mini-stats ───────────────────────────────────────── */}
      <section>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          {miniStats.map(m => <MiniStat key={m.label} {...m} />)}
        </div>
      </section>

      {/* ─── Activity + Status ──────────────────────────────────────────── */}
      <section>
        <SectionLabel>Research activity</SectionLabel>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          {/* Project activity area chart */}
          <div className="lg:col-span-2">
            <ChartCard
              title="Project Activity"
              description={`New projects added this year · ${new Date().getFullYear()}`}
              icon={TrendingUp}
              iconBg={P.indigoSoft}
              iconColor={P.indigo}
            >
              <ChartContainer config={trendConfig} className="h-56 w-full">
                <AreaChart data={stats.projectTrend} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="projectGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={P.indigo} stopOpacity={0.22} />
                      <stop offset="100%" stopColor={P.indigo} stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={P.grid} strokeDasharray="4 4" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false}
                    tick={{ fontSize: 10, fill: P.tick }} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false}
                    tick={{ fontSize: 10, fill: P.tick }} allowDecimals={false} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ stroke: P.indigo, strokeWidth: 1, strokeDasharray: "3 3" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke={P.indigo}
                    strokeWidth={2.25}
                    fill="url(#projectGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: P.indigo, stroke: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ChartContainer>
            </ChartCard>
          </div>

          {/* Project status radial */}
          <ChartCard title="Project Status" description="Distribution across states">
            <ChartContainer config={statusConfig} className="mx-auto h-44">
              <RadialBarChart
                data={statusData}
                innerRadius="55%"
                outerRadius="100%"
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, Math.max(t.projects, 1)]}
                  tick={false}
                />
                <RadialBar
                  dataKey="value"
                  background={{ fill: P.slateSoft }}
                  cornerRadius={8}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              </RadialBarChart>
            </ChartContainer>
            <div className="mt-3 space-y-1.5">
              {stats.projects.map(p => {
                const color = statusColor[p.category] ?? P.slate;
                const pct   = t.projects ? Math.round((p.count / t.projects) * 100) : 0;
                return (
                  <div key={p.category} className="flex items-center gap-2 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-zinc-600 dark:text-zinc-400 flex-1">
                      {titleCase(p.category)}
                    </span>
                    <span className="font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">
                      {p.count}
                    </span>
                    <span className="text-zinc-400 tabular-nums w-7 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </div>
      </section>

      {/* ─── Publications trend ────────────────────────────────────────── */}
      <section>
        <SectionLabel>Research output</SectionLabel>
        <div className="grid gap-4 grid-cols-1">
          {/* Publications per year — bar + trend line */}
          <ChartCard
            title="Publication Output"
            description="Research publications per year · last 6 years"
            icon={BookOpen}
            iconBg={P.tealSoft}
            iconColor={P.teal}
          >
            {stats.publicationTrend.length === 0 ? (
              <EmptyState>No publications yet</EmptyState>
            ) : (
              <ChartContainer config={pubConfig} className="h-52 w-full">
                <ComposedChart
                  data={stats.publicationTrend}
                  margin={{ top: 6, right: 6, left: -22, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={P.teal} stopOpacity={0.85} />
                      <stop offset="100%" stopColor={P.teal} stopOpacity={0.45} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={P.grid} strokeDasharray="4 4" />
                  <XAxis dataKey="year" tickLine={false} axisLine={false}
                    tick={{ fontSize: 10, fill: P.tick }} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false}
                    tick={{ fontSize: 10, fill: P.tick }} allowDecimals={false} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: P.teal, opacity: 0.06 }}
                  />
                  <Bar dataKey="count" fill="url(#tealGrad)" radius={[5, 5, 0, 0]} barSize={24} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke={P.indigo}
                    strokeWidth={2}
                    dot={{ r: 3, fill: P.indigo, stroke: "#fff", strokeWidth: 1.5 }}
                  />
                </ComposedChart>
              </ChartContainer>
            )}
          </ChartCard>
        </div>
      </section>

      {/* ─── Portfolio breakdown ────────────────────────────────────────── */}
      <section>
        <SectionLabel>Portfolio breakdown</SectionLabel>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          {/* Team composition donut */}
          <ChartCard title="Team Composition" description="Members by academic category">
            <ChartContainer config={memberConfig} className="mx-auto h-44">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={memberData}
                  dataKey="count"
                  nameKey="category"
                  innerRadius={52}
                  outerRadius={74}
                  strokeWidth={2}
                  stroke="#fff"
                  paddingAngle={2}
                />
              </PieChart>
            </ChartContainer>
            {/* Custom legend — shows color + name + count for each category */}
            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
              {memberData.map(m => {
                const pct = t.members ? Math.round((m.count / t.members) * 100) : 0;
                return (
                  <div key={m.category} className="flex items-center gap-2 text-[11px] min-w-0">
                    <span
                      className="h-2 w-2 rounded-sm shrink-0"
                      style={{ backgroundColor: m.fill }}
                    />
                    <span className="text-zinc-600 dark:text-zinc-400 flex-1 truncate">
                      {titleCase(m.category)}
                    </span>
                    <span className="font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">
                      {m.count}
                    </span>
                    <span className="text-zinc-400 tabular-nums w-7 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </ChartCard>

          {/* Publications by type — horizontal progress bars */}
          <ChartCard title="Publications by Type" description="Breakdown across categories">
            {stats.publications.length === 0 ? (
              <EmptyState>No publications yet</EmptyState>
            ) : (
              <div className="space-y-2.5 pt-1">
                {(() => {
                  const max = Math.max(...stats.publications.map(x => x.count), 1);
                  return stats.publications
                    .slice()
                    .sort((a, b) => b.count - a.count)
                    .map((p, i) => {
                      const pct   = Math.round((p.count / max) * 100);
                      const color = P.series[i % P.series.length];
                      return (
                        <div key={p.category}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] text-zinc-600 dark:text-zinc-400 truncate pr-3">
                              {titleCase(p.category)}
                            </span>
                            <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 tabular-nums">
                              {p.count}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${pct}%`, backgroundColor: color }}
                            />
                          </div>
                        </div>
                      );
                    });
                })()}
              </div>
            )}
          </ChartCard>

          {/* Recent activity feed */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 ring-1 ring-zinc-200/70 dark:ring-zinc-800">
            <div className="px-5 pt-5 pb-0 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  Recent Activity
                </p>
                <p className="text-[11px] text-zinc-500 mt-1.5">Latest announcements</p>
              </div>
              <div className="rounded-lg p-2" style={{ backgroundColor: P.roseSoft }}>
                <Newspaper className="h-3.5 w-3.5" style={{ color: P.rose }} />
              </div>
            </div>
            <div className="px-5 pb-5 pt-4">
              {stats.recentNews.length === 0 ? (
                <EmptyState>No announcements yet</EmptyState>
              ) : (
                <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {stats.recentNews.map(item => (
                    <li
                      key={item.id}
                      className="py-2.5 flex items-start gap-2.5 group cursor-default"
                    >
                      <span
                        className="mt-1 h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: P.rose }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-zinc-700 dark:text-zinc-300 leading-snug
                          line-clamp-2 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition">
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

      {/* ─── Equipment + Latest Projects ────────────────────────────────── */}
      <section>
        <SectionLabel>Infrastructure & latest work</SectionLabel>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {/* Equipment inventory */}
          <ChartCard
            title="Equipment Inventory"
            description="Laboratory instruments by category"
            icon={FlaskConical}
            iconBg={P.violetSoft}
            iconColor={P.violet}
          >
            {stats.equipments.length === 0 ? (
              <EmptyState>No equipment records</EmptyState>
            ) : (
              <div className="space-y-2.5 pt-1">
                {(() => {
                  const max = Math.max(...stats.equipments.map(x => x.count), 1);
                  return stats.equipments
                    .slice()
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 6)
                    .map((e, i) => {
                      const pct   = Math.round((e.count / max) * 100);
                      const color = P.series[i % P.series.length];
                      return (
                        <div key={e.category}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] text-zinc-600 dark:text-zinc-400 truncate pr-3">
                              {e.category}
                            </span>
                            <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 tabular-nums">
                              {e.count}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${pct}%`, backgroundColor: color }}
                            />
                          </div>
                        </div>
                      );
                    });
                })()}
              </div>
            )}
          </ChartCard>

          {/* Latest projects */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 ring-1 ring-zinc-200/70 dark:ring-zinc-800">
            <div className="px-5 pt-5 pb-0 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  Latest Projects
                </p>
                <p className="text-[11px] text-zinc-500 mt-1.5">
                  Recently added research initiatives
                </p>
              </div>
              <div className="rounded-lg p-2" style={{ backgroundColor: P.indigoSoft }}>
                <Briefcase className="h-3.5 w-3.5" style={{ color: P.indigo }} />
              </div>
            </div>
            <div className="px-5 pb-5 pt-4">
              {stats.latestProjects.length === 0 ? (
                <EmptyState>No projects yet</EmptyState>
              ) : (
                <ul className="space-y-1">
                  {stats.latestProjects.map(p => {
                    const color = statusColor[p.status] ?? P.slate;
                    return (
                      <li key={p.id} className="flex items-start gap-3 py-2 group">
                        <div
                          className="w-1 self-stretch rounded-full shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium text-zinc-800 dark:text-zinc-200 leading-snug line-clamp-2">
                            {p.title}
                          </p>
                          <div className="flex items-center gap-2.5 mt-1">
                            <span
                              className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                              style={{ backgroundColor: `${color}17`, color }}
                            >
                              {titleCase(p.status)}
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              {timeAgo(p.createdAt)}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
