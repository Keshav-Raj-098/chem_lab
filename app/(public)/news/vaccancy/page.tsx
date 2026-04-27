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
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Open Positions
        </h1>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10 pb-16">
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
