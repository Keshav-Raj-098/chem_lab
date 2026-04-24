import { fetchNewsAction } from "@/lib/news";
import { Timeline } from "@/components/pub/Timeline/Timeline";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vacancies | Chem Lab",
  description: "Join our research team. View current openings for PhD, PostDoc, and research positions.",
};

const VacancyPage = async () => {
  const result = await fetchNewsAction({
    type: "Vacancy",
    page: 1,
    pageSize: 20,
  });

  const news = result.success ? result.data : [];
  const hasMore = result.hasMore;

  return (
    <div className="min-h-screen bg-white">
      <header className="page-header">
        <div className="page-header-inner">
          <div className="page-header-eyebrow">Opportunities</div>
          <h1 className="page-header-title">Open Positions</h1>
          <p className="page-header-subtitle">
            Current openings for doctoral, postdoctoral, and research associate positions.
            Explore how you can contribute to chemical research at IIT Delhi.
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-16">
        <Timeline
          initialAwards={news || []}
          initialHasMore={hasMore || false}
          awardType="Vacancy"
          fetchAction={fetchNewsAction}
        />
      </div>
    </div>
  );
};

export default VacancyPage;
