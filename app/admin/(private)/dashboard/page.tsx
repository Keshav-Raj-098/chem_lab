import { getDashboardStats } from "@/lib/dashboard";
import { DashboardCharts } from "@/components/admin/DashboardCharts";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="px-6 py-7 space-y-8 w-full mx-auto">
      {/* ── Header ───────────────────────────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Analytics
          </h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
            ChemLab research database · live data
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
          {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </div>
      </div>

      <DashboardCharts stats={stats} />
    </div>
  );
}