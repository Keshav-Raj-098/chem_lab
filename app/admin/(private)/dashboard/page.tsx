import { getDashboardStats } from "@/lib/dashboard";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { FlaskConical, CalendarDays } from "lucide-react";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day:     "numeric",
    month:   "short",
    year:    "numeric",
  });

  return (
    <div className="px-6 py-7 space-y-8 w-full mx-auto max-w-350">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header
        className="relative overflow-hidden rounded-2xl
          bg-linear-to-br from-white via-slate-50/80 to-indigo-50/40
          dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950
          ring-1 ring-zinc-200/80 dark:ring-zinc-800
          px-6 py-6"
      >
        {/* Decorative glow */}
        <div className="absolute -top-20 -right-10 h-52 w-52 rounded-full bg-indigo-200/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 left-24 h-40 w-40 rounded-full bg-teal-200/20 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="hidden sm:grid place-items-center h-11 w-11 rounded-xl
              bg-white ring-1 ring-zinc-200 shadow-sm shrink-0">
              <FlaskConical className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-indigo-600/80">
                ChemLab · Research Analytics
              </p>
              <h1 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Laboratory Dashboard
              </h1>
              <p className="mt-1 text-[12px] text-zinc-500 dark:text-zinc-400">
                Live snapshot of research activity, funding, publications and team
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="inline-flex items-center gap-2 rounded-full bg-white/90 dark:bg-zinc-900/90
                ring-1 ring-zinc-200 dark:ring-zinc-800 px-3 py-1.5 text-[11px] text-zinc-600 dark:text-zinc-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Live data
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90
              ring-1 ring-zinc-200 dark:ring-zinc-800 px-3 py-1.5 text-[11px] text-zinc-600 dark:text-zinc-300">
              <CalendarDays className="h-3 w-3" />
              {today}
            </div>
          </div>
        </div>
      </header>

      <DashboardCharts stats={stats} />
    </div>
  );
}
