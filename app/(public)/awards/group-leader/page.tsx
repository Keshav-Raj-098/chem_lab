import { AwardType } from "@/lib/generated/prisma/enums";
import { fetchAwardsAction } from "@/lib/load_data/loadAwards";
import { Timeline } from "@/components/pub/Timeline/Timeline";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Group Leader Awards | Chem Lab",
  description: "Recognitions and awards received by our group leader for excellence in chemical research and academic contributions.",
};

const AwardsPage = async () => {
  const result = await fetchAwardsAction({
    type: AwardType.GROUP_LEADER,
    page: 1,
    pageSize: 20,
  });

  const awards = result.success ? result.data : [];
  const hasMore = result.hasMore;

  return (
    <div className="min-h-screen bg-white">
      <header className="page-header">
        <div className="page-header-inner">
          <div className="page-header-eyebrow">Awards &amp; Recognition</div>
          <h1 className="page-header-title">Group Leader Awards</h1>
          <p className="page-header-subtitle">
            A chronological record of honours, fellowships, and awards received in recognition of
            research excellence and academic contribution.
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-16">
        <Timeline
          initialAwards={awards || []}
          initialHasMore={hasMore || false}
          awardType={AwardType.GROUP_LEADER}
          fetchAction={fetchAwardsAction}
        />
      </div>
    </div>
  );
};

export default AwardsPage;
