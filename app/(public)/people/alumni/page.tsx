import { fetchAlumniAction } from "@/lib/load_data/loadAlumni";
import { Timeline } from "@/components/pub/Timeline/Timeline";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Group Alumni | Chem Lab",
  description:
    "Recognizing our former group members and their contributions to our research community.",
};

const AlumniPage = async () => {
  const result = await fetchAlumniAction({ page: 1, pageSize: 20 });

  const alumni = result.success ? result.data : [];
  const hasMore = result.hasMore;

  return (
    <div className="min-h-screen bg-white">
      <header className="page-header">
        <div className="page-header-inner">
          <div className="page-header-eyebrow">Our Community</div>
          <h1 className="page-header-title">Alumni</h1>
          <p className="page-header-subtitle">
            Celebrating former members of the laboratory and their continuing contributions
            to research, industry, and academia around the world.
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-16">
        <Timeline
          initialAwards={alumni || []}
          initialHasMore={hasMore || false}
          awardType="Alumni"
          fetchAction={fetchAlumniAction}
          showDate={false}
        />
      </div>
    </div>
  );
};

export default AlumniPage;
